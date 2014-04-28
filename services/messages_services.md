# Messages & Services Exercise

The following doesn't give you a step-by-step guide of what to do. It gives you
a number of individual pieces and you need to put them together in order to meet
the main feature requirement of the Messages Blade:

> Display message details that are received from the Chat Service

The Messages Blade uses two services which will enable you to achieve this functionality:

* The Chat Service in order to receive messages
* The EventHub in order to broadcast when a user ID is a message is selected

We're nearly ready to start coding. But before we do let's do a little bit of setup.

## Service Configuration

As we said, a nice team have put together some fake services to help us develop
our Blade's functionality. In order to configure the services you need to know
the require path to these implementations. Of course, we do. So, open up the configuration
file for the Workbench, which you'll find here:
`chat-bladeset/blades/messages/workbench/resources/aliases.xml`, and update it as
follows:

```xml
<aliases xmlns="http://schema.caplin.com/CaplinTrader/aliases" useScenario="dev">
  <alias name="chat.service" class="chatservice.FakeChatService"/>
</aliases>
```

*Yes, it's XML*. What can we say! Anyway, we've now actually configured:

* `chat.service` to use a fake chat service implementation

Now that the helper services are in place, we can get to work.

## Get the Existing Messages from the Chat Service

In order to get the Chat Service we first need to get the `ServiceRegistry`.
Update your `MessagesViewModel` accordingly e.g.

```js
var ServiceRegistry = require( 'br/ServiceRegistry' );
```

To get the list of existing messages we need to retrieve the Chat Service
from the `ServiceRegistry`.

```js
var chatService = ServiceRegistry.getService( 'chat.service' );
```

The Chat Service exposes a `getMessages` function that takes a `listener`.

```js
chatService.getMessages( listener );
```

The listener should implement two callback functions; `messagesRetrieved` and
`messageRetrievalFailed`. This can be achieved by passing in an object literal that defines these functions,
or by making the `MessagesViewModel` implement them and passing in `this` as the listener.

We've found that although passing in listeners that have to implement contracts
(in the same way as services do) can be a bit more effort, it can result in
a much more robust solution. There are of course times where passing in a `function`
will be fine.

Here's how you make the `MessagesViewModel` fulfil the listener contract:

```js
MessagesViewModel.prototype.messagesRetrieved = function( messages ) {
  // add the messages to the `messages` View Model Array
};

MessagesViewModel.prototype.messageRetrievalFailed = function() {
  // Something has gone wrong.
};
```

From there you need to add the messages to the `messages` ObservableArray.

Once this is complete you should see a full list of existing messages in the
Workbench UI.

##### Hints:

You'll remember that when we were focusing on just building the `MessagesViewModel`
we added calls to `viewModel.addMessage` in the Workbench. Now we want to make
sure that the View Model is interacting with the Chat Service. So, in the Workbench
you can replace the calls to `viewModel.addMessage` with code that fetches
the Chat Service and calls `sendMessage` on it; this will store the messages so that
calls to `getMessages` return those messages.

The code looks something like this:

```js
var chatService = ServiceRegistry.getService( 'chat.service' );
chatService.sendMessage( { userId: 'testUser', text: 'Word Up!', timestamp: new Date()  } );
```

## Display New Messages from the Chat Service

The Chat Service emits a `new-message` event whenever a new message becomes available.
So, in order to be informed when that happens you need to bind to that event `on`
the Chat Service.

*You should only bind to this event once you have the initial list of messages.
This avoids accidentally adding newer messages before the older ones, dealing with
duplicates and reordering. This can be done in `messagesRetrieved`.*

An example of doing this, calling a function on the `MessagesViewModel` and maintaining
the `this` context is:

```js
// do this within an instance function
chatService.on( 'new-message', this.handleNewMessage, this );
```

#### Hints

You could also use the `sendMessage` function we used earlier to test sending messages
from the JavaScript console e.g.

```js
var chatService = ServiceRegistry.getService( 'chat.service' );
chatService.sendMessage(
  { userId: 'testUser', text: 'Awesome console message!', timestamp: new Date()  }
);
```

**TODO: use the Chat Workbench Tool**

## Broadcast that the User ID in a Message has been Selected

The team that is building the User Card Blade rely on being informed if a user
is selected. This is achieved by other components within ModularApp broadcasting
`user-selected` events on a `user` channel.

For the Messages Blade this means:

* Adding a click handler to the element in the Messages View with `class="message-user-id"`
* Add a click handler function to the `MessagesViewModel`
* Creating event data object with a `userId` property that identifies the user that was selected
* Triggering a `user-selected` event on a `user` channel on the `EventHub`

The EventHub can be retrieved from the `ServiceRegistry` as follows:

```js
var ServiceRegistry = require( 'br/ServiceRegistry' );
var eventHub = ServiceRegistry.getService( 'br.event-hub' );
```

We've seen using the Knockout `data-bind` property to handle clicks before. What
you'll also need to do is make sure the function that handles the click
//TODO: this doesnt make sense, is part of the sentance missing?

Channels can be retrieved from the EventHub:

```js
var channel = eventHub.channel( 'user' );
```
//TODO: should this be `this.eventHub` so it suggests it should be inside of the class definition?

Events are triggered on the Channel:

```js
channel.trigger( 'user-selected', { userId} );
```
//TODO: should this be `{ userId: "userId" }`?

#### Hints

No hints here. Any questions, please ask.

## Testing Features

*Before we start, you need to copy the contents of `aliases.xml` from the Workbench
into `messages/tests/test-unit/js-test-driver/resources/aliases.xml`.*

In the services overview we talked about how using MVVM and Services allows us to
test full features in isolation. In this part of the exercise we're going to do
exactly that.

Create a new file called `MessagesFeatureTest.js` in `messages/tests/test-unit/js-test-driver/tests/`
and update it to look as follows:

```js
'use strict';

require( 'jasmine' );

var MessagesViewModel = require( 'modularapp/chat/messages/MessagesViewModel');
var ServiceRegistry = require( 'br/ServiceRegistry' );
var chatService = ServiceRegistry.getService( 'chat.service' );

describe( 'The Messages', function() {

} );

```
//TODO: an example test would be useful here (like with the input blade tests tutorial)

*Note: You could call this file MessagesSpecTest.js*.

The first thing to notice is that we're using Jasmine, and specifcially we're using
[Jasmine 1.3](http://jasmine.github.io/1.3/introduction.html) as it ships with BRJS.

From there, you'll see we've required the `MessagesViewModel` and we have a reference to
the Chat Service via `chatService`. Now we need to write at least two tests:

//TODO: this isnt obvious whether it is something I should continue on my own or continue reading and follow. I started writing it myself and upon reading it again it looks like I should follow and copy/paste

1. Create an instance of the `MessagesViewModel`, interact with it, and ensure that
it results in the expected service interactions.
2. Force the Chat Service to interact with the View Model and then verify the View Model state.

This way we're testing how UI interacts result in service interactions and how
service events are reflected in UI state.

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

#### Hints

No hints here. Any questions, please ask.

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
