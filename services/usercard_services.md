# Exercise: User Card & Services

The following doesn't give you a step-by-step guide of what to do. It gives you
a number of individual pieces and you need to put them together in order to meet
the main feature requirement of the User Card Blade:

> When an interaction occurs within the application that indicates more information
about a user is to be shown the User Card will appear and show that information

The User Card Blade uses two services which will enable you to achieve this functionality:

* The User Service to take a use ID and get more information about that user
* The EventHub in order to be informed of `user-selected` interactions

We're nearly ready to start coding. But before we do let's do a little bit of setup.

## Service Configuration

As we said, a nice team have put together some fake services to help us develop
our Blade's functionality. In order to configure the services you need to know
the require path to these implementations.

Open the `aliases.xml` configuration file for the Workbench,
`blades/usercard/workbench/resources/aliases.xml`, and set the content as:

```xml
<aliases xmlns="http://schema.caplin.com/CaplinTrader/aliases" useScenario="dev">
  <alias name="user.service" class="userservice.FakeUserService"/>
</aliases>
```

*Yes, it's XML*. What can we say! Anyway, we've now actually configured:

* `user.service` to use a fake User Service implementation

Now that the helper service is in place, we can get to work.

## Bind to User Selected Interaction Events

By this we mean bind to `user-selected` that have been triggered by other parts
of the application that know doing this will result in other parts of the app
doing something. In this case it's the User Card displaying information about a
selected user.

In order for this to work the publisher and subscriber need to know three things:

* The channel to publish (trigger) the event on - the channel name is `user`
* The name of the event to trigger - we've agreed upon `user-selected`
* The payload of the event data

From earlier you'll remember that the latter is in the form:

```js
{
  userId: String
  position: {
    x: Number,
    y: Number
  }
}
```

So, here are the pieces of the puzzle that you need to put together in order
for the User Card to be informed of these events:

Firstly, you need to get hold of the `EventHub` from the `ServiceRegistry`:

```js
var ServiceRegistry = require( 'br/ServiceRegistry' );
this._eventHub = ServiceRegistry.getService( 'br.event-hub' );
```

Channels can be retrieved from the EventHub:

```js
var channel = this._eventHub.channel( 'user' );
```

Events are bound to on the Channel as follows, with the second parameter being
the handling function and the third the content. By using `this` as the context
we can ensure it will refer to the `UsercardViewModel` instance so we easily have
access to other member variables. From earlier, you'll already have a `userSelected`
function:

```js
channel.on( 'user-selected', this.userSelected, this );
```

Now you should be able to build a good picture of the functionality to handle
`user-selected` events.

##### Hints

* You can trigger events from the JavaScript console to test your functionality.
Try entering the following:

```js
ServiceRegistry.getService( 'br.event-hub' )
  .channel( 'user' )
    .trigger( 'user-selected', { userId: 'testUser' } );
```

* The Workbench has an *EventHub Logging* tool that can be useful to make sure
the `UsercardViewModel` is correcting interacting with the `EventHub` service.

## Fetch User Information from the User Service

In order to display additional user information you need to get that information
from the User Service.

Get the User Service instance that's been set up from the `ServiceRegistry:

```js
var ServiceRegistry = require( 'br/ServiceRegistry' );
this._userService = ServiceRegistry.getService( 'user.service' );
```

The `userSelected` callback provides access to a unique identifier to the user -
the `data.userId` property - so we need to get hold of that an use it with the
User Service `getUser( userId, listener )` function.

```js
UsercardViewModel.prototype.userSelected = function( data ) {
	this._userService.getUser( data.userId, this );

	// Leave existing positioning handling code here.
};
```

The fact that there's a `listener` object being passed in tells you that this is
an asynchronous call. In JavaScript there are a number of ways to listen for callbacks.
We've found that although passing in listeners that have to implement contracts
(in the same way as services do) can be a bit more effort, it can result in
a much more robust solution. There are of course times where passing in a `function`
will be fine.

Anyway, in this case we need to pass in an object that implements
two functions:

* `userRetrieved( user )` called when the user is successfully retrieved
* `userRetrievalFailed( code, message )` called if there is a problem - *we don't expect this*

One way of achieving this is by making `UsercardViewModel` a listener by implementing these functions
and passing a reference to `this` in as the `listener`.

```js
UsercardViewModel.prototype.userRetrieved = function( user ) {
  // TODO: update the user properties with the appropriate values

  // TODO: show the User Card
};

UsercardViewModel.prototype.userRetrievalFailed = function( code, message ) {
  // Something has gone wrong!
  // TODO: Panic!
};
```

The `user` object provides the required information via a `data` property and
sub-properties:

```js
{
  data: {
    login: String // the same as the provided userId
    avatar_url: String // a Url to an avatar
    name: String, // display name
    email: String,
    company: String,
    location: String
  }
}
```

You'll find there's even more information on the `data` property. Full details
can be found on the [GitHub getUsers Get a single user docs](https://developer.github.com/v3/users/#get-a-single-user).

This should provide you with enough information to get all the appropriate
moving parts in place. Don't worry, the provided `FakeUserService` is set up
to make development easier by providing fake user information for any `userId`.

#### Hint: Use the GitHub API to Get Real User Data During Development

The `FakeUserService` knows how to get data from GitHub - where the live app will
get its data. You can turn this on by calling `setUserDataFetcher( 'github' )` on
the User Service instance.

To keep your application code clean you should set this within your Workbench
(`workbench/index.html`).

```js
var userService = ServiceRegistry.getService( 'user.service' );
userService.setUserDataFetcher( 'github' );
```

When you do this you'll need to ensure that the `userId` you provide is a valid
GitHub username or the `userRetrievalFailed` callback will be called.

## Testing Features

*Before we start, you need to copy the contents of `aliases.xml` from the Workbench
into `usercard/tests/test-unit/js-test-driver/resources/aliases.xml`.*

In the services overview we talked about how using MVVM and Services allows us to
test full features in isolation. In this part of the exercise we're going to do
exactly that. We'll demonstrate how to achieve two types of test:

1. Create an instance of the View Model, interact with it, and ensure that
it results in the expected service interactions.
2. Force the Service to interact with the View Model and then verify the View Model state.

This way we're testing how UI interactions result in service interactions and how
service events are reflected in UI state.

Let's start by creating a new file called `UsercardFeatureTest.js` in `usercard/tests/test-unit/js-test-driver/tests/`
and update it to look as follows to add the Test Suite:

```js
'use strict';

require( 'jasmine' );

var UsercardViewModel = require( 'modularapp/chat/usercard/UsercardViewModel');
var ServiceRegistry = require( 'br/ServiceRegistry' );

describe( 'The User Card', function() {

} );

```

*Note: You could call this file UsercardSpecTest.js*.

The first thing to notice is that we're using Jasmine, and specifcially we're using
[Jasmine 1.3](http://jasmine.github.io/1.3/introduction.html) as it ships with BRJS.

### Testing Service Interactions

As with anything in software it's possible to achieve the same thing in multiple ways.
For example, we can test service interactions by:

* Spying on interactions with a service that is already registered with the ServiceRegistry
* Add functionality to Fake services that lets us check interactions
* Replace the User Service in the `ServiceRegistry` with a Mock object

Since we're using Jasmine, we'll use [Spies](http://j.mp/PITNqK), but we'll also demonstrate how the
Fake service, that was developed really to help our development within the
Workbench, is also useful here.

### Testing Feature Service Interactions using Spies

*Whoops! Since the User Card doesn't allow for any user action that results in a
service interaction, we can't write a test for this scenario.*

### Testing Feature ViewModel State using a Fake Service

But we can make up for it by seeing how the two services the User Card uses
can impact the state of the View Model. The User Card uses both the  EventHub,
to see the affect of `user-selected` events, and the User Service, to ensure
user data is shown as expected.

#### The User Card Should be Shown Following a User Selection

From earlier we know all about user selection interactions and how they are indicated
within the app by an event being triggered on the `EventHub`. Well, let's test
that scenario and ensure that the User Card is shown.

In order to do this we need to trigger the appropriate event on the `EventHub` and
pass event data in the correct format. Also, the User Service must return with
a valid user for this to work.

For this test we can let the `FakeUserService` help us out by always returning
user data for any `userId`. *However*, we will need to call upon Jasmine's very handy
`jasmine.Clock` to help us work around the User Service `getUser` function being
asynchronous.

Here's the test template - just fill in the blanks:

```js
describe( 'The User Card', function() {

  it( 'Should show the User Card when a User Selected event occurs', function() {
    jasmine.Clock.useMock();

    var eventHub = ServiceRegistry.getService( 'br.event-hub' );

    var usercardViewModel = new UsercardViewModel();

    // TODO: trigger 'user-selected' event on 'user' channel

    jasmine.Clock.tick( 1 );

    // Assert
    // expect( ... );
  } );

} );
```

#### Hints

* We'll think of something useful to add here in the future. If you've any suggestions
please let us know.

#### The User Card Should Display the Information Returned by the User Service

Add another spec to *The User Card* test suite. This time you should ensure that
the information that the User Service returns.

In order to do this we again need to call upon the `FakeUserService`. This time
we can use the `addUser` function that some of the other teams will have been using
during their development. In order for it to behave appropriately you'll need
to ensure that the `user` object has both a `userId` and `data` property with some
of the expected data set e.g.

```js
var user = {
  userId: 'crazyLegs',
  data: {
    avatar_url: 'http://stream1.gifsoup.com/view2/1414597/crazy-legs-o.gif',
    login: 'crazylegs',
    company: 'Disney',
    name: 'Dancin\' Dude!'
  }
};
userService.addUser( user );
```

Now you're ready to complete the test.

```js
  it( 'Should show the user information that the User Service provides', function() {
    jasmine.Clock.useMock();

    var eventHub = ServiceRegistry.getService( 'br.event-hub' );
    var userService = ServiceRegistry.getService( 'user.service' );

    // TODO: add fake data to User Service

    var usercardViewModel = new UsercardViewModel();

    // TODO: trigger 'user-selected' event on 'user' channel as done earlier

    jasmine.Clock.tick( 1 );

    // Assert
    // expect( usercardViewModel.name() ).toBe( ... );
    // expect( ... )

  } );
```

#### Hints

* We'll think of something useful to add here in the future. If you've any suggestions
please let us know.

## Congrats - Service Interaction Complete!

Our Blade is now interacting with two services and we've tested Services through
to the UI, but we didn't get a chance to test View Model through to Service. If
you've time you can take a look at the other Blades & Services excercises!

For now, it's time to commit those changes and push them to github:

* `git add blades/usercard`
* `git commit -m 'integrating user card blade with services'`
* `git pull origin master`
* Fix any merges - there shouldn't be any
* `git push origin master`

## Where Next?

If you've time you can take a look at the other Blades & Services exercises so
that you can see View through to Service testing. Or you can see how the other
teams in your company are getting on. Can you help them out?

Then, we'll see how our application looks.
