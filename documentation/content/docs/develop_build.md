title: Building Simput
---

The Simput application can be built with webpack automatically. Webpack can either gather all the source files and concatenate them with little modification, or it can build it for production which will minify the generated file.

## Building Simput

In order to build the app you can run `npm run build` for quick development usage or `npm run build:release` for production usage.

{% note warn For Windows users %}
You cannot use the previous command line for building a production ready bundle.
Instead you will need to run: `npm run build -- -p`
{% endnote %}

Either of these commands will generate a `dist/Simput.js` file that can then be used as an external script.

## Building the website

Simput comes with its tools to build the website that get published on [github.io](https://kitware.github.io/simput/) which enables you to write documentation and see what it will look like once published.

In order to run the tests and build the full website with its examples you can run the following command:

```sh
$ npm run doc:www
```

You will be able to browse the content on `http://localhost:4000/simput`
