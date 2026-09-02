---
title: 'AArch64 GIC and timer interrupt'
date: 2020-04-11T15:49:42+02:00
tags: ['rust', 'leos', 'aarch64']
summary: 'Programming guide for AArch64 GIC'
author: 'Ilja K.'
comments: true
---

Getting timer interrupt is a common task in todo list of OS developer. Although
it is very simple task on some architectures, to have it on AArch64 you need
to configure so called Interrupt Controller. From this post you will know how
to initialize Generic Interrupt Controller (GIC),
control priorities and target an interrupt to specific core.

## Preamble

About three weeks ago I've started with porting of my AArch64 bare metal
workouts written in C into
a [Kernel](https://github.com/lowenware/leos-kernel) in Rust. I have to admit
that I like the language more and more. Rust has a very smart compiler that
surprizes me with the optimization again and again, but still the language
provides quite flexible control of the final binary code.
And of course as an ex-C developer I appreciate namespaces and absence of
header files a lot.

I've faced several issues and lack of the information regarding GIC, so I
decided to highlight them here. As usually related code is available on
[GitHub](https://github.com/lowenware/leos-kernel/tree/d0d8eb8757b969f412bf0663727165589cbaf480).

## Interrupt Source

Any AArch64 CPU should have a generic timer, however some boards can also
contain external ones.
There are several timer related system registers:

- [CNTPCT_EL0](https://developer.arm.com/docs/ddi0595/c/aarch64-system-registers/cntpct_el0)
- physical counter value register

- [CNTP_CTL_EL0](https://developer.arm.com/docs/ddi0595/c/aarch64-system-registers/cntp_ctl_el0)
- physical counter control register

- [CNTP_TVAL_EL0](https://developer.arm.com/docs/ddi0595/c/aarch64-system-registers/cntp_tval_el0)
  and [CNTP_CVAL_EL0](https://developer.arm.com/docs/ddi0595/c/aarch64-system-registers/cntp_cval_el0)
- two threshold value registers

- [CNTFRQ_EL0](https://developer.arm.com/docs/ddi0595/c/aarch64-system-registers/cntfrq_el0)
- counter frequency register

If value from `CNTPCT_EL0` is less or equal to value from `CNTP_CVAL_EL0`, then
respectively to configuration from `CNTP_CTL_EL0`, timer can trigger an
interrupt request identified by number `30`.

> Developer can also write delta timer value to `CNTP_TVAL_EL0`, in that case
> `CNTP_CVAL_EL0` will be automatically populated with new value =
> `CNTP_TVAL_EL0` + `CNTPCT_EL0`.

To set up timer to trigger an interrupt in one second, following assembly
code could be used:

```asm
mrs x1, CNTFRQ_EL0
msr CNTP_TVAL_EL0, x1
mov x0, 1
msr CNTP_CTL_EL0, x0
```

To get timer interrupts continuously, it is necessary to reload timer threshold
value with first two instructions from previous listing.

> Maybe you've noticed I mentioned that timer is physical. There is also a
> virtual one, which is > in fact the same timer, but can be configured to
> count its value with some offset from physical > one. It can be accessed
> using own set of system registers.

## Generic Interrupt controller

Even if you have configured the timer to trigger an interrupt, it is not enough
to really get one fired. With AArch64 any interrupt must be distributed to a
target CPU first and it is a responsibility of an interrupt controller. But it
also provides many other possibilities of interrupts
masking and prioritization.

> It took me a while to realize, that interrupt controller is a board related
> component. Generic Interrupt Controller is just a common, but not the only
> way. Interrupt controller is a peripheral with memory mapped registers. It
> means that for boards with GIC, driver could be the same with only
> a difference in base address. But for some boards (Including Raspberry Pi
> 2 and 3), it could be necessary to implement own driver.

As long as I develop the Kernel for QEMU virtual device, base address of GIC
is `0x08000000` which is mapped to `0xffffffe0_08000000` by
[MMU](/blog/osdev/aarch64-mmu-programming/). Registers mapping is listed in
chapters 8.8 and 8.12 of
[GIC Architecture Specification](https://static.docs.arm.com/ihi0069/d/IHI0069D_gic_architecture_specification.pdf).

We need to dealt with just four registers to get timer interrupt fired:

```rust
// Distributor registors
const GICD_CTLR: *mut u32 = GICD_BASE as *mut u32;
const GICD_ISENABLER: *mut u32 = (GICD_BASE + 0x0100) as *mut u32;
// CPU interface Controller
const GICC_CTLR: *mut u32 = GICC_BASE as *mut u32;
const GICC_PMR: *mut u32 = (GICC_BASE + 0x0004) as *mut u32;
const GICC_BPR: *mut u32 = (GICC_BASE + 0x0008) as *mut u32;
```

First it is necessary to enable both _distributor_ and _CPU interface controller_

```rust
ptr::write_volatile(GICD_CTLR, 1);
ptr::write_volatile(GICC_CTLR, 1);
```

Second, for interface controller you need to set up Priority Mask Register. By
value in that register you can mask low priority interrupt, so they are never
fired. Here is also worth to mention that in GIC logic value `0xff`
corresponds to lowest priority, `0x00` corresponds to highest.

```rust
ptr::write_volatile(GICC_PMR, 0xff);
```

The last step is to enable Timer specific interrupt to be distributed to CPU
core, I've implemented it as a function:

```rust

// size of single register, each interrupt requires just one bit for configuration
const GICD_ISENABLER_SIZE: u32 = 32;

pub fn enable(interrupt: u32) {
    unsafe {
        ptr::write_volatile(
            GICD_ISENABLER.add((interrupt / GICD_ISENABLER_SIZE) as usize),
            1 << (interrupt % GICD_ISENABLER_SIZE)
        );
    }
}
```

As well to get timer interrupt continuosly, you will need to clear pending
interrupt on GIC:

```rust
const GICD_IPRIORITY_SIZE: u32 = 32;

pub fn clear(interrupt: u32) {
    unsafe {
        ptr::write_volatile(
            GICD_ICPENDR.add((interrupt / GICD_ICPENDR_SIZE) as usize),
            1 << (interrupt % GICD_ICPENDR_SIZE)
        );
    }
}
```

> For GIC driver I've also implemented methods to disable interrupt, set
> priority and target core, however default settings are enough for start.
> Full code of the driver can be found in the
> [GIC driver source](https://github.com/lowenware/leos-kernel/blob/d0d8eb8757b969f412bf0663727165589cbaf480/src/arch/aarch64/gic.rs).

## Interrupts handling

First of all, interrupts in AArch64 is a subtype of abstraction called
Exception. There are four types of Exceptions in AArch64:

1. _Sync_ or _Synchronous exceptions_ -- the ones triggered on execution, for
   example on attempt to access unexisting memory address.
2. _IRQ_ or _Interrupt requests_ -- interrupts generated by hardware peripherals
3. _FIQ_ or _Fast Interrupt Requests_ -- similar to _IRQ_, but have higher priority,
   so _FIQ_ interrupt service routine can not be interrupted by other _IRQ_ or _FIQ_.
4. _SError_ or _System Error_ -- asynchronous interrupt specifically for external
   Data Aborts.

Callbacks for Interrupt Servive Routines (ISR) must be provided to CPU using
table. In AArch64 that table is called _Exception Vector Table_. Table must be
alligned by 2048 bytes and contain 16 entries. Each entry inside the table is
named _Exception Vector_ and specificaly for AArch64 that vector is not just a
callback address, but actual ISR code. Size of the code is limited by _Exception
Vector_ size which is 128 bytes.

The table must contain 4 groups of vectors:

1. 4 exception vectors of each type for current exception level, if SP0 is
   selected by `SPSel` register
2. 4 exception vectors of each type for current exception level, if SPx is
   selected by `SPSel` register
3. 4 exception vectors of each type for lower exception level
4. 4 exception vectors of each type for lower exception level in 32 bit mode

For LeOS I've defined the table using assembly code:

```asm

.section .text.exceptions

.globl exception_vector_table
exception_vector_table:

.org 0x0000
    EXCEPTION_VECTOR el1_sp0_sync

.org 0x0080
    EXCEPTION_VECTOR el1_sp0_irq

.org 0x0100
    EXCEPTION_VECTOR el1_sp0_fiq

.org 0x0180
    EXCEPTION_VECTOR el1_sp0_error


.org 0x0200
    EXCEPTION_VECTOR el1_sync

.org 0x0280
    EXCEPTION_VECTOR el1_irq

.org 0x0300
    EXCEPTION_VECTOR el1_fiq

.org 0x0380
    EXCEPTION_VECTOR el1_error


.org 0x0400
    EXCEPTION_VECTOR el0_sync

.org 0x0480
    EXCEPTION_VECTOR el0_irq

.org 0x0500
    EXCEPTION_VECTOR el0_fiq

.org 0x0580
    EXCEPTION_VECTOR el0_error


.org 0x0600
    EXCEPTION_VECTOR el0_32_sync

.org 0x0680
    EXCEPTION_VECTOR el0_32_irq

.org 0x0700
    EXCEPTION_VECTOR el0_32_fiq

.org 0x0780
    EXCEPTION_VECTOR el0_32_error

```

Table is aligned using linker script:

```plaintext
    . = ALIGN(0x800);
    .text.exceptions : { *(.text.exceptions) }
```

And `.org` directives protect vectors from exceeding 128 bytes limit. Macro
`EXCEPTION_VECTOR` expands the code of interrupt which saves registers to the
stack and calls specific ISR function that implemented in Rust. Full code is
available in the
[exception vector table source](https://github.com/lowenware/leos-kernel/blob/d0d8eb8757b969f412bf0663727165589cbaf480/src/arch/aarch64/exceptions.s).

Address of the table has to be stored in `vbar_el1` register:

```asm
    ldr     x0, =exception_vector_table
    msr     vbar_el1, x0
```

As soon as timer triggers asynchronous interrupt request, it could be handled
using `el1_irq` callback.

```rust
#[no_mangle]
unsafe extern "C" fn el1_irq(ctx: &mut ExceptionCtx) {
    irq::handler(ctx);
}
```

## P.S

During development I was catching synchronous interrupts inside `write_fmt`
function from `core::fmt`. By analyzing with GDB I've found that content of
registers was corrupted. It happened because of my unsafe inline `asm!` calls
in timer initialization. Although the code was in separate module and formatted
output was inside `kernel_main`, it was optimised by compiler into a single
function and I've corrupted content of registers manually.

```rust
#[inline(never)]
pub fn init() {
        gic::init();
        gic::set_config(TIMER_IRQ, gic::ICFGR_EDGE);
        gic::set_priority(TIMER_IRQ, 0);
        gic::set_core(TIMER_IRQ, 0x01); // core0
        gic::clear(TIMER_IRQ);
        gic::enable(TIMER_IRQ);

    unsafe {
        asm!("mrs x1, CNTFRQ_EL0");
        asm!("msr CNTP_TVAL_EL0, x1");
        asm!("mov x0, 1");
        asm!("msr CNTP_CTL_EL0, x0");
    }
}
```

Temporary solution was to mark the function with `#[inline(never)]` so compiler
won't rely on registers `x0` - `x19` to be unchanged during the call. But
lesson learned: _stay safe when prototyping the code_. And it seems it is time
to prepare some safe abstractions and register accessors.
