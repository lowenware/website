---
title: 'AArch64 GIC a přerušení časovače'
date: 2020-04-11T15:49:42+02:00
tags: ['rust', 'leos', 'aarch64']
summary: 'Průvodce programováním GIC pro AArch64'
author: 'Ilja K.'
comments: true
---

Získání přerušení časovače patří mezi běžné úkoly vývojáře operačního systému.
Na některých architekturách je to velmi jednoduché, ale u AArch64 je nutné
nakonfigurovat takzvaný řadič přerušení. V tomto článku se dozvíte, jak
inicializovat Generic Interrupt Controller (GIC), řídit priority a směrovat
přerušení na konkrétní jádro.

## Úvod

Asi před třemi týdny jsem začal převádět své ukázky bare-metal programování pro
AArch64 napsané v C do [jádra](https://github.com/lowenware/leos-kernel)
v Rustu. Musím přiznat, že se mi tento jazyk líbí čím dál víc. Rust má velmi
chytrý překladač, který mě opakovaně překvapuje optimalizacemi, a přitom stále
nabízí poměrně pružnou kontrolu nad výsledným binárním kódem. A jako bývalý
vývojář v C samozřejmě velmi oceňuji jmenné prostory a absenci hlavičkových
souborů.

Narazil jsem na několik problémů a nedostatek informací o GIC, proto jsem se
rozhodl popsat je zde. Související kód je jako obvykle dostupný na
[GitHubu](https://github.com/lowenware/leos-kernel/tree/d0d8eb8757b969f412bf0663727165589cbaf480).

## Zdroj přerušení

Každý procesor AArch64 by měl mít obecný časovač, některé desky však mohou
obsahovat také externí časovače. S časovačem souvisí několik systémových
registrů:

- [CNTPCT_EL0](https://developer.arm.com/docs/ddi0595/c/aarch64-system-registers/cntpct_el0)
  – registr hodnoty fyzického čítače
- [CNTP_CTL_EL0](https://developer.arm.com/docs/ddi0595/c/aarch64-system-registers/cntp_ctl_el0)
  – řídicí registr fyzického čítače
- [CNTP_TVAL_EL0](https://developer.arm.com/docs/ddi0595/c/aarch64-system-registers/cntp_tval_el0)
  a [CNTP_CVAL_EL0](https://developer.arm.com/docs/ddi0595/c/aarch64-system-registers/cntp_cval_el0)
  – dva registry prahové hodnoty
- [CNTFRQ_EL0](https://developer.arm.com/docs/ddi0595/c/aarch64-system-registers/cntfrq_el0)
  – registr frekvence čítače

Pokud je hodnota z `CNTPCT_EL0` menší nebo rovna hodnotě z `CNTP_CVAL_EL0`,
může časovač podle konfigurace v `CNTP_CTL_EL0` vyvolat požadavek na přerušení
s číslem `30`.

> Vývojář může zapsat relativní hodnotu časovače také do `CNTP_TVAL_EL0`.
> V takovém případě se `CNTP_CVAL_EL0` automaticky naplní novou hodnotou =
> `CNTP_TVAL_EL0` + `CNTPCT_EL0`.

K nastavení časovače tak, aby vyvolal přerušení za jednu sekundu, lze použít
následující kód assembleru:

```asm
mrs x1, CNTFRQ_EL0
msr CNTP_TVAL_EL0, x1
mov x0, 1
msr CNTP_CTL_EL0, x0
```

Pro nepřetržité generování přerušení časovače je nutné znovu načítat prahovou
hodnotu prvními dvěma instrukcemi z předchozí ukázky.

> Možná jste si všimli, že jsem časovač označil za fyzický. Existuje také
> virtuální časovač. Ve skutečnosti jde o tentýž časovač, lze jej však nastavit
> tak, aby počítal s určitým posunem oproti fyzickému. Přistupuje se k němu
> pomocí vlastní sady systémových registrů.

## Obecný řadič přerušení (GIC)

Ani správné nastavení časovače k vyvolání přerušení nestačí k tomu, aby
k přerušení skutečně došlo. V AArch64 musí být každé přerušení nejprve
směrováno na cílový procesor, což zajišťuje řadič přerušení. Ten navíc nabízí
mnoho dalších možností maskování a prioritizace přerušení.

> Chvíli mi trvalo, než jsem si uvědomil, že řadič přerušení je součást závislá
> na konkrétní desce. Obecný řadič přerušení (GIC) je pouze běžný, nikoli jediný
> způsob řešení. Řadič přerušení je periferie s paměťově mapovanými registry.
> To znamená, že pro desky s GIC může být ovladač stejný a liší se pouze
> základní adresou. Pro některé desky (včetně Raspberry Pi 2 a 3) však může být
> nutné vytvořit vlastní ovladač.

Protože vyvíjím jádro pro virtuální zařízení QEMU, základní adresa GIC je
`0x08000000`, kterou [MMU](/cs/blog/osdev/aarch64-mmu-programming/) mapuje na
`0xffffffe0_08000000`. Mapování registrů je uvedeno v kapitolách 8.8 a 8.12
[specifikace architektury GIC](https://static.docs.arm.com/ihi0069/d/IHI0069D_gic_architecture_specification.pdf).

Aby se přerušení časovače vyvolalo, stačí pracovat se čtyřmi registry:

```rust
// Distributor registors
const GICD_CTLR: *mut u32 = GICD_BASE as *mut u32;
const GICD_ISENABLER: *mut u32 = (GICD_BASE + 0x0100) as *mut u32;
// CPU interface Controller
const GICC_CTLR: *mut u32 = GICC_BASE as *mut u32;
const GICC_PMR: *mut u32 = (GICC_BASE + 0x0004) as *mut u32;
const GICC_BPR: *mut u32 = (GICC_BASE + 0x0008) as *mut u32;
```

Nejprve je třeba povolit _distributor_ i _CPU interface controller_:

```rust
ptr::write_volatile(GICD_CTLR, 1);
ptr::write_volatile(GICC_CTLR, 1);
```

Poté je nutné pro řadič rozhraní nastavit registr masky priority (Priority Mask
Register). Hodnotou v tomto registru lze maskovat přerušení s nízkou prioritou,
aby se nikdy nevyvolala. Stojí za zmínku, že v logice GIC odpovídá hodnota
`0xff` nejnižší prioritě a `0x00` nejvyšší.

```rust
ptr::write_volatile(GICC_PMR, 0xff);
```

Posledním krokem je povolit směrování přerušení časovače na jádro procesoru.
Implementoval jsem jej jako funkci:

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

Pro nepřetržité získávání přerušení časovače je také třeba v GIC zrušit
čekající přerušení:

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

> Pro ovladač GIC jsem implementoval také metody pro zakázání přerušení,
> nastavení priority a cílového jádra. Pro začátek však stačí výchozí nastavení.
> Úplný kód ovladače najdete
> [zde](https://github.com/lowenware/leos-kernel/blob/d0d8eb8757b969f412bf0663727165589cbaf480/src/arch/aarch64/gic.rs).

## Obsluha přerušení

Přerušení je v AArch64 podtypem výjimky. AArch64 rozlišuje čtyři typy výjimek:

1. _Sync_ neboli _Synchronous exceptions_ – výjimky vyvolané při provádění,
   například při pokusu o přístup na neexistující paměťovou adresu.
2. _IRQ_ neboli _Interrupt requests_ – přerušení generovaná hardwarovými
   periferiemi.
3. _FIQ_ neboli _Fast Interrupt Requests_ – podobají se _IRQ_, ale mají vyšší
   prioritu, takže obslužnou rutinu _FIQ_ nemůže přerušit jiné _IRQ_ ani _FIQ_.
4. _SError_ neboli _System Error_ – asynchronní přerušení určené zejména pro
   externí Data Aborts.

Zpětná volání pro obslužné rutiny přerušení (ISR) se procesoru předávají pomocí
tabulky. V AArch64 se nazývá _Exception Vector Table_. Tabulka musí být zarovnána
na 2048 bajtů a obsahovat 16 položek. Každá položka se nazývá _Exception
Vector_; v AArch64 nejde pouze o adresu zpětného volání, ale o skutečný kód ISR.
Jeho velikost je omezena velikostí _Exception Vector_, tedy 128 bajty.

Tabulka musí obsahovat čtyři skupiny vektorů:

1. čtyři vektory výjimek jednotlivých typů pro aktuální úroveň výjimky, pokud
   registr `SPSel` vybral SP0,
2. čtyři vektory výjimek jednotlivých typů pro aktuální úroveň výjimky, pokud
   registr `SPSel` vybral SPx,
3. čtyři vektory výjimek jednotlivých typů pro nižší úroveň výjimky,
4. čtyři vektory výjimek jednotlivých typů pro nižší úroveň výjimky
   v 32bitovém režimu.

Pro LeOS jsem tabulku definoval pomocí kódu assembleru:

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

Tabulka se zarovnává pomocí linker skriptu:

```plaintext
    . = ALIGN(0x800);
    .text.exceptions : { *(.text.exceptions) }
```

Direktivy `.org` zároveň brání tomu, aby vektory překročily limit 128 bajtů.
Makro `EXCEPTION_VECTOR` rozbalí kód přerušení, který uloží registry na zásobník
a zavolá příslušnou funkci ISR implementovanou v Rustu. Úplný kód je dostupný
[zde](https://github.com/lowenware/leos-kernel/blob/d0d8eb8757b969f412bf0663727165589cbaf480/src/arch/aarch64/exceptions.s).

Adresa tabulky musí být uložena v registru `vbar_el1`:

```asm
    ldr     x0, =exception_vector_table
    msr     vbar_el1, x0
```

Jakmile časovač vyvolá asynchronní požadavek na přerušení, lze jej obsloužit
pomocí zpětného volání `el1_irq`.

```rust
#[no_mangle]
unsafe extern "C" fn el1_irq(ctx: &mut ExceptionCtx) {
    irq::handler(ctx);
}
```

## Poznámka na závěr

Během vývoje jsem zachytával synchronní výjimky uvnitř funkce `write_fmt`
z `core::fmt`. Analýzou v GDB jsem zjistil, že obsah registrů byl poškozen.
Příčinou byla má nebezpečná inline volání `asm!` při inicializaci časovače.
Přestože byl kód v samostatném modulu a formátovaný výstup uvnitř `kernel_main`,
překladač je optimalizoval do jediné funkce a já jsem ručně poškodil obsah
registrů.

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

Dočasným řešením bylo označit funkci atributem `#[inline(never)]`, aby překladač
nepředpokládal, že registry `x0` až `x19` zůstanou během volání nezměněné.
Poučení zní: _při prototypování kódu dbejte na bezpečnost_. A zdá se, že nastal
čas připravit bezpečné abstrakce a přístupové funkce k registrům.
