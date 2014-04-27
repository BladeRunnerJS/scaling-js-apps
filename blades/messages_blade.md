# Messages Blade Exercise (30 mins)

Your team is building the Messages Blade. Sweet!

The Message Blade should have the following functionality:

* Display a list of chat messages
* Display the user who sent a message
* Display the timestamp of a message

## Create the Blade

You already have the application within the BladeRunnerJS installation. You'll
also notice that it has a folder called `chat-bladeset`. Don't worry about
BladeSets, we won't be using them, but out Blades will be located under this folder.

From the BladeRunnerJS `sdk` directory run the following command to create a Blade:

```
./brjs create-blade modularapp chat messages
```

You've just scaffolded your first Blade. You can find the Blade skeleton in
`apps/modularapp/chat-bladeset/blades/messages`.

You can find out more about what's just been created in the [Create a Blade docs](http://bladerunnerjs.org/docs/use/create_blade/).

## View the Blade a Workbench

Start the BRJS development server by running the following command from the `sdk`
directory:

```
./brjs serve
```

Now navigate to http://localhost:7070/modularapp/chat-bladeset/blades/messages/workbench/
to see your *amazing* Blade.

Feel free to take a look around the Blade assets to see how the code is structured
and familiarise yourself with where things are.

## Build the View

Let's update the view to have the elements we need for our required functionality.

Open up the `messages/resources/html/view.html` file and make it look as follows:

```html
<div id="modularapp.chat.messages.view-template">

	<section class="messages">

		<div class="messages-container">
			<div class="message">
				<span class="message-user-id"></span>
				<span class="message-text"></span>
				<span class="message-timestamp"></span>
			</div>
  	</div>

	</section>

</div>
```

Reload the Workbench to make sure this looks okay... *Err, I can't see anything!*.

Good point. What do you do when you don't have any data? Well, you need to add
some fake data. So, let's take a look at the code.

## The MessagesViewModel

Since you're now familiar with Knockout you'll know all about View Models; they
are a logical representation of the view. A purist view would also be that there
should be no business logic in a View Model, but we're building a reasonably simple
Blade (but feel free to refactor afterwards).

You can find the class definition for the Messages View Model in `src/modularapp/chat/messages/MessagesViewModel.js`;
yeah, sorry about the folder structure!

Update the `MessagesViewModel` definition to look as follows:

```js
'use strict';

var ko = require( 'ko' );

var MessageItemViewModel = require( './MessageItemViewModel' );

function MessagesViewModel() {
  this.messages = ko.observableArray( [] );
}

MessagesViewModel.prototype.addMessage = function( message ) {
  var model = new MessageItemViewModel( message );
  this.messages.push( model );
};

module.exports = MessagesViewModel;
```

**You'll noticed that the tooling supports Node.js-style `require( 'module' )` calls
and the functionality that the file exposes is determined via assignment to `module.exports`.**

You'll also see that a class called `MessageItemViewModel` is being required. This
View Model represents individual messages. So, create a `MessageItemViewModel.js` file
in `src/modularapp/chat/messages/` and set the content as follows:

```js
'use strict';

function MessageItemViewModel( message ) {
  this.text = ko.observable( message.text );
  this.timestamp = ko.observable( message.timestamp );
  this.userId = ko.observable( message.userId );
}

module.exports = MessageItemViewModel;
```

Back in the `MessagesViewModel` there is an `addMessage` function that takes a
data structure that is passed into the `MessageItemViewModel` constructure. The
new instance is then pushed onto the `messages` Array. Let's use that function
to add some fake data.

Open up `workbench/index.html` and after the `var model = new MessagesViewModel();`
line add the following:

```js
model.addMessage( { userId: 'leggetter', text: 'hello', timestamp: new Date() } );
model.addMessage( { userId: 'andyberry88', text: 'Yo!', timestamp: new Date() } );
```

## Back to the View(ture - sorry!)

Okay, let's reload the messages Workbench. We now have some UI to work with!

Next, let's add some styling. Update `messages/themes/standard/style.css` as follows:

```css
/* Message Blade container element */
.messages {
  min-width: 400px;
  height: 200px;
  overflow: auto;
}

/* individual message */
.message {
  position: relative;
  overflow: auto;

  margin-bottom: 10px;
}

.message-user-id {
  position: absolute;
  top: 0;
  left: 0;

  font-weight: bold;
  width: 150px;
  margin-right: 5px;
  text-align: right;

  cursor: pointer;
}

.message-user-id:after {
  content:': ';
}

.message-text {
  display: inline-block;

  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  /* space for userId */
  padding-left: 160px;
  /* space for timestamp */
  padding-right: 100px;

  width: 100%;
  min-width: 200px
}

.message-timestamp {
  position: absolute;
  top: 0;
  right: 0;

  width: 100px;

  text-align: right;
  font-style: italic;
  font-size: small;
}
```

How does the Blade look in the Workbench now?

Enough hand-holding! Time for some real exercises:

### Loop over the messages Array

In order to do this you'll need to update the view definition (`view.html`) with an
appropriate `data-bind="for-each:"` property and value (*note: that value isn't complete*). Do this on the element with the class
of `messages-container`.

### Show the values of each of the MessageItemViewModel in their respective spans

You'll also need to use `data-bind` for this.

### Change the timestamp to a nicely formatted value

That timestamp isn't human readable. Update the `MessageItemViewModel` so that
it sets the `timestamp` property to something that's much more human-readable.

BRJS comes with the [momentjs](http://momentjs.com/) library so you can do the following
within `MessageItemViewModel.js` to use it:

```js
var moment = require( 'momentjs' );
```

## Test the MessagesViewModel

A key part of building a quality maintainable application is that it's tested. So,
let's write a test that checks the default message should be blank.

Navigate to `test/test-unit/js-test-drive/tests` and update `MessagesViewModelTest.js`
as follows:

```js
var MessagesViewModelTest = TestCase( 'MessagesViewModelTest' );

var MessagesViewModel = require( 'modularapp/chat/messages/MessagesViewModel' );

MessagesViewModelTest.prototype.testAddingAMessageIncreasesMessageCountByOne = function() {
  var model = new MessagesViewModel();
  var expectedMessageCount = 0;

  model.addMessage( { userId: 'test', text: 'test text', timestamp: new Date() } );
  assertEquals( expectedMessageCount, model.messages().length );
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
./brjs test ../apps/modularapp/chat-bladeset/blades/messages
```

This will execute all the tests it finds within that directory. For now, this
is just the single test that we've written.

You should see output similar to the following:

```
› ./brjs test ../apps/modularapp/chat-bladeset/blades/messages
Java HotSpot(TM) 64-Bit Server VM warning: ignoring option MaxPermSize=128M; support was removed in 8.0
creating plugins
performing node discovery
making plugins available via model
BladeRunnerJS version: v0.7-0-gff6e9cb, built: 14 April 2014 15:53 BST

Server already running, not bothering to start a new instance...

Testing tests (UTs):
Chrome: Reset
Chrome: Reset
...F
Total 1 tests (Passed: 0; Fails: 1; Errors: 0) (180.00 ms)
  Chrome 34.0.1847.131 Mac OS: Run 4 tests (Passed: 0; Fails: 1; Errors 0) (180.00 ms)
    MessagesViewModelTest.testAddingAMessageIncreasesMessageCountByOne failed (1.00 ms): AssertError: expected 0 but was 1
      Error: expected 0 but was 1
          at MessagesViewModelTest.testAddingAMessageIncreasesMessageCountByOne (http://localhost:4224/test/tests/MessagesViewModelTest.js:10:55)

Tests failed: Tests failed. See log for details.
Tests Failed.

- Time Taken: 2secs
Error:
  Test failure or error while running tests.
```

Let's fix that error by updating the test to check for an empty string:

```js
var MessagesViewModelTest = TestCase( 'MessagesViewModelTest' );

var MessagesViewModel = require( 'modularapp/chat/messages/MessagesViewModel' );

MessagesViewModelTest.prototype.testAddingAMessageIncreasesMessageCountByOne = function() {
  var model = new MessagesViewModel();
  var expectedMessageCount = 1;

  model.addMessage( { userId: 'test', text: 'test text', timestamp: new Date() } );
  assertEquals( expectedMessageCount, model.messages().length );
};
```

If you run the `brjs test` command the test will now pass:

```
› ./brjs test ../apps/modularapp/chat-bladeset/blades/messages
Java HotSpot(TM) 64-Bit Server VM warning: ignoring option MaxPermSize=128M; support was removed in 8.0
creating plugins
performing node discovery
making plugins available via model
BladeRunnerJS version: v0.7-0-gff6e9cb, built: 14 April 2014 15:53 BST

Server already running, not bothering to start a new instance...

Testing tests (UTs):
Chrome: Reset
Chrome: Reset
....
Total 1 tests (Passed: 1; Fails: 0; Errors: 0) (779.00 ms)
  Chrome 34.0.1847.131 Mac OS: Run 4 tests (Passed: 1; Fails: 0; Errors 0) (779.00 ms)
Tests Passed.

- Time Taken: 5secs
```

We've now written our first test and made it pass.

For full details see the [Running Test documentation](http://bladerunnerjs.org/docs/use/running_tests/).

### Additional Tests

Now that you know how to write and run tests you can also write test that assert
the functionality the Blade is to provide:

* Check the `MessageItemViewModel` properties are initialised as expected from data structure that's passed to its constructor
* Ensure the `timestamp` is formatted as expected in the `MessageItemViewModel`

## Basic Blade Functionality Complete - push to github

Congratulations! The basic functionality for this Blade is complete. It's time to
commit your changes locally and push them to github.

* `git add chat-bladeset/blades/messages`
* `git commit -m 'basic input blade functionality'`
* `git pull origin master`
* Fix any merge conflicts - *there shouldn't be any*
* `git push origin master`

## Where next?

If you've completed this really quickly you can always try creating another Blade.
