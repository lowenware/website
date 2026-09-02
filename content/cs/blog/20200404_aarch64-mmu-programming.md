---
title: 'Programování MMU pro AArch64'
date: 2020-04-04T12:12:54+01:00
tags: ['aarch64', 'leos', 'assembler']
summary: 'Jak porozumět MMU v AArch64'
author: 'Ilja K.'
comments: true
---

MMU je zkratka pro Memory Management Unit, tedy jednotku správy paměti, která
zajišťuje překlad adres virtuální paměti a řízení přístupu k paměti. Jde o jedno
z nejdůležitějších témat vývoje operačních systémů, ale zároveň může být velmi
nepřehledné. V tomto článku se pokusím proces programování MMU objasnit.

Do hlavní větve repozitáře [LeOS](/cs/leos/) jsem právě začlenil
[commit](https://github.com/lowenware/leos-kernel/commit/aa6def9a9dea74c671800fd715e12525f9c80fce)
s implementací podpory MMU. Článek nemá být podrobným návodem krok za krokem,
spíše příručkou pro vývojáře. Pokud hledáte kód, zamiřte rovnou na GitHub.

## Jak MMU funguje

Začněme od začátku spouštění aplikace z
[předchozího článku](/cs/blog/osdev/aarch64-bare-metal-program-in-rust/).
Byla přeložena se vstupním bodem na adrese `0x40080000`. Tato konkrétní adresa
vychází z návrhu virtuálního zařízení QEMU:

- `0x00000000 - 0x3FFFFFFF` je oblast paměťově mapovaných periferií. Pomocí adres
  z tohoto rozsahu lze přistupovat k registrům různých periferií a konfigurovat
  či ovládat je, stejně jako jsme k výpisu textového řetězce do terminálu použili
  výstupní registr UART na adrese `0x09000000`.
- `0x40000000 - 0x4007FFFF` je oblast vyhrazená zavaděči.
- Jádro (nebo libovolná bare-metal aplikace) se načítá na adresu `0x40080000`.

Počáteční adresa, na kterou se jádro načte, závisí na implementaci zavaděče.
Používáte-li existující hardware nebo emulátor, budete nejspíš pracovat
s hotovým zavaděčem, který soubor jádra načte na předem určenou adresu.

> Pokud chcete totéž vyzkoušet na Raspberry Pi 3, počáteční adresa bude
> `0x00000000`.

U některých zavaděčů je navíc nutné použít prostý binární soubor namísto ELF,
takže v něm vůbec nebude informace o adrese vstupního bodu konkrétního jádra.
Jádro načtené někam do paměti bude stále fungovat a mohou se podařit i některé
instrukce větvení, dokud nebude potřeba přístup na absolutní adresu nebo dlouhý
skok. Pokud bylo jádro přeloženo pro vstupní bod odpovídající adrese načtení,
bude fungovat; jinak je chování nedefinované. Tento problém lze zcela vyřešit
pomocí MMU.

> Přestože jde jen o vedlejší důsledek použití MMU, začal jsem právě jím,
> protože jeho pochopení pomůže porozumět celému principu.

Namísto samostatného sestavení jádra pro každý zavaděč tedy postupujeme takto:

1. Zvolíme virtuální adresu, která se při překladu nastaví jako vstupní bod
   jádra. Pro jádro LeOS jsem zvolil `0xfffffff0_00000000`; později vysvětlím
   proč.
2. První instrukcí kódu jádra uložíme aktuální adresu do registru, který po
   určitou dobu zůstane nedotčen: `adr x20, .`
3. Implementujeme počáteční kód nezávislý na poloze, který inicializuje MMU
   a zapne překlad virtuální adresy `0xfffffff0_00000000` na skutečnou adresu
   uloženou v tomto registru.
4. Provedeme dlouhý skok do vstupní funkce jádra, v případě LeOS do
   `kernel_main`.

Také je vhodné mapovat výše uvedenou oblast paměti periferií, která se liší
podle [SoC](https://en.wikipedia.org/wiki/System_on_a_chip), na pevnou virtuální
adresu. V LeOS je nastavena na `0xffffffe0_00000000`.

Nyní se podívejme, jak se adresy v AArch64 překládají.

## Proces překladu adres

Skok do funkce `kernel_main` je v aktuálním sestavení skokem na adresu
`0xfffffff0_00000278`. Proces překladu této adresy znázorňuje a popisuje
následující schéma.

![Překlad adres v AArch64](/blog/osdev/aarch64-mmu-address-translation.png)

1. MMU zkontroluje, zda jsou nejvyšší bity adresy 63–37 všechny nastaveny na 1,
   nebo na 0. V prvním případě pokračuje ve vyhledávání pomocí registru
   `ttbr1_el1`, ve druhém pomocí `ttbr0_el1`. Rozdíl vysvětlím později.
2. Ze zvoleného registru získá MMU skutečnou adresu takzvané překladové tabulky
   L1. Jde jednoduše o pole 512 deskriptorů o délce 8 bajtů.
3. MMU použije bity adresy 36–30 jako index deskriptoru v tabulce L1. U ukázkové
   adresy jde o index 64. Deskriptor číslo 64 v L1 obsahuje adresu překladové
   tabulky L2.
4. Bity 29–21 použije MMU jako index deskriptoru tabulky L2; v ukázce je to 0.
   Tento deskriptor obsahuje adresu poslední překladové tabulky L3.
5. Bity 20–12 slouží jako index deskriptoru v tabulce L3. V ukázce je opět 0.
   Deskriptor obsahuje adresu cílové 4KB stránky paměti.
6. Nakonec MMU použije prvních 12 bitů adresy jako posun uvnitř cílové stránky.
   Zde je posun 0x278 = 632 bajtů.

Pro úplnost uvádím formát deskriptoru překladové tabulky v tomto případě:

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

> Pěknou
> [dokumentaci](https://developer.arm.com/docs/100940/0101/armv8-A-address-translation)
> procesu překladu adres najdete na webu ARM. Během vývoje mi sloužila jako
> příručka.

Vypadá to složitě, že? Pokusím se vše vysvětlit krok za krokem, nejprve je však
na místě jedna rozumná otázka.

## Proč to potřebujeme?

Stručně řečeno kvůli bezpečnosti. MMU umožňuje vytvářet nezávislé, navzájem
izolované virtuální adresní prostory. Každý proces operačního systému může běžet
ve vlastním adresním prostoru a mít dojem, že je v paměti sám, aniž by mohl
přistupovat ke kódu nebo datům jiných procesů. Ve skutečnosti může být proces
umístěn na libovolné adrese fyzické paměti, a dokonce může být fragmentovaný.

Rozdělením paměti na stránky umožňuje MMU určit pro každou stránku v deskriptorech
překladových tabulek zvláštní atributy. Operační systém jimi řídí oprávnění
k zápisu a spuštění, privilegovaný přístup, nastavení mezipaměti i vlastní
specifické funkce.

MMU v AArch64 nabízí samostatné registry základu překladových tabulek pro
jednotlivé úrovně výjimek. Například adresní prostor jádra tak lze trvale
uchovávat v registru `ttbr1_el1` a zachovat jeho mezipaměť platnou i při
přepínání kontextu, které ovlivní pouze uživatelský prostor opětovným načtením
`ttbr0_el1`.

## Možnosti překladu

Předchozí příklad překladu adres nepokrývá vše. Vývojář může volit mezi různými
možnostmi, které zásadně mění chování MMU, proto je důležité všem porozumět.

1. MMU se konfiguruje pomocí
   [řídicího registru překladu](https://developer.arm.com/docs/100095/0002/system-control/aarch64-register-descriptions/translation-control-register-el1)
   příslušného pro danou
   [úroveň výjimky (Exception Level)](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.ddi0488c/CHDHJIJG.html).
   Úroveň EL1 je určena pro jádro, méně privilegovaná EL0 pro uživatelské
   aplikace. Pro virtualizaci a hypervizor existují také EL2 a EL3. Dále budu
   mluvit především o EL1, ale mějte na paměti i ostatní úrovně.

2. AArch64 dělí adresní prostor na **dolní a horní polovinu**, které lze
   konfigurovat samostatně. Registry a vlastnosti dolní poloviny jsou označeny
   nulou: `TTBR0_EL1`, `TCR_EL1.T0SZ`; horní poloviny jedničkou:
   `TTBR1_EL1`, `TCR_EL1.T1SZ`.

3. **Granularita překladu** je velikost stránky, tedy nejmenší mapovatelné
   oblasti paměti. Řídí ji pole `TG0` a `TG1` registru `TCR_EL1` a může být
   4 KB, 16 KB nebo 64 KB. Změna granularity mění vše: velikost stránky, a tedy
   i překladové tabulky, počet bitů adresy použitých jako indexy, počet úrovní
   překladu i velikost výstupní adresy v deskriptoru.

4. **Velikost adresního prostoru** lze nastavit poli `T0SZ` a `T1SZ` registru
   `TCR_EL1`. Jejich hodnota udává počet nejvyšších bitů vynechaných z překladu.
   Podle poloviny adresního prostoru musejí být všechny 1, nebo všechny 0.
   V předchozím příkladu se pro index tabulky L1 používá jen 7 bitů, zatímco pro
   ostatní tabulky 9, protože `T1SZ` je nastaveno na 27. Tím odpadá i zbytečná
   úroveň L0: adresní prostor je omezen na `64 - 27 = 37` bitů, což stále
   umožňuje adresovat až 128 GB RAM, osmkrát více, než mám v pracovní stanici.
   Počet úrovní překladu ovlivňuje jeho rychlost.

5. **Platnost deskriptoru** řídí nultý bit deskriptoru v překladové tabulce.
   Je-li 1, deskriptor je platný a MMU jej použije. Je-li 0, MMU vyvolá výjimku
   a operační systém ji může obsloužit například přidělením paměti nebo
   ukončením procesu, který se pokusil přistoupit na chybnou adresu.

6. **Blokové mapování** je další možnost deskriptorů. Řídí je první bit, který
   určuje, zda má MMU cílovou adresu chápat jako adresu další překladové tabulky,
   nebo jako cílovou adresu. Lze tak mapovat oblasti větší než stránka určená
   _granularitou překladu_. Při granularitě 4 KB lze mapovat bloky
   `4KB * 512 = 2MB` a `2MB * 512 = 1GB`, což je v praxi velmi užitečné.

7. Operační systém může polem `AP` deskriptoru **řídit přístup** k paměťovým
   stránkám a blokům, označit je jako jen pro čtení (`read-only`) a výslovně
   povolit či zakázat přístup z neprivilegované úrovně výjimky.

8. Stránky lze také označit jako **nespustitelné**, a to samostatně pro
   privilegované jádro a neprivilegovanou uživatelskou úroveň výjimky.

9. AArch64 poskytuje také dva **Memory Attribute Indirection Registers
   ([MAIR](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.ddi0500d/B4BEIDGHFH.html))**
   pro pružnou konfiguraci paměťových oblastí. _MAIR_ si lze představit jako
   pole osmi 8bitových prvků. Lze do něj uložit až osm sad atributů a odkazovat
   na ně indexem 0–7 uloženým v poli `INDX` deskriptoru.

## Tipy k implementaci

Na závěr se podělím o několik tipů pro vývoj a řešení problémů, které vám mohou
pomoci s vlastní implementací.

### Zvolte granularitu překladu

Pro malé aplikace je dobrou volbou 4 KB a jako zastánce jednoduchých jader ji
doporučuji i pro jádro. Při prvních krocích s programováním MMU je však
nejdůležitější soustředit se jen na jeden případ, jinak v tom snadno vznikne
zmatek. Držte řešení jednoduché.

> AArch64 z nějakého důvodu používá pro hodnoty `TG0` a `TG1` různé formáty.
> Například pro granularitu 4 KB jsem musel nastavit `TG0=0b00` a `TG1=0b10`.
> Chybám předejdete důsledným ověřováním v oficiální dokumentaci.

Nezapomeňte, že cílové adresy v deskriptorech musejí být zarovnány podle
velikosti granularity. Lze toho dosáhnout makry v assembleru nebo linker
skriptem:

```plaintext
    . = ALIGN(0x1000);
    LD_TTBR1_BASE = .;
    . = . + 0x1000;
```

### Začněte blokovým mapováním

Pro začátek stačí jediná překladová tabulka s jediným deskriptorem, který
zmapuje například 1 GB RAM a pokryje celou oblast jádra, nebo dokonce veškerou
dostupnou paměť. Proces překladu se obtížně ladí; čím méně míst, kde lze udělat
chybu, tím snáze problém najdete.

### Začněte identickým mapováním

_Identické_ mapování znamená, že virtuální adresy odpovídají stejným adresám ve
fyzické paměti. Obecně nejde o dobrou praxi, protože je méně bezpečné a ve
složitých systémech více matoucí, pro začátek je však zcela běžné, a dokonce
nezbytné.

Po zapnutí MMU totiž registr návratové adresy procesoru ukazuje na další
instrukci skutečnou fyzickou adresou. Bez identického mapování vyvolá MMU
výjimku. Její obsluha by byla možným řešením, ale pro ověřovací aplikaci patrně
není vhodná.

Pro _identické_ mapování lze inicializovat registry `TCR_EL1` krátkou
dvoubajtovou hodnotou a získat funkční příklad.

### Povolte vše

Nastavte paměťový blok v deskriptoru jako spustitelný a zapisovatelný pro všechny
úrovně výjimek, inicializujte `MAIR` hodnotou `0xFF` (běžná paměť) a odkazujte
na ni jako `0b000`.

### Přidávejte úrovně překladu

Jakmile funguje překlad pro identické mapování, přidejte další úroveň. Po jejím
zprovoznění přidejte následující a pokračujte až k poslední úrovni odpovídající
zvolené _granularitě překladu_.

> U vyšších úrovní překladu nezapomeňte změnit první bit deskriptoru. Jde
> o velmi častý zdroj problémů.

Po vytvoření všech úrovní můžete odlišně konfigurovat stránky pro kód, data jen
pro čtení a běžná data. Pokus o zápis do paměti určené pouze pro čtení vyvolá
výjimku, kterou byste měli v debuggeru snadno zaznamenat.

### Mapujte paměť periferií

Oblast paměti periferií je třeba mapovat jinak; vhodným výchozím bodem je
registr `MAIR`. Nakonec jsem použil hodnotu `0b00000100`, která odpovídá paměti
Device-nGnRE (bez mezipaměti). Nezapomeňte v deskriptoru použít správný index
atributu.

### Mapujte jádro do horní poloviny paměti

Běžnou praxí je mapovat jádro do horní poloviny a aplikace do dolní. Jádro se
tak snáze izoluje od uživatelských aplikací a vývojáři to usnadňuje práci:
z adresy hodnoty či instrukce lze snadno odhadnout, kde došlo k chybě nebo
výjimce.

> Při implementaci překladových tabulek jádra v horní polovině zkontrolujte
> hodnotu pole `T1SZ` registru `TCR_EL1`. Určuje, kolik nejvyšších bitů virtuální
> adresy musí být nastaveno na 1. Může se stát, že překladové tabulky nastavíte
> správně, ale odkazujete na chybnou adresu, například
> `0xffffff00_00000000` namísto `0xfffff000_00000000`.

### Řešení problémů

Debugger, tužka a list papíru jsou vaši nejlepší pomocníci. Je užitečné nakreslit
si pro zvolenou granularitu podobné schéma jako výše, představit si, že jste
MMU, a projít každý krok překladu. Po změnách kódu jsem si také zapisoval adresy
některých instrukcí, abych na ně mohl v GDB ručně umístit breakpointy.

Pokud vám MMU nefunguje, ověřte následující:

1. Překladové tabulky jsou zarovnány podle _velikosti granularity_.
2. V deskriptorech překladových tabulek jsou na správných pozicích uloženy
   správné cílové adresy.
3. Blokové deskriptory jsou označeny jako bloky a tabulkové jako tabulky.
4. Deskriptory obsahují správná přístupová oprávnění pro stránky.
5. Hodnoty polí `T0SZ` a `T1SZ` odpovídají počtu nenastavených či nastavených
   bitů virtuální adresy.
6. Pokud jste hodnoty těchto polí změnili, aktualizovali jste také vstupní bod
   jádra v linker skriptu.

Jedním z nejužitečnějších příkazů GDB může být prozkoumání paměti:

```plaintext
x 0xfffffff000000278
```

Příkaz zobrazí obsah paměti na dané adrese, případně chybovou zprávu, pokud ji
nelze číst.

Doufám, že byl článek užitečný. Našel jsem několik ukázek programování MMU
a některé dokonce fungovaly bez úprav. Při vlastní implementaci jsem však
narazil na mnoho problémů a praktické rady se hledaly obtížně. Rozhodl jsem se
proto shromáždit je na jednom místě a popsat vše z jiné perspektivy, aby čtenář
získal lepší přehled o použitých postupech.

Máte-li k MMU jakékoli dotazy, napište komentář; rád pomohu. Dejte mi také
vědět, zda jsem něco vynechal nebo zda byste k tématu uvítali více informací
v textové či obrazové podobě.
