# Exercise: User Card Blade (30 mins)

Your team has landed the User Card Blade. Great catch!

The User Card Blade should have the following functionality:

* Display information about a user
* Show based on a 'User Selected' application interaction
* Hide when closed

## Create the Blade

You already have the application within the BladeRunnerJS installation. Within the root of the application directory you'll see a `blades` sub-directory. This is where blades are to be created.

From the BladeRunnerJS `sdk` directory run the following command to create a Blade:

```
./brjs create-blade modularapp default usercard
```

You've just scaffolded your first Blade. You can find the Blade skeleton in
`apps/modularapp/blades/usercard`.

You can find out more about what's just been created in the [Create a Blade docs](http://bladerunnerjs.org/docs/use/create_blade/).

## View the Blade a Workbench

Start the BRJS development server by running the following command from the `sdk`
directory:

```
./brjs serve
```

Now navigate to http://localhost:7070/modularapp/workbench/usercard/
to see your *amazing* Blade.

Feel free to take a look around the Blade assets to see how the code is structured
and familiarise yourself with where things are.

## Build the View

Let's update the view to have the elements we need for our required functionality.

Open up the `usercard/resources/html/view.html` file and make it look as follows:

```html
<section class="chat-usercard" id="modularapp.usercard.view-template">

	<img class="usercard-avatar" />
	<div class="usercard-name">Some Name</div>
	<div class="usercard-company">Some Company</div>
	<div class="usercard-email">some@emailaddress.com</div>
	<div class="usercard-location">Some Location</div>

	<button class="btn btn-default btn-xs usercard-close-btn">
			<span class="glyphicon glyphicon-remove"></span>
	</button>

</section>

```

Reload the Workbench to make sure this you see the fake data. We'll add the data bindings later.

Next, let's add some styling. Update `usercard/themes/black/style.css` as follows:

```css
.chat-usercard {
  position: fixed;

  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333;

  width: 300px;
  min-height: 75px;
  padding: 10px;
  padding-left: 70px;

  border-radius: 5px;
  -webkit-box-shadow: 0 2px 3px rgba(0,0,0,.3);
  box-shadow: 0 2px 3px rgba(0,0,0,.3);
  background: #f7f7f9;
}

.usercard-avatar {
  position: absolute;
  left: 10px;
  width: 50px;
}

.usercard-close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}
```

How does the Blade look in the Workbench now?

Time to look at the View Model.

## The UsercardViewModel

For this workshop we're using KnockoutJS as our data-binding solution. Knockout uses View Models that are logical representations of the views. A purist opinions of views is that that there
should be no business logic in a View Model, but we're building a reasonably simple
Blade (but feel free to refactor afterwards).

You can find the class definition for the User Card View Model in `blades/usercard/src/UsercardViewModel.js`; yeah, sorry about the folder structure!

Update the `UsercardViewModel` definition to look as follows:

```js
'use strict';

var ko = require( 'ko' );
require( 'bootstrap' );

var POSITION_DEFAULT = { x: '50%', y: 0 };

function UsercardViewModel() {
	this.avatarUrl = ko.observable('');
	this.name = ko.observable('');
	this.company = ko.observable('');
	this.email = ko.observable('');
	this.location = ko.observable('');

	this.cardShown = ko.observable( true );
	this.position = ko.observable( pixelify( POSITION_DEFAULT ) );
}

function pixelify( pos ) {
	var newPos = {};
	var value;
	for( var prop in pos ) {
		value = pos[ prop ];
		// only add px to number values
		if( isNaN( value ) === false ) {
			newPos[ prop ] = value + 'px';
		}
		else {
			newPos[ prop ] = value;
		}
	}
	return newPos;
}

module.exports = UsercardViewModel;
```

**You'll noticed that the tooling supports Node.js-style `require( 'module' )` calls
and the functionality that the file exposes is determined via assignment to `module.exports`.**

The first set of properties are pretty obvious - they hold the user information.

The `cardShown` property is used to indicate if the Blade should be shown.
This is because the User Card should only be shown if the user has requested to
see more information about another user. *Right now this defaults to `true` (shown)
but later we'll need to default to `false`*.

The `position` property is required because the User Card may be shown next to
the UI element that has been clicked on when selecting a user.

Enough hand-holding! Time for some real exercises:

## Ensure the User Card can be Hidden via the Close Button

Bind the `button` element to a click event which calls a `closeClicked` function
on the View Model. It should also set the `cardShown` property to `false`.

```js
UsercardViewModel.prototype.closeClicked = function( data, event ) {
  // TODO: hide card
};
```

Over to you to to implement the click handler and add the appropriate data-bindings
to the view (`view.html`).

##### Hints

* Use the [click binding](http://knockoutjs.com/documentation/click-binding.html) to set up the click event
* Use the [visible binding](http://knockoutjs.com/documentation/visible-binding.html) to
bind to this property to the element with the class of `chat-usercard`
* Use the Workbench to check the close button works and the User Card is hidden

##### Solution

If you've not used KnockoutJS before or you just want to check your solution here it is:

```html
<section class="chat-usercard"
				 data-bind="visible: cardShown"
				 id="modularapp.usercard.view-template">

	<img class="usercard-avatar" />
	<div class="usercard-name">Some Name</div>
	<div class="usercard-company">Some Company</div>
	<div class="usercard-email">some@emailaddress.com</div>
	<div class="usercard-location">Some Location</div>

	<button data-bind="click: closeClicked" class="btn btn-default btn-xs usercard-close-btn">
			<span class="glyphicon glyphicon-remove"></span>
	</button>

</section>
```

And the JavaScript:

```js
UsercardViewModel.prototype.closeClicked = function( data, event ) {
	this.cardShown( false );
};
```

### Bind the User Properties to the View

Start by binding the obvious user properties to the view (`blades/usercard/resources/html/view.html`). In order to do this you'll need to update the view definition with appropriate usage of
`data-bind`.

In order to test the binding without editing your application code you can use
the Workbench.

The Workbench code can be found in `blades/usercard/workbench/index.html`.

You can easily add code to manipulate the properties on the View Model e.g.

```
var model = new UsercardViewModel();
model.name( 'Jive Bunny' );
```

##### Hint:

* The *Visualise Knockout View Model* Workbench tool can be handy when checking
the values of the Blade's View Model.

##### Solution:

```html
<section class="chat-usercard"
				data-bind="visible: cardShown"
				id="modularapp.usercard.view-template">

	<img class="usercard-avatar" data-bind="attr: { src: avatarUrl }" />
	<div class="usercard-name" data-bind="text: name"></div>
	<div class="usercard-company" data-bind="text: company"></div>
	<div class="usercard-email" data-bind="text: email"></div>
	<div class="usercard-location" data-bind="text: location"></div>

	<button data-bind="click: closeClicked" class="btn btn-default btn-xs usercard-close-btn">
			<span class="glyphicon glyphicon-remove"></span>
	</button>

</section>
```

### Don't Show the User Card by Default

By default the `cardShown` should be `false` this can make things difficult during
development. We can use the Workbench to help here - open `workbench/index.html` and change
the value to help development after we've completed this task.

```js
var model = new UsercardViewModel();
model.cardShown( true );
```

### Set the Position of the User Card (*if time*)

When the user requests to see more information about a user they may do this via
the UI. If that's the case the User Card should be positioned where the UI interaction
was performed. Because of this it's necessary to be able to position the User
Card via the `position` observable.

This property should have a value with an `x` and `y` that can be set to
`style.left` and `style.top` respectively. The `pixelify` function that
we added to the View Model helps make sure any `Number` values are given
a `px` suffix. Any other value types are left unaltered.

So, use the KnockoutJS [style binding](http://knockoutjs.com/documentation/style-binding.html)
to set the position on the `class="chat-usercard"` element.

Once you've added the binding create a `userSelected( data )` function that sets the user
information as well as optionally supplying a position. The `data` parameter
should take the following structure:

```js
{
  userId: String
  position: {
    x: Number,
    y: Number
  }
}
```

For now, concentrate on ensuring the function can handle the `position` property
is optional on the `data` parameter. We'll deal with user data later.

```js
UsercardViewModel.prototype.userSelected = function( data ) {
	// TODO: set position
};

```

##### Hint

* Use the Workbench to set the `position` property and make sure everything is working
as expected.
* Default to the values set in the `POSITION_DEFAULT` variable
* Use the Workbench to call the `userSelected` function with different parameters

## Test the UsercardViewModel

A key part of building a quality maintainable application is that it's tested. So,
let's write a test that checks the User Card defaults to not being shown.

Navigate to `blades/usercard/test-unit/tests` and update `UsercardViewModelTest.js` as follows:

```js
var UsercardViewModelTest = TestCase( 'UsercardViewModelTest' );

var UsercardViewModel = require( 'modularapp/usercard/UsercardViewModel' );

UsercardViewModelTest.prototype.testCardShownDefaultsToFalse = function() {
  var model = new UsercardViewModel();
  assertTrue( model.cardShown() );
};
```

*Yeah, this should fail! We'll fix that shortly.*

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
./brjs test ../apps/modularapp/blades/usercard
```

This will execute all the tests it finds within that directory. For now, this
is just the single test that we've written.

You should see output similar to the following:

```
› ./brjs test ../apps/modularapp/blades/usercard

Testing tests (UTs):
Chrome: Reset
Chrome: Reset
F
Total 1 tests (Passed: 0; Fails: 1; Errors: 0) (1.00 ms)
  Chrome 36.0.1985.125 Mac OS: Run 1 tests (Passed: 0; Fails: 1; Errors 0) (1.00 ms)
    UsercardViewModelTest.testCardShownDefaultsToFalse failed (1.00 ms): AssertError: expected true but was false
      Error: expected true but was false
          at UsercardViewModelTest.testCardShownDefaultsToFalse (http://localhost:4224/test/tests/UsercardViewModelTest.js:7:21)

Tests failed: Tests failed. See log for details.
Tests Failed.
```

Let's fix that error by updating the test to correctly `assertFalse`:

```js
var UsercardViewModelTest = TestCase( 'UsercardViewModelTest' );

var UsercardViewModel = require( 'modularapp/usercard/UsercardViewModel' );

UsercardViewModelTest.prototype.testCardShownDefaultsToFalse = function() {
  var model = new UsercardViewModel();
  assertFalse( model.cardShown() );
};
```

If you run the `brjs test` command the test will now pass:

```
› ./brjs test ../apps/modularapp/blades/usercard

Testing tests (UTs):
Chrome: Reset
Chrome: Reset
.
Total 1 tests (Passed: 1; Fails: 0; Errors: 0) (3.00 ms)
  Chrome 36.0.1985.125 Mac OS: Run 1 tests (Passed: 1; Fails: 0; Errors 0) (3.00 ms)
Tests Passed.
```

We've now written our first test and made it pass.

For full details see the [Running Test documentation](http://bladerunnerjs.org/docs/use/running_tests/).

### Additional Tests (if time)

Now that you know how to write and run tests you can also write test that assert
the functionality the Blade is to provide:

* Test your handling of the optional `data.position` parameter to the `userSelected` function
* If time, check the `UsercardViewModel` properties are initialised as expected from the
data structure that's passed to its constructor

*Heads Up! test functions must have a name with the `test` prefix e.g. `testThisThing`*

## Basic Blade Functionality Complete - push to github

Congratulations! The basic functionality for this Blade is complete. It's time to
commit your changes locally and push them to github.

* `git add blades/usercard`
* `git commit -m 'basic user card blade functionality'`
* `git pull origin master`
* Fix any merge conflicts - *there shouldn't be any*
* `git push origin master`

## Where next?

If you've completed this really quickly you can always try creating another Blade.
