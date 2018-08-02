Contributing to Simput
======================

This page documents at a very high level how to contribute to Simput editor.

1. The Simput editor source is maintained on Github at [github.com/kitware/simput](https://github.com/kitware/simput)

2. [Fork Simput] into your user's namespace on Github.

3. Create a local clone of the main repository:

    ```sh
    $ git clone https://github.com/kitware/simput.git
    $ cd simput
    ```

    The main repository will be configured as your `origin` remote.

4. Run the setup script to prepare Simput:

    ```sh
    $ npm install
    $ npm link
    ```

5. Edit files and create commits (repeat as needed):

    ```sh
    $ edit file1 file2 file3
    $ git add file1 file2 file3
    $ npm run commit
    ```

6. Push commits in your topic branch to your fork in Github:

    ```sh
    $ git push
    ```

7. Visit your fork in Github, browse to the "**Pull Requests**" link on the
    left, and use the "**New Pull Request**" button in the upper right to
    create a Pull Request.

    For more information see: [Create a Pull Request]


Simput editor uses Github for code review and Travis-CI to test proposed
patches before they are merged.

Our [DevSite] is used to document features, flesh out designs and host other
documentation as well as the API. There are also a [tracker]
to coordinate development and to provide support.


[Fork Simput]: https://help.github.com/articles/fork-a-repo/
[Create a Pull Request]: https://help.github.com/articles/creating-a-pull-request/
[DevSite]: http://kitware.github.io/simput
[tracker]: https://github.com/kitware/simput/issues
