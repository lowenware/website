---
title: 'Get Started With AISL'
date: 2019-12-07T14:06:19+01:00
summary: How to start web development in C
tags: ['aisl', 'webdev', 'backend', 'minion']
author: 'Ilja K.'
comments: true
---

When you need to have a reliable high performance back end solution, the choice
of technology stack does matter a lot. The main advantage of
[AISL](https://github.com/lowenware/aisl) is that it
allows you to build an application over HTTP stream and react on various
headers and content parts on the fly. It is a secure way that preserves CPU
time a lot.

Typical back end is an application that is awaiting for some HTTP server to
provide parsed HTTP request using some interface: WSGI, FastCGI, CGI etc.

![Typical back end](/blog/tutorials/get-started-with-aisl/typical-back-end.png)

All data provided in HTTP request has to be cached in memory or on disk before
Back end can process it. Worth to mention that amount of sent data may reach
gigabytes and your Back end will wait until web server receive it completely.
Even if you don't need that data at this moment.

[AISL](https://github.com/lowenware/aisl) based applications offer different
approach. First of all, your
back end is a web server itself and pure HTTP request is already expected data
interface. It means that there is no need for Back end to wait until the end of
HTTP request to start processing the data.

![AISL back end](/blog/tutorials/get-started-with-aisl/aisl-back-end.png)

## First steps

Let's try it out and create a simple Hello World application. In this and
further tutorials it is called _Minion_, but you can call your app however
you like. First create a new folder and initialize a GIT repository and _src_
subfolder inside.

```shell
mkdir minion
cd minion
git init
mkdir src
```

Next step is installation of [AISL](https://github.com/lowenware/aisl) itself
as a submodule.

```shell
git submodule add https://github.com/lowenware/aisl.git
```

## Development

Using your favorite text editor or IDE create a file named `main.c` inside _src_
subfolder. Compose by appending following code snippets to each other one by one.

First include necessary standard library header files and
[AISL](https://github.com/lowenware/aisl)
meta header file. It is the only header file of the library you need to include
into your project.

```c
#include <stdlib.h>
#include <stdio.h>

#include <aisl/aisl.h>
```

Now declare a callback function for events, triggered by
[AISL](https://github.com/lowenware/aisl). Implementation will follow.

```c
static void
minion_callback(const struct aisl_evt *evt, void *p_ctx);
```

Define a structure that will tell [AISL](https://github.com/lowenware/aisl) on
which interface and port HTTP server
should be started. In our case it is port 8081 of each network interface.

```c
static const struct aisl_cfg_srv m_srv = {
 .host = "0.0.0.0",
 .port = 8081
};
```

Define another configuration structure using `AISL_CFG_DEFAULTS` macro, a
pointer to the `m_srv` structure and the callback from previous steps.

```c
static const struct aisl_cfg m_cfg = {
 AISL_CFG_DEFAULTS,
 .srv = &m_srv,
 .srv_cnt = 1,
 .callback = minion_callback,
};
```

Now it is turn of a _main_ function.

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

Function `aisl_new` creates an instance of
[AISL](https://github.com/lowenware/aisl) engine using
defined configuration. That instance is a pointer to a memory that should be
freed using `aisl_free` on exit. Function `aisl_run_cycle` performs all the
routins and triggers events that will be handled by the callback. And last but
not the least `aisl_sleep` function stops execution for 500ms or until
some activity on network sockets.

The last missing part is a callback function that was declared in the very
beginning. Now it is time to implement it.

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

Callback takes two arguments:

- `const struct aisl_evt *evt`: a pointer to a structure with event details,
- `void *p_ctx`: a pointer to some user-defined data, that is not used for now.

Constant `html` contains static HTML body that will be send as a response on
any HTTP request. Only `AISL_EVENT_STREAM_REQUEST` event should be handled.
Events of such type always provide `AislStream` object as a `source`. It is
necessary to build responses.

Each response should be initiated with `aisl_response` function that takes
`AislStream` instance, HTTP status code and response size as arguments.
`AISL_HTTP_OK` corresponds to HTTP Status with code 200, while `sizeof(html)-1`
is length of `html` string (excluding null-terminator). For cases when length
of the response data is unknown and has to be calculated on-the-fly, there is
a special macro `AISL_AUTO_LENGTH`, that could be passed instead of actual
length.

Function `aisl_write` writes data of defined length to `AislStream`.

A call to `aisl_flush` tells the engine that response is ready and could be
sent to the client.

If anything went wrong, for example if client closed connection to application,
it is worth to immediately reject the client with `aisl_reject`.

## Compilation

Our application code is pretty much done, but now we need to compile it. Lets
create a _Makefile_ in the root application folder.

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

Compile application using `make`:

```shell
make
```

And run it in terminal:

```shell
$ ./build/minion
entering main loop
```

Now if you navigate to `http://localhost:8081/` in your browser, you should see
something like this:

![AISL Hello World Application](/blog/tutorials/get-started-with-aisl/hello-world.jpg)

## Usefull links

- [AISL homepage](https://github.com/lowenware/aisl)
- [Minion on Github](https://github.com/lowenware/minion) commit
  [#26ecf88](https://github.com/lowenware/minion/tree/26ecf88e37378507ad1cfefc902eddc369e2318f)
- Similar [video tutorial](https://www.youtube.com/watch?v=fBi1K2y5kEM)
