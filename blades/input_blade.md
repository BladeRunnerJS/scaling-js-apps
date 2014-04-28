# Exercise: Input Blade (30 mins)

Your team has chosen to build the Input Blade. Without it nobody can enter
any information into the application.

The Input Blade should have the following functionality:

* Allow the user to input text into a `textarea`
* Have a `button` that lets a user send information to other users
* It should ensure that blank text isn't sent

## Create the Blade

You already have the application within the BladeRunnerJS installation. You'll
also notice that it has a folder called `chat-bladeset`. Don't worry about
BladeSets, we won't be using them, but out Blades will be located under this folder.

From the BladeRunnerJS `sdk` directory run the following command to create a Blade:

```
./brjs create-blade modularapp chat input
```

You've just scaffolded your first Blade. You can find the Blade skeleton in
`apps/modularapp/chat-bladeset/blades/input`.

You can find out more about what's just been created in the [Create a Blade docs](http://bladerunnerjs.org/docs/use/create_blade/).

## View the Blade a Workbench

Start the BRJS development server by running the following command from the `sdk`
directory:

```
./brjs serve
```

Now navigate to http://localhost:7070/modularapp/chat-bladeset/blades/input/workbench/
to see your *amazing* Blade.

Feel free to take a look around the Blade assets to see how the code is structured
and familiarise yourself with where things are.

## Build the View

Let's update the view to have the elements we need for our required functionality.

Open up the `input/resources/html/view.html` file and make it look as follows:

```html
<div id="modularapp.chat.input.view-template">

	<section class="chat-input">
		<textarea class="chat-input-message"
							placeholder="type a message"></textarea>
		<button class="chat-input-send-btn">Send</button>
	</section>

</div>
```

Reload the Workbench to make sure this looks okay.

Now, let's add some styling. Update `input/themes/standard/style.css` as follows:

```css
/* Input Blade containing element */
.chat-input {
  position: relative;

  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  /* push textarea in for button */
  padding-right: 80px;
}

.chat-input .chat-input-message,
.chat-input .chat-input-send-btn {
  height: 60px;
}

/* textarea */
.chat-input .chat-input-message {
  display: block;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
}

/* button */
.chat-input .chat-input-send-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 75px;
  text-align: center;
}
```

How does the Blade look in the Workbench now?

## The InputViewModel

Since you're now familiar with Knockout you'll know all about View Models; they
are a logical representation of the view. A purist view would also be that there
should be no business logic in a View Model, but we're building a reasonably simple
Blade (but feel free to refactor afterwards).

You can find the class definition for the Input View Model in `src/modularapp/chat/input/InputViewModel.js`;
yeah, sorry about the folder structure!

Update the `InputViewModel` definition to look as follows:

```js
'use strict';

var ko = require( 'ko' );
var Log = require( 'fell' ).Log;

function InputViewModel() {
	this.message = ko.observable( '' );
}

InputViewModel.prototype.buttonClicked = function() {
	return true;
};

module.exports = InputViewModel;
```

**You'll noticed that the tooling supports Node.js-style `require( 'module' )` calls
and the functionality that the file exposes is determined via assignment to `module.exports`.**

Enough hand-holding! Time for some real exercises:

### Bind to the message property

In order to do this you'll need to update the view definition (`view.html`) with an
appropriate `data-bind` property.

##### Hint:

* The *Visualise Knockout View Model* Workbench tool can be handy here. In order to see
the model update after you have entered text into the `textarea` you'll need to click
the button or click out of the element.

### Bind the buttonClicked function to the button

You'll also need to use `data-bind` for this.

Also, when the button is clicked take the value from the `message` property and log it
to the console using `Log.info( <your-log-message> )`. This will let you check that
the data binding is working as you expect it.

### Check Message Validity

You'll remember that one of the requirements was to only send the message to other
users if there was some text. So, check that the users has actually entered something.
The return value from the `buttonClicked` function should then reflect that validity;
do this by returning `true` if the message is valid and `false if it's invalid.

*We'll be testing this shortly.*

## Test the InputViewModel

A key part of building a quality maintainable application is that it's tested. So,
let's write a test that checks the default message should be blank.

Navigate to `test/test-unit/js-test-drive/tests` and open `InputViewModelTest.js`.
It should look as follows:

```js
var InputViewModelTest = TestCase( 'InputViewModelTest' );

var InputViewModel = require( 'modularapp/chat/input/InputViewModel' );

InputViewModelTest.prototype.testDefaultMessageIsEmpty = function() {
  var model = new InputViewModel();
  assertEquals( 'Hello!', model.message() );
};
```

### Running Tests

There are lots of testing tools available. BladeRunnerJS comes with [js-test-driver](https://code.google.com/p/js-test-driver/)
built-in.

In order to run the tests you first need to start the test server. From the `sdk`
directory run:

```
./brjs test-server --no-browser
```

In your browser navigate to http://localhost:4224/capture. This is the browser window/tab
that the test server will instruct to execute your tests.

Now that the test server is running open another terminal/command prompt and execute
the following from the `sdk` directory:

```
./brjs test ../apps/modularapp/chat-bladeset/blades/input
```

This will execute all the tests it finds within that directory. For now, this
is just the single test that we've written.

You should see output similar to the following:

```
› ./brjs test ../apps/modularapp/chat-bladeset/blades/input
Java HotSpot(TM) 64-Bit Server VM warning: ignoring option MaxPermSize=128M; support was removed in 8.0
creating plugins
performing node discovery
making plugins available via model
BladeRunnerJS version: v0.7-0-gff6e9cb, built: 14 April 2014 15:53 BST

Server already running, not bothering to start a new instance...

Testing tests (UTs):
Chrome: Reset
Chrome: Reset
E
Total 1 tests (Passed: 0; Fails: 1; Errors: 0) (2.00 ms)
  Chrome 34.0.1847.131 Mac OS: Run 1 tests (Passed: 0; Fails: 1; Errors 0) (2.00 ms)
    InputViewModelTest.testDefaultMessageIsEmpty failed (2.00 ms): AssertError: expected "Hello!" but was ""
      Error: expected "Hello!" but was ""
          at InputViewModelTest.testDefaultMessageIsEmpty (http://localhost:4224/test/tests/InputViewModelTest.js:18:33)

Tests failed: Tests failed. See log for details.
Tests Failed.

- Time Taken: 2secs
Error:
  Test failure or error while running tests.
```

Let's fix that error by updating the test to check for an empty string:

```js
var InputViewModelTest = TestCase( 'InputViewModelTest' );

InputViewModelTest.prototype.testDefaultMessageIsEmpty = function() {
  var model = new InputViewModel();
  assertEquals( '', model.message() );
};
```

If you run the `brjs test` command the test will now pass:

```
› ./brjs test ../apps/modularapp/chat-bladeset/blades/input
Java HotSpot(TM) 64-Bit Server VM warning: ignoring option MaxPermSize=128M; support was removed in 8.0
creating plugins
performing node discovery
making plugins available via model
BladeRunnerJS version: v0.7-0-gff6e9cb, built: 14 April 2014 15:53 BST

Server already running, not bothering to start a new instance...

Testing tests (UTs):
Chrome: Reset
Chrome: Reset
.
Total 1 tests (Passed: 1; Fails: 0; Errors: 0) (2.00 ms)
  Chrome 34.0.1847.131 Mac OS: Run 1 tests (Passed: 1; Fails: 0; Errors 0) (2.00 ms)
Tests Passed.

- Time Taken: 2secs
```

We've now written our first test and made it pass.

For full details see the [Running Test documentation](http://bladerunnerjs.org/docs/use/running_tests/).

### Additional Tests

Now that you know how to write and run tests you can also write test that assert
the functionality the Blade is to provide:

* If the user enters empty text then the `buttonClicked` should return `false`
* Valid text will result in the `buttonClicked` returning `true`.

*Heads Up! test functions must have a name with the `test` prefix e.g. `testThisThing`*

## Basic Blade Functionality Complete - push to github

Congratulations! The basic functionality for this Blade is complete. It's time to
commit your changes locally and push them to github.

* `git add chat-bladeset/blades/input`
* `git commit -m 'basic input blade functionality'`
* `git pull origin master`
* Fix any merge conflicts - *there shouldn't be any*
* `git push origin master`

## Where next?

If you've completed this really quickly you can always try creating another Blade.
