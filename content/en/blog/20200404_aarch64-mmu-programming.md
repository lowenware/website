---
title: 'AArch64 MMU Programming'
date: 2020-04-04T12:12:54+01:00
tags: ['aarch64', 'leos', 'assembler']
summary: 'Understanding the MMU for AArch64'
author: 'Ilja K.'
comments: true
---

MMU stands for Memory Management Unit and it is responsible for virtual memory
address translation and memory access control. Being one of the most important
subjects of the OS development, it could be at the same time very confusing.
In this post I will try to clear out MMU programming process.

I've just merged the
[commit](https://github.com/lowenware/leos-kernel/commit/aa6def9a9dea74c671800fd715e12525f9c80fce)
containing MMU support implementation into master branch of [LeOS](/leos/)
repository. This post is not supposed to be a step by step tutorial, but more
a developer's guide. So if you are looking for the code, go straight to GitHub.

## Understanding the MMU

Let's start from the beginning of the boot process of application from
[previous post](/blog/osdev/aarch64-bare-metal-program-in-rust/). It was
compiled for the entry point at `0x40080000` address. This exact address comes
from the design of QEMU virtual device:

- `0x00000000 - 0x3FFFFFFF` is an area of memory mapped peripherals. Using
  addresses from this range you can access registers of multiple peripherals to
  configure and control them, just as we used output register located at
  `0x09000000` of UART to output a text string to the terminal.
- `0x40000000 - 0x4007FFFF` is an area reserved for a bootloader.
- And kernel (or any bare metal application) is being loaded at address
  `0x40080000`. registers of preipheral devices

Initial address, where your kernel will be loaded depends on the bootloader
implementation and if you are using existing hardware or emulator, then most
likely you will deal with existing bootloader, that will load your kernel file
at some predefined address.

> If you are about to try the same on Raspberry Pi 3, then start address will
> be `0x00000000`.

Also for some bootloaders you will have to use stripped binary instead of an
ELF file, so there will be no information about the entry point address for
your specific kernel at all. Being loaded somewhere in the memory, your kernel
will still work and even some branch operations could be successfully
performed, until you need to access or perform a long jump to an absolute
address. If your kernel was compiled for the entry point matching the load
address, it will work, otherwise behavior is undefined. This problem could be
completely solved by using of the MMU.

> And while it is just a side effect of MMU usage, I decided to start with it,
> because by understanding it, you will understand the whole concept.

So instead of having separate Kernel builds of each bootloader, we do
following:

1. Choose a virtual address that will be set as an entry point for the Kernel
   at compilation stage.
   For LeOS kernel I've chosen `0xfffffff0_00000000`. Later I will explain why.
2. As a first instruction of the Kernel code, save current address in some
   register that will be kept untouched for a while: `adr x20, .`
3. Implement position independent start code, that will initialize MMU and
   enable memory address translation from virtual `0xfffffff0_00000000` to real
   one stored in that register.
4. Perform a long jump to an entry function of the Kernel, `kernel_main` in
   case of `LeOS`.

What you also may want to do is to map mentioned above peripherals memory area,
that differs from [SoC](https://en.wikipedia.org/wiki/System_on_a_chip) to SoC
to a fixed virtual address. For LeOS it is set to be `0xffffffe0_00000000`.

Now let's see how address is being translated on AArch64.

## Address Translation Process

Jump to `kernel_main` function is a jump to `0xfffffff0_00000278` address for
current build. Translation process for that address is shown and described
bellow.

![AArch64 address translation](/blog/osdev/aarch64-mmu-address-translation.png)

1. MMU checks if highest 63..37 bits of the address are all set to 1 or to 0.
   In the first case, MMU will continue lookup using `ttbr1_el1` register and in
   the second case with `ttbr0_el1`. Difference between them will be explained
   later.
2. From chosen register MMU gets real memory address of the so called
   translation table L1.
   That table is just an array of 512 descriptors 8 bytes long each.
3. MMU uses bits 36..30 of the address as an index of the descriptor from L1
   table. For the example address it is index 64. The 64th descriptor of the L1
   contain address of L2 translation table.
4. MMU uses bits 29..21 as a descriptor's index of L2 table, which is 0 for
   the example. That
   descriptor contains an address of the last L3 translation table.
5. And bits 20..12 of the address are used by MMU as an index of a descriptor
   inside L3 translation table. For the example it is also 0. That descriptor
   contains an address of target 4KB memory page.
6. As a last step of the translation, MMU takes first 12 bits of the address
   as an offset inside target memory page. For the address the offset would be
   0x278 = 632 bytes.

For complete overview, here is a format of translation table descriptor for
this case:

```text
+---+--------+-----+-----+---+------------------------+---+----+----+----+----+------+----+----+
| R |   SW   | UXN | PXN | R | Output address [47:12] | R | AF | SH | AP | NS | INDX | TB | VB |
+---+--------+-----+-----+---+------------------------+---+----+----+----+----+------+----+----+
 63  58    55 54    53    52  47                    12 11  10   9  8 7  6 5    4    2 1    0

R    - reserve
SW   - reserved for software use
UXN  - unprivileged execute never
PXN  - privileged execute never
AF   - access flag
SH   - shareable attribute
AP   - access permission
NS   - security bit
INDX - index into MAIR register
TB   - table descriptor bit
VB   - validity descriptor bit
```

> You can get quite nice
> [documentation](https://developer.arm.com/docs/100940/0101/armv8-A-address-translation)
> for address translation process on ARM website. It was my handbook during
> development.

Looks complicated, doesn't it? I will try to clarify everything step by step,
but first here is supposed to be a reasonable question.

## Why we need this?

Long story short, for security. MMU allows to build independent isolated
virtual address spaces. Each process inside the operating system can run in his
own address space, thinking he is alone in the memory, without any possibility
of access to code or data of other processes. In fact the process could be
allocated at any address of physical memory and even be fragmented.

By splitting memory into pages, MMU allows to specify special attributes for
each page in the descriptors inside translation tables. Using these attributes
OS can control write and execute permissions, priviliged access, cache options
and even OS itself specific features.

AArch64 MMU comes with separate translation table base registers for specific
exception levels. It allows, for example, always to keep Kernel address space
loaded inside `ttbr1_el1` register, keeping its cache always valid even during
context switching, that will affect only user space, by
reloading of `ttbr0_el1`.

## Translation options

Address translation example from above is not comprehensive. There are various
options that developer can choose between and the choice can significantly
change the behavior of MMU, so it is important to understand them all.

1. Configuration of the MMU is done by
   [Exception Level](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.ddi0488c/CHDHJIJG.html)
   specific
   [translation control register](https://developer.arm.com/docs/100095/0002/system-control/aarch64-register-descriptions/translation-control-register-el1).
   EL1 exception level is supposed to be used by a Kernel, while EL0 as a less
   privileged, for user applications. There are also EL2 and EL3 for
   virtualization and hypervisor. From here I will speak
   mainly about EL1, but keep in mind there are other exception levels too.

2. AArch64 splits address space into **lower and higher half** giving possibility
   to configure them separately. Registers and their properties for lower half
   part are marked with 0:
   `TTBR0_EL1`, `TCR_EL1.T0SZ`, while higher half ones are marked with 1:
   `TTBR1_EL1`, `TCR_EL1.T1SZ`.

3. **Translation Granule** is the size of a page - a minimal memory area that
   could be mapped. It is controlled by `TG0` and `TG1` fields of `TCR_EL1`
   register and can be 4KB, 16KB or 64KB. A change of the translation granule
   changes everything: size of page, so size of translation table too, so number
   of address bits treated as indexes, so number of translation levels and size
   of output address inside the descriptor.

4. **Size of address space** is also configurable by `T0SZ` and `T1SZ` fields of
   `TCR_EL1` register. Value inside the fields represents number of higher bits
   excluded from translation process. These bits must be all 1 or all 0 in
   dependency of address space half. If you scroll up to address translation
   example, you may see that for index of L1 table only 7 bits are used, while
   for other tables there are 9. It is because `T1SZ` is set to 27. It also
   removes one extra translation level L0 as unnecessary, because address space
   is limited by `64 - 27 = 37` bits, which still allows to address up to 128GB
   of RAM, that is 8 times higher than I have on my current workstation.
   Worth to mention, that number of translation levels affects speed of
   translation process.

5. **Descriptor validity** is controlled by zero bit of descriptor in translation
   table. If the bit is set to 1, descriptor is valid and MMU will use the
   descriptor for translation. If the bit is set to 0, MMU will trigger an
   Exception and OS can handle it in some way, by memory allocation or
   termination of the process that tried to access wrong memory address.

6. **Block mapping** is another option of descriptors in translation tables. It is
   controlled by first bit of the descriptor, defining, how MMU should treat
   target address: as address of next translation table or as target address.
   This feature allows to map larger areas of memory than
   page size defined by _translation granule_. For 4KB _granule_ it is possible to
   map blocks of `4KB * 512 = 2MB` and `2MB * 512 = 1GB`, which is very useful
   on practice.

7. OS can **controll access** to memory pages and blocks by `AP` field of the
   descriptor, marking some pages as `read-only` and explicitly allowing or
   closing access from unprivileged `exception level`.

8. Another possibility that OS can use is to mark pages as **non-executable
   as well separately for privileged Kernel and unprivileged user exception
   level.

9. AArch64 also provides 2 **Memory Attribute Indirection Registers
   ([MAIR](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.ddi0500d/B4BEIDGHFH.html))
   for flexible configuration of memory areas. You can think about _MAIRs_ as of an
   array with 8 elements each of 8 bits long. You can store inside _MAIRs_ up to 8
   attributes sets and reffer them by the index 0..7 stored in `INDX` field of the
   descriptor.

## Implementation Tips

As a final stage of this post, I would like to share with you some development
and troubleshooting tips that could help you with own implementation.

### Decide on translation granule size

For small applications 4KB size is a good choice and as an adept of simple
kernels, I would also recommend it for a kernel. But most important is to
focus only on one case if you are just starting with MMU programming, because
otherwise it could produce unwanted mess in your head, so keep it simple.

> For some reason, AArch64 uses different formats for `TG0` and `TG1` values.
> For example, for 4KB granule I had to set `TG0=0b00` and `TG1=0b10`. Always
> refer official documentation to avoid mistakes.

Don't forget, that target addresses inside the descriptors must be aligned by
granule size. You can achieve that by using of macroses inside your assembler
code or by linker script:

```plaintext
    . = ALIGN(0x1000);
    LD_TTBR1_BASE = .;
    . = . + 0x1000;
```

### Start with block mapping

It is enough to start with just one translation table and with just one
descriptor stored inside, that will map, for example, 1GB of RAM, covering
all the area of your kernel or even all available memory. Translation process
is hard to debug, so as less places where you can make a mistake, as
easier it will be to find where is the problem.

### Start with identity mapping

_Identity_ is way of memory mapping when your virtual addresses map to the same
addresses of physical memory. It is not a good practice in general, because it
is less secure and more confusing on complex systems, but for the beginning it
is absolutely normal and even necessary thing to do.

It is necessary because after you enable MMU, link register of the CPU will
point to next instruction by real physical address and in case if there is no
identity mapping, MMU will trigger an exception. Handling this exception could
be a solution, but probably it is not a way for proof-of-concept application.

For _Identity_ mapping you can initialize `TCR_EL1` registers with small 2 bytes
value and get working example.

### Allow everything

Configure your memory block in the descriptor as executable and writeable for
all exception levels, initialize `MAIR` with `0xFF` value (normal memory) and
reffer it as `0b000`.

### Add translation levels

When you got your translation for identity mapping working, try add next level
of translation. When it is ready add next, until you reach the final level for
your _granule_ size.

> Don't forget to change first bit of descriptor for upper translation levels.
> It is a very common source of problems.

When you have all translation levels, you can configure differently pages for
code, read-only data and normal data. Write attempt to read-only memory will
trigger an Exception and you should easily notice it in your debugger.

### Map peripherals memory

Peripherals memory area should be mapped differently and the right place to
start is `MAIR` register. I've end up with `0b00000100` value, that corresponds
to Device-nGnRE memory (non-cacheble). Don't forget to use proper attribute
index inside the descriptor.

### Map kernel at higher half of memory

It is a common practice to map kernel at higher half and applications at lower
half. It helps to isolate kernel from user applications and even simplify life
of the developer a bit, because by the address of some value or instruction you
can easily guess where did the error or exception happen.

> When you implement translation tables for Kernel in upper half, don't forget
> to check the value of `T1SZ` field of `TCR_EL1`. The value inside this
> define, how many higher bits of your virtual address must be set to 1. You
> can come in the situation, that your translation tables set up properly, but
> you refer wrong address, lets say `0xffffff00_00000000` instead of
> `0xfffff000_00000000`.

### Troubleshooting

Debugger, pencil and a sheet paper are your best friends. It is useful to draw
a scheme like one above for your granule size and pretend you are an MMU and
just follow each step of translation. I was also writing down addresses of
some instructions to manualy put breakpoints in GDB after I did
changes to the code.

But if MMU does not work for you, make sure that

1. Your translation tables are aligned according to _granule size_

2. Proper target addresses inside descriptors are stored in translation tables
   at proper offsets

3. Block descriptors are marked as blocks and table descriptors as table
   descriptors

4. Descriptors contain proper access permissions for pages

5. Values inside `T0SZ` and `T1SZ` fields correspond to number of unset or set
   bits of your virtual address

6. If you changed values of these fields, you have also updated linker script
   with actual entry point for your kernel

One of the most useful GDB commands could be a memory examination:

```plaintext
x 0xfffffff000000278
```

This will show content of memory at this address or error message if it is
unreadable.

I hope it was useful. I have found several code examples of MMU programming,
some of them were even working out of the box. But when I tried to make it on
my own, I have faced many issues and it was hard to find practical tips on
what to do, so I decided to gather them all in one place and
maybe describe everything from another side, so reader can have better
overview of the techniques.

If you have any question regarding MMU, feel free to leave a comment bellow,
I would be glad to help. Also let me know if I have missed something or you
would like to have more information on subject in format of text or video.
