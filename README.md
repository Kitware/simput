# vCard

## What is vCard?

vCard is a format to encode contacts. We use that format to represent an address book, and use Simput for its generation.

## Simput Integration

Simput provides a simple way to write any kind of text file.
This project is meant to illustrate how Simput can be used to generate templated files. Simput requires a javascript description of any user input. To change the vCard template, start a development server:

```sh
$ npm run dev
```

In a separate window, as you make changes, compile the vCard package:

```sh
$ npm run type:vcard
```

The development server will watch for changes and reload as needed.

When your changes are final, run:

```sh
$ npm run build:release
```

to generate a final package. See the [Simput readme](https://github.com/Kitware/simput) for more information.

## Running Simput

### Running interactively
The following command will start a server which serves Simput's interactive form.

```sh
$ Simput -p 8080
```

Then drag a file with the following content or the following example file `samples/example/FakeAddressBook.json`

```
{
  "type": "pyfr",
  "data": {}
}
```
