---
title: 'AArch64 Bare-Metal program in Rust'
date: 2020-03-23T09:21:36+01:00
summary: 'How to write a simple bare metal program in Rust for AArch64'
tags: ['rust', 'aarch64', 'assembler', 'disassembly', 'leos']
author: 'Ilja K.'
comments: true
---

From this post you can learn how to write a simple bare metal program in Rust
for ARM AArch64 architecture, run it with QEMU on virtual device, attach a
debugger and disassemble it.

## Introduction

Rust is a modern programming language positioned as safe, productive and
suitable for system level development. It comes with its own packaging system
and various utilities for management, compilation, linking and even code
formatting. The language is very versatile and multifaceted, so it could take
some time to understand and get used to it.

I wanted to try it for ARM AArch64 programming, but realised that there is
not much information about usage of Rust for this architecture and all examples
that I have found were out-of-date and required some additional efforts to make
them working. So I decided to write about how to get started with Rust and
AArch64 with a hope it will be useful for somebody else.

## Preparing Environment

[Install rustup](https://www.rust-lang.org/tools/install) - a toolchain manager
for Rust. The process depends on your operating system, but if you are on Linux
I would recommend to start from searching for the `rustup` package in your
native package manager. Once you have it installed, execute

```shell
rustup update
```

Now you should have the following set of tools installed on your system:

- rustup -- toolchain installer
- rustc -- compiler
- rust-gdb -- GNU debugger
- cargo -- package manager (in Rust ecosystem packages are being called _crates_)

In addition to that you will need:

- [QEMU](https://qemu.org/) - processor emulator
- AArch64 bare metal target
  [GCC toolchain](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-a/downloads)
- Multiarch
  [GNU debugger](https://www.gnu.org/software/gdb/)
  (optional, `aarch64-none-elf-gdb` from the toolchain could be used instead)

### Installing Toolchain

To compile a code for AArch64, we will need the
[nightly](https://github.com/rust-lang/rustup#working-with-nightly-rust)
toolchain installed. To install it and set it as default, execute the following
command:

```shell
rustup default nightly
```

### Installing a Sysroot Manager

To perform a cross-build it is necessary to have a `sysroot` for target
platform with binaries for standard crates. Making it manualy is not something
I would recommend to do, but fortunately
there are two third party solutions that can automate a process:
[xargo](https://github.com/japaric/xargo) and its simplified fork
[cargo-xbuild](https://github.com/rust-osdev/cargo-xbuild).

I decided to stick with `cargo-xbuild`, that can work as a wrapper for `cargo`,
later you will see it in action, but now to install it execute

```shell
cargo install cargo-xbuild
```

You will also need to install Rust sources for cross-compilation of default
language components. It can be done using `rustup`.

`rust-src` component using

```shell
rustup component add rust-src
```

## Starting a Project

Now we have all the tools we need. To start a new project, the `cargo` utility
can be used. Run it as follows

```shell
cargo new aarch64-bare-metal --bin --edition 2018
```

- `aarch64-bare-metal` - name of the project
- `--bin` flag says we are about to create an application (not library)
- `--edition 2018` - structure should correspond
  [2018's cargo edition](https://doc.rust-lang.org/nightly/edition-guide/rust-2018/index.html)

The file structure should be something like this:

```shell
+ aarch64-bare-metal/
| + src/
| | - main.rs
| - Cargo.toml
```

If you have [git](https://git-scm.com/) installed, you will also find a
preinitiated repository inside.

## Writing a Program

Open your favorite text editor and bring contents of the newly created
`src/main.rs` file to this one:

```rust
#![no_std]
#![no_main]
#![feature(global_asm)]

use core::ptr;

mod panic;

global_asm!(include_str!("start.s"));

#[no_mangle]
pub extern "C" fn not_main() {
    const UART0: *mut u8 = 0x0900_0000 as *mut u8;
    let out_str = b"AArch64 Bare Metal";
    for byte in out_str {
        unsafe {
            ptr::write_volatile(UART0, *byte);
        }
    }
}
```

Several things should be commented out here. First of all, we use `#![no_std]`
to disable linking with the standard library and `#![no_main]` to use an entry
point to our application other than the `not_main` function. The actual entry
point will be defined in _linker script_ as `_start` function and implemented in
the `start.s` assembly file. It has to be done like this, because our program
will start up on CPU boot when there is no OS and stack pointer defined yet,
so we have to do it manually in assembly language.

To use inline assembly we should enable the `global_asm` feature and then we
can include whole file `start.s` using `include_str`.

We use the `#[no_mangle]` attribute to disable
[name mangling](https://en.wikipedia.org/wiki/Name_mangling)
and keep the `not_main` function's symbol name as-is, at the same time with
`extern "C"` to use the
[C calling convention](https://en.wikipedia.org/wiki/Calling_convention),
so we can call the function outside of Rust code.

And the most significant part of our program is concentrated inside the
`not_main` function. It performs a character by character writing of the
`AArch64 Bare Metal` string at address `0x0900_0000`, which is a memory mapped
address of the UART0 peripheral of QEMU.

---

Now create next the rust file `panic.rs` in the same folder, containing this:

```rust
use core::panic::PanicInfo;

#[panic_handler]
fn on_panic(_info: &PanicInfo) -> ! {
    loop {}
}
```

We have to define an `on_panic` function with a `#[panic_handler]` attribute
as a handler that will be used by the compiler in _panic_ situations. It is worth
to mention that Rust implements the tiered
[Unwinding](https://doc.rust-lang.org/nomicon/unwinding.html)
error handling process, responsible for calling destructors, releasing memory
in case of panic and continuing the execution of the application. It is a quite
complicated function that requires OS-dependent libraries, but for now we have
no other choice than to bypass it.

> I would prefer to keep this handler in `main.rs` for simplicity, but for some
> reason in that case the compiler never uses a linker script (we will prepare
> it soon). And without it the program will be compiled for a wrong entry
> address and may not work properly.

---

Now create a file `start.s` inside the `src/` folder with the following content:

```rust
.globl _start
.extern LD_STACK_PTR

.section ".text.boot"

_start:
    ldr     x30, =LD_STACK_PTR
    mov     sp, x30
    bl      not_main

.equ PSCI_SYSTEM_OFF, 0x84000008
.globl system_off
system_off:
    ldr     x0, =PSCI_SYSTEM_OFF
    hvc     #0
```

It is very small and simple. First we define the `_start` symbol as global,
then initialize the stack with the address `0x40004000` and call the `not_main`
function defined in `main.rs`. Once it returns, the execution goes to the
`system_off` label, where a CPU shutdown is called using the hypervisor call
instruction `hvc`.

## Writing Linker Script

For our program we need a very simple linker script. Create a file named
`aarch64-qemu.ld` in the project root folder with this content:

```plaintext
ENTRY(_start)
SECTIONS
{
    . = 0x40080000;
    .text.boot : { *(.text.boot) }
    .text : { *(.text) }
    .data : { *(.data) }
    .rodata : { *(.rodata) }
    .bss : { *(.bss) }

    . = ALIGN(8);
    . = . + 0x4000;
    LD_STACK_PTR = .;
}
```

There are two important things here:

- With the `ENTRY(_start)` symbol `_start` from `start.s`, the file is being
  declared as an entry point to our program, the point from which execution must
  begin.
- `. = 0x40080000;` is a memory address, where our executable will be loaded by
  QEMU. To find out that address and why it is important, I will explain in my
  next post about programming MMU.

## Configuring Target

To get a full list of supported targets, you can execute
`rustc --print target-list`. A common practice of targets naming is usage of
[triples](https://clang.llvm.org/docs/CrossCompilation.html#target-triple),
consisting of
&lt;CPU Architecture&gt;-&lt;Vendor name&gt;-&lt;OS&gt;-&lt;ABI&gt;.

For bare metal programs, `aarch64-unknown-none` is preferable. To cross build,
we will need to provide the target specifications in a JSON format. The command
below will get the default specification for `aarch64-unknown-none` and store
it in the file `aarch64-unknown-none.json`:

```shell
rustc -Z unstable-options --print target-spec-json --target aarch64-unknown-none > aarch64-unknown-none.json
```

Open that file in a text editor and add the following snippet inside the root
object, to ask the Rust compiler to use our
[linker script](#writing-linker-script):

```json
    "pre-link-args": {
        "ld.lld": ["-Taarch64-qemu.ld"]
    },
```

So, in the end, contents of your `aarch64-unknown-none.json` file should look
like this:

```json
{
  "abi-blacklist": ["stdcall", "fastcall", "vectorcall", "thiscall", "win64", "sysv64"],
  "arch": "aarch64",
  "data-layout": "e-m:e-i8:8:32-i16:16:32-i64:64-i128:128-n32:64-S128",
  "disable-redzone": true,
  "env": "",
  "executables": true,
  "features": "+strict-align,+neon,+fp-armv8",
  "is-builtin": true,
  "linker": "rust-lld",
  "linker-flavor": "ld.lld",
  "linker-is-gnu": true,
  "pre-link-args": {
    "ld.lld": ["-Taarch64-qemu.ld"]
  },
  "llvm-target": "aarch64-unknown-none",
  "max-atomic-width": 128,
  "os": "none",
  "panic-strategy": "abort",
  "relocation-model": "static",
  "target-c-int-width": "32",
  "target-endian": "little",
  "target-pointer-width": "64",
  "vendor": ""
}
```

## Build and Run

Finally we are ready to compile the program! At this stage our project
structure should look like this:

```shell
+ aarch64-bare-metal/
| + src/
| | - main.rs
| | - panic.rs
| | - start.s
| - Cargo.toml
| - aarch64-unknown-none.json
| - aarch64-qemu.ld
```

And building for the _dev_ profile should be as easy as:

```shell
cargo xbuild --target=aarch64-unknown-none.json
```

And for the _release_ profile:

```shell
cargo xbuild --target=aarch64-unknown-none.json --release
```

If you are curious about how `sysroot` is being managed by _xbuild_, you can add
`-v` to these command flags for verbose output.

After building, the `target/` folder will appear in the project root folder
and compiled executables can be found inside:

- `target/aarch64-unknown-none/debug/aarch64-bare-metal`: debug build
- `target/aarch64-unknown-none/release/aarch64-bare-metal`: release build

The difference between these two builds is that the one from the `release`
folder is optimised and does not contain debug symbols, while the `debug` one
does. Both of them are ELF files that are ready to be
executed in QEMU and called with the following parameters:

```shell
qemu-system-aarch64 -machine virt \
  -m 1024M \
  -cpu cortex-a53 \
  -nographic \
  -kernel target/aarch64-unknown-none/debug/aarch64-bare-metal

```

You shall see in terminal the following output from our program:

```shell
AArch64 Bare Metal
```

## Disassembly

Disassembly is a very important part of low level development. You may want to
use it for troubleshooting, analysing and optimisation. This requires from the
developer knowledge of both the target architecture and its assembly language.
Experience comes up with time, but the good news is that
AArch64 assembly is much more user friendly and intuitive than let's say x86.

To disassemble out the program we will use _objdump_ utility from GNU toolchain:

```shell
aarch64-none-elf-objdump --disassemble-all target/aarch64-unknown-none/debug/aarch64-bare-metal
```

The full listing has about 4k lines, so I will not bring it all here, but just
one interesting part:

```plaintext

00000000400011b4 <_ZN4core3ptr14write_volatile17hf16241fac42e4551E>:
//  address:  code:     instruction:
    400011b4: d10043ff  sub  sp, sp, #0x10  // decrement stack pointer by 16 bytes
    400011b8: f90003e0  str  x0, [sp]       // store in stack value from register x0 (it has target address 0x0900_0000 in our case)
    400011bc: 39003fe1  strb w1, [sp, #15]  // store in stack one byte from register w1 (it has character to output)
    400011c0: 39000001  strb w1, [x0]       // store byte from w1 at address in x0 (actually output a character to UART)
    400011c4: 910043ff  add  sp, sp, #0x10  // increment stack pointer by 16 bytes
    400011c8: d65f03c0  ret                 // return
```

This is the disassembled function `ptr::write_volatile`, that we used for
writing bytes to UART.
Here you can see mentioned above name mangling in action:
`_ZN4core3ptr14write_volatile17hf16241fac42e4551E`. But you also probably
noticed how ineffective it is : instead of 1 instruction we actually need
`strb w1, [x0]`, so we have 6 extra instructions for
nothing.

> To be honest, when I saw it for the first time I was about to stop further
> learning of Rust. But
> fortunately I did the same disassembly for `release` build.

```shell
aarch64-none-elf-objdump --disassemble-all target/aarch64-unknown-none/release/aarch64-bare-metal
```

And surprisingly the listing is just 66 lines long, so I will bring it almost
completely:

```plaintext
1: Disassembly of section .text.boot:
2:
3: 0000000040001000 <_start>:
4:     40001000: 580000de  ldr x30, 40001018 <system_off+0xc>
5:     40001004: 910003df  mov sp, x30
6:     40001008: 94000008  bl  40001028 <not_main>
7:
8: 000000004000100c <system_off>:
9:     4000100c: 580000a0  ldr x0, 40001020 <system_off+0x14>
10:    40001010: d4000002  hvc #0x0
11:    40001014: d503201f  nop
12:    40001018: 400050b0  .inst 0x400050b0 ; undefined
13:    4000101c: 00000000  .inst 0x00000000 ; undefined
14:    40001020: 84000008  ld1sb {z8.s}, p0/z, [x0, z0.s, uxtw]
15:    40001024: 00000000  .inst 0x00000000 ; undefined

```

This part looks very similar to what we have in the `start.s` file with a
couple exceptions. I manually added line numbers for easier reference. On
line _4_ there is a loading of an 8-byte address from 0x40001018. And below on
line _12_, there is an address where the compiler had stored the value
of `LD_STACK_PTR`, which is `400050b0`. A similar storage was done for
`PSCI_SYSTEM_OFF` constant, see lines _9_ and _14_.

Now let's take a look on the `not_main` function:

```plaintext
// listing of not_main function: all done inline!
0000000040001028 <not_main>:
    40001028: 52a12008  mov  w8, #0x9000000 // UART0 address
    4000102c: 52800829  mov  w9, #0x41      // A
    40001030: 52800e4a  mov  w10, #0x72     // r
    40001034: 52800c6b  mov  w11, #0x63     // c
    40001038: 39000109  strb w9, [x8]
    4000103c: 39000109  strb w9, [x8]
    40001040: 52800d09  mov  w9, #0x68      // h
    40001044: 3900010a  strb w10, [x8]
    40001048: 3900010b  strb w11, [x8]
    4000104c: 528006cb  mov  w11, #0x36     // 6
    40001050: 39000109  strb w9, [x8]
    40001054: 52800689  mov  w9, #0x34      // 4
    40001058: 3900010b  strb w11, [x8]
    4000105c: 5280040b  mov  w11, #0x20     // _
    40001060: 39000109  strb w9, [x8]
    40001064: 52800849  mov  w9, #0x42      // B
    40001068: 3900010b  strb w11, [x8]
    4000106c: 39000109  strb w9, [x8]
    40001070: 52800c29  mov  w9, #0x61      // a
    40001074: 39000109  strb w9, [x8]
    40001078: 3900010a  strb w10, [x8]
    4000107c: 52800caa  mov  w10, #0x65     // e
    40001080: 3900010a  strb w10, [x8]
    40001084: 3900010b  strb w11, [x8]
    40001088: 528009ab  mov  w11, #0x4d     // M
    4000108c: 3900010b  strb w11, [x8]
    40001090: 52800e8b  mov  w11, #0x74     // t
    40001094: 3900010a  strb w10, [x8]
    40001098: 52800d8a  mov  w10, #0x6c     // l
    4000109c: 3900010b  strb w11, [x8]
    400010a0: 39000109  strb w9, [x8]
    400010a4: 3900010a  strb w10, [x8]
    400010a8: d65f03c0  ret
```

There is no call to `ptr::write_volatile` at all, but very well optimized for
performance code:

- ASCII characters are being written directly to registers using `mov`
  instructions
- Letters `A`, `a`, `r`, `e` are being moved just once and same registers
  reused later
- No stack usage, no extra swapping of registers

This is just amazing!

## Attaching Debugger

Debugging is an essential part of low level development. When you are
programming the MMU, interrupts or drivers, sometimes it is the only way to
find out what is going wrong with your code. For real hardware you may require
an external hardware debugger (and maybe even soldering skills), but for the
QEMU virtual device you need just two additional flags `-S -s` to the command
we already used. These flags tell QEMU to pause the execution, open a TCP
socket on the default port `1234` and wait for the GNU debugger to connect.

```shell
qemu-system-aarch64 -machine virt -m 1024M -cpu cortex-a53 -nographic -kernel target/aarch64-unknown-none/debug/aarch64-bare-metal -S -s
```

Now it is turn for the `gdb-multiarch`, but before we start, let's prepare a
configuration file `release.gdb` in the project root directory for it:

```plaintext
set disassemble-next-line on
set confirm off
add-symbol-file target/aarch64-unknown-none/release/aarch64-bare-metal
target remote tcp::1234
set arch aarch64
layout regs
```

Now run `gdb-multiarch` in another terminal window with the following command:

```shell
gdb-multiarch -x debug.gdb
```

![Debug Rust program with gdb-multiarch on AArch64](/blog/osdev/aarch64-rust-debug.png)

### GDB Cheatsheet

GDB has its own console, which is a big stress for beginners. But there is a
small and easy set of commands to remember for a quick start :

- `break <fn|addr>` or `b <fn|addr>`: put a breakpoint, usage: `b not_main`,
  `b *0x40001010`
- `break <fn> if <condition>`: conditional breakpoint, usage:
  `break context_switch if next == init_task`
- `clear`: clear breakpoint, usage `clear not_main`
- `si` or `stepi`: execute one machine instruction, step into if it is a
  function call
- `ni` or `nexti`: execute one machine instruction, but over step if it is
  a function call
- `c` or `continue`: resume execution until next breakpoint

---

## Afterwords

I've been working on a kernel for [LeOS](/leos/) in C for a while. After
implementing of multitasking, and switching between exception levels, I've
started with MMU programming. When I made it work I realized that it is a good
time to make some refactoring and rebasing of everything I made.
At the same time I decided to take a look at Rust and even consider it as main
language for the kernel.

I have spent a couple of days on the application from this post, understanding
the Rust ecosystem and other researches. Now when I am finishing writing I
already know, that results of this will form the basis of the
[first commit](https://github.com/lowenware/leos-kernel/tree/8474474351390c483bf2a668c4c5986c4dd1c44a)
to the [LeOS Kernel](https://github.com/lowenware/leos-kernel.git) repository.
