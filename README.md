#vCard

##What is vCard?

vCard is a format to encode contacts. We use that format to represent an address book using Simput for its generation.

## Simput Integration

Simput provides a simple way to write any kind of text file.
This project is meant to illustrate how Simput can be used to generate templated files. Simput requires a javascript description of any user input. To build a Simput package use; 

```sh
$ Simput -c src/ -o versions/ -t vCard
```

Add the compiled package to Simput:

```sh
$ Simput -a versions/vCard.js
```

## Running Simput

### Running interactively
The following command will start a server which serves Simput's interactive form.

```sh
$ Simput -i sample/empty/empty.json -o sample/empty/.
```

### Running on the command line
The following command will generate an new set of contacts.

```sh
$ Simput -i sample/example/FakeAddressBook.json -o sample/example/ --no-gui
```


