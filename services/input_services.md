# Input & Services Exercise

The following doesn't give you a step-by-step guide of what to do. It gives you
a number of individual pieces and you need to put them together in order to meeting
the main feature requirement of the Input Blade:

> When the user has entered text and clicks the send button it should be sent to the
other users.

The Input Blade uses two services which will enable you to achieve this functionality:

* The User Service to know who is sending messages
* The Chat Service in order to send messages to the other users

We're nearly ready to start coding. But before we do let's do a little bit of setup.

## Service Configuration

As we said, a nice team have put together some fake services to help us develop
our Blade's functionality. In order to configure the services you need to know
the require path to these implementations. Of course, we do. So, open up the configuration
file for the Workbench, which you'll find here:
`chat-bladeset/blades/input/workbench/resources/aliases.xml`, and update it as
follows:

```xml
<aliases xmlns="http://schema.caplin.com/CaplinTrader/aliases" useScenario="dev">
	<alias name="chat.service" class="chatservice.FakeChatService"/>
	<alias name="user.service" class="userservice.FakeUserService"/>
</aliases>
```

*Yes, it's XML*. What can we say! Anyway, we've now actually configured:

* `chat.service` to use a fake chat service implementation
* `user.service` to use a fake user service implementation

Now that the helper services are in place we can get to work.

## Get the Current User from the User Service

If you remember back to the overview of the services, the `ChatService.sendMessage`
function takes an object that should have three properties:

* `userId` - the ID of the current user
* `text` - the text entered into the `textarea`
* `timestamp` - the time the message is being sent

So, we need to get access to the the current user from the User Service.

In order to get the User Service we first need to get the `ServiceRegistry`.
Update your `InputViewModel` to get a reference:

```js
var ServiceRegistry = require( 'br/ServiceRegistry' );
```

Next, we want to get the User Service instance that's been set up:

```js
var userService = ServiceRegistry.getService( 'user.service' );
```

Finally, we need to get hold of the current user:

```js
userService.getCurrentUser( listener );
```

The fact that there's a `listener` object being passed in tells you that this is
an asynchronous call. In JavaScript there are a number of ways to listen for callbacks.
We've found that although passing in listeners that have to implement contracts
(in the same way as services) can be a bit more effort, it can result in
a much more robust solution. There are of course times where passing in a `function`
will be fine.

Anyway, in this case we need to pass in an object that implements
two functions:

* `userRetrieved( user )` called when the user is successfully retrieved
* `userRetrievalFailed( code, message )` called if there is a problem - we don't expect this

One way of achieving this is by `InputViewModel` a listener by implementing these functions
and passing a reference to `this` in as the `listener`.

```js
InputViewModel.prototype.userRetrieved = function( user ) {
  // store the current user
};

InputViewModel.prototype.userRetrievalFailed = function( code, message ) {
  // Something has gone wrong. How do we feed this back to the user?
};
```

##### Hints:

* The `FakeUserService` has a `setCurrentUser` implementation that you can use within
the Workbench to make sure that you have a user set during your development.
* There's lots to do here. You can add more tests if you like but we'd recommend
that you just make sure your existing tests still pass, or update them if required.

## Disable the Input Controls until User is Retrieved

Until a reference to the current user has been retrieved it shouldn't be possible
to enter text into the `textarea` or click the `button`.

Add an `enabled` Knockout Observable that has a value of either `true` or `false` and where
the `textarea` and `button` elements will be disabled if the `enabled` property
is set to `false`.

#### Hints

* KnockoutJS has an [enable binding](http://knockoutjs.com/documentation/enable-binding.html)

## If an Error Occurs Provide Feedback to the User

Somethings things go wrong. If that happens then the user will be left with an Input
feature that won't let them input anything. In case of error add an area to the
Input Blade that can give the user feedback.

Create a Knockout Observable called `feedbackMessage` in case of error (`userRetrievalFailed`)
set the contents of this so the user knows something has gone wrong.

#### Hints

* There's a [visible binding](http://knockoutjs.com/documentation/visible-binding.html)
that can ensure an element is only shown based on a condition e.g. if the `feedbackMessage`
is not empty.

## Sending a Message using the Chat Service

The `buttonClicked` function gets the text from the UI so it makes sense to
interact with the Chat Service at this point. In this exercise you need to:

* Get the Chat Service from the `ServiceRegistry`
* Construct an object with the following properties: `userId`, `text` and `timestamp`
* Use the `sendMessage` chat service function to send the message object that has just been constructed
* Clear down the `message` property so that the `textarea` is cleared

## Testing Features

*Before we start, you need to copy the contents of `aliases.xml` from the Workbench
into `input/tests/test-unit/js-test-driver/resources/aliases.xml`.*

In the services overview we talked about how using MVVM and Services allows us to
test full features in isolation. In this part of the exercise we're going to do
exactly that.

Create a new file called `InputFeatureTest.js` in `input/tests/test-unit/js-test-driver/tests/`
and update it to look as follows:

```js
'use strict';

require( 'jasmine' );

var InputViewModel = require( 'modularapp/chat/input/InputViewModel');
var ServiceRegistry = require( 'br/ServiceRegistry' );
var userService = ServiceRegistry.getService( 'user.service' );

describe( 'The Input', function() {

} );

```

*Note: You could call this file InputSpecTest.js*.

The first thing to notice is that we're using Jasmine, and specifcially we're using
[Jasmine 1.3](http://jasmine.github.io/1.3/introduction.html) as it ships with BRJS.

From there, you'll see we've required the `InputViewModel` and we have a reference to
the User Service via `userService`. Now we need to write at least two tests:

1. Create an instance of the `InputViewModel`, interact with it, and ensure that
it results in the expected service interactions.
2. Force the User Service to interact with the View Model and then verify the View Model state.

This way we're testing how UI interacts result in service interactions and how
service events are reflected in UI state.

### Testing Service Interactions

As with anything in software it's possible to achieve the same thing in multiple ways.
For example, we can test service interactions by:

* Spying on interactions with the User Service that is already registered with the ServiceRegistry
* Add functionality to our `FakeUserService` that lets us check interactions
* Replace the User Service in the `ServiceRegistry` with a Mock object

Since we're using Jasmine, we'll use Spies, but we'll also demonstrate how the
`FakeUserService`, that was developed really to help our development within the
Workbench, is also really useful.

### Testing Feature Service Interactions using Spies

Exactly how you put this test together depends on your `InputViewModel` implementation.
For this test we're going to assume that the current application user is requested
from the User Service in the `InputViewModel` constructor.

Add the following spec to the `The Input` suite:

```
describe( 'The Input', function() {

	it( 'Requests a user from the UserService', function() {
		spyOn( userService, 'getCurrentUser' );
		var inputViewModel = new InputViewModel();
		expect( userService.getCurrentUser ).toHaveBeenCalled();
	} );

} );
```

A better test is to interact with the View Model and then verify that a service
interaction has occurred. So, over to you:

Verify that when valid text has been entered into `message` and the send button
is clicked that the `sendMessage` function is called with an appropriately formed
message object.

#### Hints

* You'll need to get the Chat Service from the ServiceRegistry
* In order to get a user from the User Service is must first have one set. Our handy
`FakeUserService` has a `setCurrentUser` function.
* `getCurrentUser` is asynchronous - you have two options:
  * Call `InputViewModel.userRetrieved` with the user *this is probably the easiest*
  * Use Jasmine's [asynchronous support](http://jasmine.github.io/1.3/introduction.html?spec=A%20spec%20(with%20setup%20and%20tear-down)#section-Asynchronous_Support)
* You can use `expect( someFunction ).toHaveBeenCalledWith( args... )` to verify what parameters were passed
* If you want to verify the `timestamp` of the message you can use the `jasmine.any( Date )` to at least
check a `Date` object was passed

### Testing Feature ViewModel State using a Fake Service

The next thing we want to do is see how services can impact the state of the View Model.
The only time that the Input View Model is affected by a service is if the call to
`getCurrentUser` fails and the `userRetrievalFailed` callback is executed.

You could call `userRetrievalFailed` on the `InputViewModel` and check that the
`enabled` property is false. However, this is much more of a class unit test
and doesn't test the service interaction. Instead, we can use the `FakeUserService`
and set it up to act as if the user retrieval failed. We do this by using a helper.
By calling the following we tell the service to fail and ultimately call
`userRetrievalFailed` on the `InputViewModel`:

```javascript
userService.setUserDataFetcher( 'failing', { count: 1 } );
```

The second parameter tells the service to only fail with user retrieval once.

Now we know how to set up the fake service it should be easy to test that if the
user retrieval fails:

* the UI is not enabled
* a feedback messages is provided

#### Hints

* The `userService.setUserDataFetcher` makes an instant call to `userRetrievalFailed`
so you don't need to worry about creating an asynchronous test.

## Congrats - Service Interaction Complete!

Our Blade is now interacting with two services and we've tested both UI through
to Services and Services through to the UI; full feature testing.

It's time to commit those changes and push them to github:

* `git add chat-bladeset/blades/input`
* `git commit -m 'integrating input blade with services'`
* `git pull origin master`
* Fix any merges - there shouldn't be any
* `git push origin master`

## Where Next?

See how the other teams in your company are getting on. Can you help them out?

Then, we'll see how our application looks.
