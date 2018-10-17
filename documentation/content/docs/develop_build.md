title: Building Simput
---

The Simput application can be built with webpack automatically. Webpack can either gather all the source files and concatenate them with little modification, or it can build for production which will minify the generated file.

## Building Simput

In order to build the app you can run `npm run build` for quick development usage or `npm run build:release` for production usage.

Either of these commands will generate a website in the `dist/` directory with `index.html` and scripts and supporting files to show the Simput app in a browser.

Next, `npm run bundle` can take build output and combine it into a single file, `dist/Simput.html`. This file can be given to users and opened in any modern browser to run Simput.

If you are developing a type for use with Simput, please see the [oscillator example](oscillator.html) for information on how to add a new type. You will then use `npm run dev` and `npm run type:mytype` after a new `mytype` has been setup.

## Building the website

Simput comes with tools to build the website that get published on [github.io](https://kitware.github.io/simput/) which enables you to write documentation and see what it will look like once published.

In order to build the full website you can run the following command:

```sh
$ npm run doc:www
```

You will be able to browse the content on `http://localhost:4000/simput`
