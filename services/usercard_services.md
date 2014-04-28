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
the require path to these implementations. Of course, we do. So, open up the configuration
file for the Workbench, which you'll find here:
`chat-bladeset/blades/usercard/workbench/resources/aliases.xml`, and update it as
follows:

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
doing something. In this case it's the User Card displaying informationa about a
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

One way of achieving this is by `UsercardViewModel` a listener by implementing these functions
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

var MessagesViewModel = require( 'modularapp/chat/messages/MessagesViewModel');
var ServiceRegistry = require( 'br/ServiceRegistry' );
var chatService = ServiceRegistry.getService( 'chat.service' );

describe( 'The Messages', function() {

} );

```

*Note: You could call this file MessagesSpecTest.js*.

The first thing to notice is that we're using Jasmine, and specifcially we're using
[Jasmine 1.3](http://jasmine.github.io/1.3/introduction.html) as it ships with BRJS.

You'll see we've required the `MessagesViewModel` and we have a reference to
the Chat Service via `chatService`. Now we need to write one of each of the two types
of test.

### Testing Service Interactions

As with anything in software it's possible to achieve the same thing in multiple ways.
For example, we can test service interactions by:

* Spying on interactions with the User Service that is already registered with the ServiceRegistry
* Add functionality to our `FakeChatService` that lets us check interactions
* Replace the User Service in the `ServiceRegistry` with a Mock object

Since we're using Jasmine, we'll use [Spies](http://j.mp/PITNqK), but we'll also demonstrate how the
`FakeChatService`, that was developed really to help our development within the
Workbench, is also useful here.

### Testing Feature Service Interactions using Spies

The only user interaction that takes place in the Messages Blade is the user
clicking on the User ID in a message. This results in an interaction with the
`EventHub` service.

Add the following spec to the `The Input` suite:

```js
describe( 'The Messages', function() {

  it( 'Should trigger a "user-selected" event on a user channel on the EventHub when a user is selected', function() {

    spyOn( eventHub, 'channel' ).andCallThrough();
    spyOn( userChannel, 'trigger' );

    var testUserId = 'testUser';

    // TODO: Interact with View Model as if the user has selected a User Id

    var expectedEventData = {
      userId: testUserId
    };
    expect( eventHub.channel ).toHaveBeenCalledWith( 'user' );
    expect( userChannel.trigger ).toHaveBeenCalled( 'user-selected', expectedEventData );

  } );

} );
```

The test above is nearly complete. You just need to interact with the `MessagesViewModel`
and simulate the user clicking the User Id. You'll need to make sure that the appropriate
data (the User Id) is passed to the click handler.

#### Hints

* Use the `testUserId` value in the data that's passed to the click handler as
it's also used when creating the `expectedEventData` object used in the assertion

### Testing Feature ViewModel State using a Fake Service

The next thing we want to do is see how services can impact the state of the View Model.
To do this we'll use the chat service - we've seen that our `FakeChatService`
implementation triggers a `new-message` event when the `sendMessage` function is
called. We can use this knowledge to do the test.

Before we start, we need to remember that our implementation doesn't bind to the
`new-message` event until it's recieved the `getMessages` callback which is an
asynchronous call. Luckily our `FakeService` has a setting `FakeService.fakeAsync`
so that it doesn't make this callback truly asynchronously. This means we can ensure
that the `getMessages` response has been made before we call `sendMessage`.

Here's the test template - just fill in the blanks:

```js
it( 'Should display new messages that are send via the Chat Service', function() {
  // Setup
  var chatService = ServiceRegistry.getService( 'chat.service' );
  chatService.fakeAsync = false;
  var messagesViewModel = new MessagesViewModel();
  var message = { userId: 'testUserId', text: 'testUserText', timestamp: new Date() };

  // Execute
  // TODO: send message using the Chat Service

  // Assert
  var firstMessage = messagesViewModel.messages()[ 0 ];
  // TODO: expect( ... );
} );
```

#### Hints

* An alternative to using `FakeChatService.fakeAsync = false;` is to use the very
handy [jasmine.Clock](http://j.mp/1nWvotX).
* You should probably clear down the `FakeChatService.fakeAsync` after the test.
Otherwise future tests may be affected by this unexpected synchronous behaviour.

## Congrats - Service Interaction Complete!

Our Blade is now interacting with two services and we've tested both UI through
to Services and Services through to the UI; full feature testing.

It's time to commit those changes and push them to github:

* `git add chat-bladeset/blades/messages`
* `git commit -m 'integrating messages blade with services'`
* `git pull origin master`
* Fix any merges - there shouldn't be any
* `git push origin master`

## Where Next?

See how the other teams in your company are getting on. Can you help them out?

Then, we'll see how our application looks.
