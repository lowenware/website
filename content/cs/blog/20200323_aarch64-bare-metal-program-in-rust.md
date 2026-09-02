---
title: 'Bare-metal program pro AArch64 v Rustu'
date: 2020-03-23T09:21:36+01:00
summary: 'Jak napsat jednoduchý bare-metal program v Rustu pro AArch64'
tags: ['rust', 'aarch64', 'assembler', 'disassembly', 'leos']
author: 'Ilja K.'
comments: true
---

V tomto článku se dozvíte, jak napsat jednoduchý bare-metal program v Rustu pro
architekturu ARM AArch64, spustit jej pomocí QEMU na virtuálním zařízení,
připojit debugger a provést disassemblování.

## Úvod

Rust je moderní programovací jazyk navržený s důrazem na bezpečnost,
produktivitu a vývoj systémového softwaru. Nabízí vlastní balíčkovací systém
a různé nástroje pro správu, překlad, linkování, a dokonce i formátování kódu.
Jazyk je velmi všestranný, takže jeho pochopení a osvojení může chvíli trvat.

Chtěl jsem jej vyzkoušet pro programování ARM AArch64, zjistil jsem však, že
informací o použití Rustu pro tuto architekturu není mnoho a všechny nalezené
příklady byly zastaralé a vyžadovaly další práci, aby fungovaly. Rozhodl jsem se
proto popsat první kroky s Rustem a AArch64 v naději, že to pomůže i někomu
dalšímu.

## Příprava prostředí

[Nainstalujte rustup](https://www.rust-lang.org/tools/install), správce toolchainů
pro Rust. Postup závisí na operačním systému; v Linuxu doporučuji nejprve
vyhledat balíček `rustup` v nativním správci balíčků. Po instalaci spusťte:

```shell
rustup update
```

V systému byste nyní měli mít následující nástroje:

- rustup – instalátor toolchainů
- rustc – překladač
- rust-gdb – debugger GNU
- cargo – správce balíčků (balíčky se v ekosystému Rust nazývají _crates_)

Dále budete potřebovat:

- [QEMU](https://qemu.org/) – emulátor procesoru
- [toolchain GCC](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-a/downloads)
  pro cílovou bare-metal platformu AArch64
- vícearchitekturní
  [debugger GNU](https://www.gnu.org/software/gdb/)
  (volitelně lze místo něj použít `aarch64-none-elf-gdb` z toolchainu)

### Instalace toolchainu

K překladu kódu pro AArch64 potřebujeme
[nightly](https://github.com/rust-lang/rustup#working-with-nightly-rust)
toolchain. Nainstalujete jej a nastavíte jako výchozí příkazem:

```shell
rustup default nightly
```

### Instalace správce sysroot

Pro cross-build je nutný `sysroot` cílové platformy s binárními soubory
standardních crates. Ruční přípravu nedoporučuji, naštěstí ji automatizují dvě
řešení třetích stran: [xargo](https://github.com/japaric/xargo) a jeho
zjednodušený fork [cargo-xbuild](https://github.com/rust-osdev/cargo-xbuild).

Zvolil jsem `cargo-xbuild`, který funguje jako obálka pro `cargo`. Později jej
uvidíte v praxi; nyní jej nainstalujte:

```shell
cargo install cargo-xbuild
```

Pro cross-compilation výchozích komponent jazyka je také nutné nainstalovat
zdrojové kódy Rustu. Komponentu `rust-src` přidáte pomocí `rustup`:

```shell
rustup component add rust-src
```

## Založení projektu

Nyní máme všechny potřebné nástroje. Nový projekt vytvoříme pomocí `cargo`:

```shell
cargo new aarch64-bare-metal --bin --edition 2018
```

- `aarch64-bare-metal` – název projektu
- příznak `--bin` říká, že vytváříme aplikaci, nikoli knihovnu
- `--edition 2018` – struktura má odpovídat
  [edici Cargo 2018](https://doc.rust-lang.org/nightly/edition-guide/rust-2018/index.html)

Struktura souborů by měla vypadat přibližně takto:

```shell
+ aarch64-bare-metal/
| + src/
| | - main.rs
| - Cargo.toml
```

Máte-li nainstalovaný [git](https://git-scm.com/), najdete uvnitř také předem
inicializovaný repozitář.

## Píšeme program

V oblíbeném textovém editoru nahraďte obsah nově vytvořeného souboru
`src/main.rs` následujícím kódem:

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

Několik částí si zaslouží vysvětlení. Pomocí `#![no_std]` zakážeme linkování se
standardní knihovnou a `#![no_main]` nám umožní použít jiný vstupní bod aplikace
než funkci `not_main`. Skutečný vstupní bod bude v _linker skriptu_ definován
jako funkce `_start` a implementován v souboru assembleru `start.s`. Je to
nutné, protože program se spustí při startu procesoru, kdy ještě neexistuje
operační systém ani nastavený ukazatel zásobníku. Musíme jej tedy nastavit ručně
v assembleru.

Pro vložený assembler povolíme funkci `global_asm` a poté můžeme pomocí
`include_str` vložit celý soubor `start.s`.

Atributem `#[no_mangle]` vypneme
[komolení názvů](https://en.wikipedia.org/wiki/Name_mangling), aby symbol funkce
`not_main` zůstal nezměněný. Současně pomocí `extern "C"` použijeme
[konvenci volání jazyka C](https://en.wikipedia.org/wiki/Calling_convention),
což umožní funkci volat mimo kód Rust.

Nejdůležitější část programu je uvnitř funkce `not_main`. Zapisuje řetězec
`AArch64 Bare Metal` znak po znaku na adresu `0x0900_0000`, což je paměťově
mapovaná adresa periferie UART0 v QEMU.

---

Ve stejné složce vytvořte soubor `panic.rs` s tímto obsahem:

```rust
use core::panic::PanicInfo;

#[panic_handler]
fn on_panic(_info: &PanicInfo) -> ! {
    loop {}
}
```

Musíme definovat funkci `on_panic` s atributem `#[panic_handler]`, kterou
překladač použije při stavu _panic_. Rust implementuje vícefázový mechanismus
zpracování chyb
[Unwinding](https://doc.rust-lang.org/nomicon/unwinding.html), který při panic
volá destruktory, uvolňuje paměť a pokračuje v běhu aplikace. Jde o poměrně
složitou funkci závislou na knihovnách operačního systému, takže ji prozatím
musíme obejít.

> Kvůli jednoduchosti bych tento handler raději ponechal v `main.rs`, ale
> překladač pak z nějakého důvodu nikdy nepoužije linker skript, který brzy
> připravíme. Program by se bez něj přeložil pro chybnou vstupní adresu
> a nemusel by správně fungovat.

---

Nyní ve složce `src/` vytvořte soubor `start.s` s následujícím obsahem:

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

Je velmi krátký a jednoduchý. Nejprve definujeme symbol `_start` jako globální,
poté inicializujeme zásobník adresou `0x40004000` a zavoláme funkci `not_main`
z `main.rs`. Po jejím návratu pokračuje běh na návěští `system_off`, kde se
procesor vypne hypervisorovou instrukcí `hvc`.

## Píšeme linker skript

Program potřebuje velmi jednoduchý linker skript. V kořenové složce projektu
vytvořte soubor `aarch64-qemu.ld` s tímto obsahem:

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

Důležité jsou dvě věci:

- Symbol `_start` ze souboru `start.s` je pomocí `ENTRY(_start)` deklarován jako
  vstupní bod programu, od kterého musí začít jeho provádění.
- `. = 0x40080000;` je adresa paměti, na kterou QEMU načte spustitelný soubor.
  Jak tuto adresu zjistit a proč je důležitá, vysvětlím v příštím článku
  o programování MMU.

## Konfigurace cílové platformy

Úplný seznam podporovaných cílových platforem získáte příkazem
`rustc --print target-list`. Běžným způsobem jejich pojmenování jsou
[trojice](https://clang.llvm.org/docs/CrossCompilation.html#target-triple)
ve tvaru &lt;architektura CPU&gt;-&lt;výrobce&gt;-&lt;OS&gt;-&lt;ABI&gt;.

Pro bare-metal programy je vhodný `aarch64-unknown-none`. Pro cross-build musíme
dodat specifikaci cíle ve formátu JSON. Následující příkaz získá výchozí
specifikaci pro `aarch64-unknown-none` a uloží ji do souboru
`aarch64-unknown-none.json`:

```shell
rustc -Z unstable-options --print target-spec-json --target aarch64-unknown-none > aarch64-unknown-none.json
```

Otevřete soubor v textovém editoru a do kořenového objektu přidejte následující
část, která překladači Rustu určí náš
[linker skript](#píšeme-linker-skript):

```json
    "pre-link-args": {
        "ld.lld": ["-Taarch64-qemu.ld"]
    },
```

Výsledný obsah souboru `aarch64-unknown-none.json` by měl vypadat takto:

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

## Sestavení a spuštění

Nyní jsme připraveni program přeložit. Struktura projektu by v této fázi měla
vypadat takto:

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

Sestavení profilu _dev_ by mělo být snadné:

```shell
cargo xbuild --target=aarch64-unknown-none.json
```

Pro profil _release_ použijte:

```shell
cargo xbuild --target=aarch64-unknown-none.json --release
```

Zajímá-li vás, jak _xbuild_ spravuje `sysroot`, přidejte k těmto příkazům
příznak `-v` pro podrobný výstup.

Po sestavení se v kořenové složce objeví adresář `target/` s přeloženými
spustitelnými soubory:

- `target/aarch64-unknown-none/debug/aarch64-bare-metal`: ladicí sestavení
- `target/aarch64-unknown-none/release/aarch64-bare-metal`: produkční sestavení

Sestavení ve složce `release` je optimalizované a neobsahuje ladicí symboly,
zatímco sestavení `debug` je obsahuje. Oba soubory jsou ve formátu ELF,
připravené ke spuštění v QEMU s následujícími parametry:

```shell
qemu-system-aarch64 -machine virt \
  -m 1024M \
  -cpu cortex-a53 \
  -nographic \
  -kernel target/aarch64-unknown-none/debug/aarch64-bare-metal

```

V terminálu byste měli vidět následující výstup:

```shell
AArch64 Bare Metal
```

## Disassemblování

Disassemblování je velmi důležitou součástí nízkoúrovňového vývoje. Hodí se při
řešení problémů, analýze i optimalizaci. Vývojář musí znát cílovou architekturu
i její jazyk symbolických instrukcí. Zkušenosti přicházejí časem; dobrou zprávou
je, že assembler AArch64 je mnohem přívětivější a intuitivnější než například
x86.

K disassemblování programu použijeme nástroj _objdump_ z GNU toolchainu:

```shell
aarch64-none-elf-objdump --disassemble-all target/aarch64-unknown-none/debug/aarch64-bare-metal
```

Úplný výpis má přibližně 4 000 řádků, proto uvedu jen jednu zajímavou část:

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

Jde o disassemblovanou funkci `ptr::write_volatile`, kterou jsme použili
k zápisu bajtů do UART. Vidíte zde dříve zmíněné komolení názvu:
`_ZN4core3ptr14write_volatile17hf16241fac42e4551E`. Pravděpodobně jste si ale
také všimli, jak neefektivní kód je: místo jediné potřebné instrukce
`strb w1, [x0]` obsahuje šest instrukcí navíc, které nic užitečného nedělají.

> Když jsem to viděl poprvé, upřímně jsem chtěl s dalším studiem Rust skončit.
> Naštěstí jsem stejným způsobem disassembloval také sestavení `release`.

```shell
aarch64-none-elf-objdump --disassemble-all target/aarch64-unknown-none/release/aarch64-bare-metal
```

Výpis má překvapivě jen 66 řádků, proto jej uvedu téměř celý:

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

Tato část se až na několik výjimek velmi podobá souboru `start.s`. Pro snazší
orientaci jsem ručně přidal čísla řádků. Na řádku _4_ se načítá osmibajtová
adresa z `0x40001018`. Na řádku _12_ je adresa, na kterou překladač uložil
hodnotu `LD_STACK_PTR`, tedy `400050b0`. Podobně byla uložena konstanta
`PSCI_SYSTEM_OFF`; viz řádky _9_ a _14_.

Nyní se podívejme na funkci `not_main`:

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

Funkce `ptr::write_volatile` se vůbec nevolá a výsledný kód je velmi dobře
optimalizován na výkon:

- znaky ASCII se zapisují přímo do registrů instrukcemi `mov`,
- písmena `A`, `a`, `r`, `e` se přesunou jen jednou a stejné registry se později
  znovu použijí,
- nepoužívá se zásobník ani zbytečné přesuny registrů.

To je jednoduše úžasné!

## Připojení debuggeru

Ladění je zásadní součástí nízkoúrovňového vývoje. Při programování MMU,
přerušení nebo ovladačů je někdy jediným způsobem, jak zjistit, co je v kódu
špatně. Pro skutečný hardware můžete potřebovat externí hardwarový debugger
(a možná i umět pájet), u virtuálního zařízení QEMU však stačí k dřívějšímu
příkazu přidat dva příznaky `-S -s`. QEMU pozastaví běh, otevře TCP socket na
výchozím portu `1234` a počká na připojení debuggeru GNU.

```shell
qemu-system-aarch64 -machine virt -m 1024M -cpu cortex-a53 -nographic -kernel target/aarch64-unknown-none/debug/aarch64-bare-metal -S -s
```

Nyní přichází na řadu `gdb-multiarch`. Nejprve pro něj v kořenové složce
projektu připravte konfigurační soubor `release.gdb`:

```plaintext
set disassemble-next-line on
set confirm off
add-symbol-file target/aarch64-unknown-none/release/aarch64-bare-metal
target remote tcp::1234
set arch aarch64
layout regs
```

V jiném okně terminálu spusťte `gdb-multiarch`:

```shell
gdb-multiarch -x debug.gdb
```

![Ladění programu Rust pomocí gdb-multiarch na AArch64](/blog/osdev/aarch64-rust-debug.png)

### Tahák pro GDB

GDB má vlastní konzoli, což může být pro začátečníky náročné. Pro rychlý start
však stačí zapamatovat si několik jednoduchých příkazů:

- `break <fn|addr>` nebo `b <fn|addr>`: nastaví breakpoint; například
  `b not_main`, `b *0x40001010`
- `break <fn> if <condition>`: podmíněný breakpoint; například
  `break context_switch if next == init_task`
- `clear`: odstraní breakpoint; například `clear not_main`
- `si` nebo `stepi`: provede jednu strojovou instrukci a při volání funkce do ní
  vstoupí
- `ni` nebo `nexti`: provede jednu strojovou instrukci, ale volání funkce
  přeskočí
- `c` nebo `continue`: pokračuje v běhu do dalšího breakpointu

---

## Závěrem

Nějakou dobu jsem pracoval na jádře [LeOS](/cs/leos/) v C. Po implementaci
multitaskingu a přepínání mezi úrovněmi výjimek jsem začal programovat MMU.
Když vše začalo fungovat, uvědomil jsem si, že je vhodná chvíle k refaktoringu
a novému uspořádání všeho, co jsem vytvořil. Současně jsem se rozhodl prozkoumat
Rust a zvážit jej jako hlavní jazyk jádra.

Několik dní jsem strávil aplikací z tohoto článku, poznáváním ekosystému Rust
a dalším výzkumem. Když nyní článek dokončuji, už vím, že jeho výsledky vytvoří
základ [prvního commitu](https://github.com/lowenware/leos-kernel/tree/8474474351390c483bf2a668c4c5986c4dd1c44a)
v repozitáři [LeOS Kernel](https://github.com/lowenware/leos-kernel.git).
