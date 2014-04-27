# FAQ & Gotchas

## My Tests aren't being run/discovered by the test runner

* Test files must end with `Test.js` e.g. `myAwesomeViewModelTest.js`
* Tests within the file must start with `test` e.g. `testTheAmazingThing`

## I just keep seeing 'Chrome: Reset'

js-test-driver isn't perfect. Sometimes it gets confused. If that happens a full
reset is the best bet:

* Close any browser test runner tabs/windows
* Stop any executing tests
* Restart the test-server
* Open up another test runner tab at http://localhost:4224/capture
* Run the tests
