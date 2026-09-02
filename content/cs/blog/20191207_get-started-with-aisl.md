---
title: 'Začínáme s AISL'
date: 2019-12-07T14:06:19+01:00
summary: Jak začít s vývojem webu v C
tags: ['aisl', 'webdev', 'backend', 'minion']
author: 'Ilja K.'
comments: true
---

Pokud potřebujete spolehlivé a výkonné backendové řešení, na volbě
technologií velmi záleží. Hlavní výhodou
[AISL](https://github.com/lowenware/aisl) je možnost vytvořit aplikaci přímo
nad HTTP streamem a průběžně reagovat na jednotlivé hlavičky a části obsahu.
Jde o bezpečný přístup, který výrazně šetří procesorový čas.

Běžný backend je aplikace, která čeká, až jí HTTP server předá zpracovaný HTTP
požadavek prostřednictvím některého rozhraní, například WSGI, FastCGI nebo CGI.

![Běžný backend](/blog/tutorials/get-started-with-aisl/typical-back-end.png)

Než může backend data z HTTP požadavku zpracovat, musejí být všechna uložena do
mezipaměti v paměti nebo na disku. Objem odesílaných dat přitom může dosahovat
gigabajtů a backend bude čekat, dokud je webový server nepřijme celá, i když je
v danou chvíli vůbec nepotřebuje.

Aplikace založené na [AISL](https://github.com/lowenware/aisl) používají jiný
přístup. Backend je především sám webovým serverem a nezpracovaný HTTP požadavek
je přímo očekávaným datovým rozhraním. Backend tedy nemusí se zpracováním dat
čekat až do konce HTTP požadavku.

![Backend AISL](/blog/tutorials/get-started-with-aisl/aisl-back-end.png)

## První kroky

Vyzkoušejme si to vytvořením jednoduché aplikace Hello World. V tomto
i následujících návodech se nazývá _Minion_, svou aplikaci však můžete
pojmenovat libovolně. Nejprve vytvořte novou složku, inicializujte v ní
repozitář Git a přidejte podsložku _src_.

```shell
mkdir minion
cd minion
git init
mkdir src
```

Dalším krokem je instalace samotného [AISL](https://github.com/lowenware/aisl)
jako submodulu:

```shell
git submodule add https://github.com/lowenware/aisl.git
```

## Vývoj

V oblíbeném textovém editoru nebo IDE vytvořte v podsložce _src_ soubor
`main.c`. Následující úryvky kódu do něj postupně přidávejte v uvedeném pořadí.

Nejprve vložte potřebné hlavičkové soubory standardní knihovny a zastřešující
hlavičkový soubor [AISL](https://github.com/lowenware/aisl). Jde o jediný
hlavičkový soubor této knihovny, který je třeba do projektu vložit.

```c
#include <stdlib.h>
#include <stdio.h>

#include <aisl/aisl.h>
```

Nyní deklarujte callback pro události vyvolané
[AISL](https://github.com/lowenware/aisl). Implementaci doplníme později.

```c
static void
minion_callback(const struct aisl_evt *evt, void *p_ctx);
```

Definujte strukturu, která [AISL](https://github.com/lowenware/aisl) určí,
na kterém rozhraní a portu se má HTTP server spustit. V našem případě jde
o port 8081 na všech síťových rozhraních.

```c
static const struct aisl_cfg_srv m_srv = {
 .host = "0.0.0.0",
 .port = 8081
};
```

Pomocí makra `AISL_CFG_DEFAULTS`, ukazatele na strukturu `m_srv` a callbacku
z předchozích kroků definujte další konfigurační strukturu.

```c
static const struct aisl_cfg m_cfg = {
 AISL_CFG_DEFAULTS,
 .srv = &m_srv,
 .srv_cnt = 1,
 .callback = minion_callback,
};
```

Nyní přichází na řadu funkce _main_.

```c
int
main(int argc, char **argv)
{
 AislInstance aisl;
 AislStatus status;

 if ((aisl = aisl_new(&m_cfg)) != NULL) {
  fprintf(stdout, "entering main loop\n");
  for (;;) {
   status = aisl_run_cycle(aisl);
   if (status != AISL_SUCCESS)
    aisl_sleep(aisl, 500);
  }
  aisl_free(aisl);
 } else {
  fprintf(stderr, "could not initialize AISL\n");
  return -1;
 }
 return 0;
}
```

Funkce `aisl_new` vytvoří instanci enginu
[AISL](https://github.com/lowenware/aisl) podle zadané konfigurace. Instance je
ukazatel na paměť, kterou je při ukončení třeba uvolnit pomocí `aisl_free`.
Funkce `aisl_run_cycle` provede všechny rutiny a vyvolá události, které zpracuje
callback. V neposlední řadě funkce `aisl_sleep` pozastaví běh na 500 ms nebo do
okamžiku, kdy dojde k aktivitě na síťových socketech.

Poslední chybějící částí je callback deklarovaný na samém začátku. Nyní jej
implementujeme.

```c
static void
minion_callback(const struct aisl_evt *evt, void *p_ctx)
{
 AislStream s;
 const char html[] =
  "<html>"
   "<head>"
    "<title>Hello World</title>"
    "<style>"
     "body {width: 100%; height: 100%}"
     "h1 {font-size: 4em}"
     ".hello-world {"
      "position: absolute;"
      "top: 50%;"
      "left: 50%;"
      "width: 640px;"
      "height:200px;"
      "margin: -100px 0 0 -320px;"
      "text-align: center;"
     "}"
    "</style>"
   "</head>"
   "<body>"
    "<div class=\"hello-world\">"
     "<h1>Hello World</h1>"
     "<p>I am your new Minion</p>"
    "</div>"
   "</body>"
  "</html>";

 if (evt->code != AISL_EVENT_STREAM_REQUEST)
  return;

 s = evt->source;

 if (aisl_response(s, AISL_HTTP_OK, sizeof(html) - 1) == AISL_SUCCESS)
 {
  if (aisl_write(s, html, sizeof(html) - 1) != -1) {
   aisl_flush(s);
   return;
  }
 }

 aisl_reject(s);
}
```

Callback přijímá dva argumenty:

- `const struct aisl_evt *evt`: ukazatel na strukturu s podrobnostmi události,
- `void *p_ctx`: ukazatel na uživatelská data, který zatím nepoužíváme.

Konstanta `html` obsahuje statické tělo HTML, které se odešle jako odpověď na
libovolný HTTP požadavek. Zpracovává se pouze událost
`AISL_EVENT_STREAM_REQUEST`. Události tohoto typu vždy poskytují ve vlastnosti
`source` objekt `AislStream`, který je nutný k sestavení odpovědi.

Každá odpověď musí začít voláním funkce `aisl_response`, která přijímá instanci
`AislStream`, stavový kód HTTP a velikost odpovědi. `AISL_HTTP_OK` odpovídá
stavu HTTP s kódem 200, zatímco `sizeof(html)-1` je délka řetězce `html` bez
koncového nulového znaku. Pokud délku dat odpovědi neznáme a musíme ji vypočítat
za běhu, lze místo konkrétní délky předat speciální makro `AISL_AUTO_LENGTH`.

Funkce `aisl_write` zapíše do `AislStream` data zadané délky.

Volání `aisl_flush` sdělí enginu, že je odpověď připravena a lze ji odeslat
klientovi.

Pokud se cokoli pokazí, například když klient ukončí spojení s aplikací, je
vhodné klienta okamžitě odmítnout pomocí `aisl_reject`.

## Překlad

Kód aplikace je v podstatě hotový, nyní jej však musíme přeložit. V kořenové
složce aplikace vytvořme _Makefile_.

```make

.PHONY: dirs clean

default: minion

minion: aisl/build/libaisl.a dirs
 gcc -I./aisl/include src/main.c aisl/build/libaisl.a -o build/$@

aisl/build/libaisl.a:
 cd aisl && make AISL_WITH_SSL=0 libaisl.a

dirs:
 mkdir -p build

clean:
 rm -Rf build

```

Aplikaci přeložte pomocí `make`:

```shell
make
```

Poté ji spusťte v terminálu:

```shell
$ ./build/minion
entering main loop
```

Když nyní v prohlížeči otevřete `http://localhost:8081/`, měli byste vidět
přibližně toto:

![Aplikace AISL Hello World](/blog/tutorials/get-started-with-aisl/hello-world.jpg)

## Užitečné odkazy

- [Domovská stránka AISL](https://github.com/lowenware/aisl)
- [Minion na GitHubu](https://github.com/lowenware/minion), commit
  [#26ecf88](https://github.com/lowenware/minion/tree/26ecf88e37378507ad1cfefc902eddc369e2318f)
- Podobný [videonávod](https://www.youtube.com/watch?v=fBi1K2y5kEM)
