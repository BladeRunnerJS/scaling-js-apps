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

Now that the helper services are in place we can get to work.

## Get the Existing Messages from the Chat Service

##### Hints:

## Display New Messages from the Chat Service

#### Hints

## Broadcast that the User of a Message has been Selected

#### Hints

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

*Note: You could call this file MessagesSpecTest.js*.

The first thing to notice is that we're using Jasmine, and specifcially we're using
[Jasmine 1.3](http://jasmine.github.io/1.3/introduction.html) as it ships with BRJS.

From there, you'll see we've required the `MessagesViewModel` and we have a reference to
the Chat Service via `chatService`. Now we need to write at least two tests:

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
Workbench, is also really useful.

### Testing Feature Service Interactions using Spies


#### Hints


### Testing Feature ViewModel State using a Fake Service

The next thing we want to do is see how services can impact the state of the View Model.

#### Hints


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
