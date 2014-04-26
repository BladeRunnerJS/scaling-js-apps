# Dev Setup

To work most efficiently here are some ideas to help.

## Your Console/Terminal

Have four terminal tabs or windows open. One for each of the following:

1. In the BladeRunnerJS `sdk` directory that will run `./brjs serve`
2. A second in the BRJS `sdk` directory to run `create-*` and `test ...` commands
3. Another in the BRJS `sdk` directory that will run `./brjs test-server --no-browser`
4. To be used for `git ...` commands. This will eventually be in `apps/modularapp`

## Your Browser with Developer Tools

**We recommend Google Chrome**

Have three tabs open. One for each of the following:

1. The workbench for the Blade you are currently building
2. The application (default aspect) so you can see how your application looks
3. A tab instance to execute your tests in the browser. Once the test server is running navigate to http://localhost:4224/capture

For all three tabs have the developer tools open. Have it set up to [pause on exceptions](https://developers.google.com/chrome-developer-tools/docs/javascript-debugging#pause-on-exceptions).
