# ModularApp Services

The ModularApp provides two services and has access to a standard BRJS one.

A *User Service* that provides access to users of the chat application and a *Chat
Service* providing chat based functionality.

All BladeRunnerJS apps have access to a standard service called the `EventHub`.
It provides a simple Publish/Subscribe mechanism for in application messaging.

## The EventHub

Retrieved from the `ServiceRegistry` using:

```js
var chatService = ServiceRegistry.getService( 'br.event-hub' );
```

It allows you to:

* channel( 'channel-name').trigger( 'event-name', data )
* channel( 'channel-name' ).on( 'event-name', function() {} )

### Example

```js
// in one Blade...
var eventHub = ServiceRegistry.getService( 'br.event-hub' );
eventHub.channel( 'chat' ).on( 'new-message', function( message ) {
  // do something with the message
} );

// Meanwhile, in another Blade
var eventHub = ServiceRegistry.getService( 'br.event-hub' );
eventHub.channel( 'chat' ).trigger( 'new-message', { text: 'hello world!' } );
```

Also see the [EventHub docs](http://bladerunnerjs.org/docs/concepts/event_hub/)
and it's worth noting that each channel ( accessed via `EventHub.channel( name )`)
is an [emitr](https://github.com/BladeRunnerJS/emitr) so offers more than just `on` and `trigger` functions.

## User Service

Retrieved from the `ServiceRegistry` using:

```js
var userService = ServiceRegistry.getService( 'user.service' );
```

It allows you to:

* setCurrentUser( user )
* getCurrentUser( listener )
* getUsers( listener )
* getUser( userId, listener )

You can find the definition of the User Service in:
`modularapp/libs/userservice/src/UserService.js`.

*Full details of both services, along with some examples of use,
can be found at the end of this page*

## Chat Service

Retrieved from the `ServiceRegistry` using:

```js
var chatService = ServiceRegistry.getService( 'chat.service' );
```

It allows you to:

* setCurrentUser( user )
* getCurrentUser( listener )
* getUsers( listener )
* getUser( userId, listener )
* .on( 'new-message', function() { } )

You can find the definition of the User Service in:
`modularapp/libs/chatservice/src/ChatService.js`.

*Full details of both services, along with some examples of use,
can be found at the end of this page*

## Next: Exercises

Next: try out the service exercises.

## More Service Details

### User Service

#### setCurrentUser( user )

##### Definition

```js
/**
 * Sets the active user for the current application session.
 *
 * @param {userservice.User} user The to set as the current user.
 */
UserService.prototype.setCurrentUser = function( user ) {
};
```

##### Example

```
var userService = ServiceRegistry.getService( 'user.service' );
userService.setCurrentUser( { userId: 'some-user-id' } );
```

#### getCurrentUser( listener )

##### Definition

```js
/**
 * Get the current user of the application.
 *
 * @param {userservice.GetUserListener} listener The listener for the user
 *        retrieval result.
 *
 * @throws {Error} If there is no way to get the current user e.g. the
 * current user has not been set via {@see setCurrentUser}.
 */
UserService.prototype.getCurrentUser = function( listener ) {
};
```

##### Example

```js
var userService = ServiceRegistry.getService( 'user.service' );
userService.getCurrentUser( {
  userRetrieved: function( user ) {
    // success
  },
  userRetrievalFailed: function( code, message ) {
    // failed because: message
  }
} );
```

#### getUsers( listener )

##### Definition

```js
/**
 * Used to listen to users retrieval.
 * @typedef {Object} UserService~GetUsersListener
 * @property {Function} usersRetrived - Users retrieved successfully.
 * @property {Function} usersRetrievalFailed - User retrieval failed.
 */

/**
 * Get the current user of the application.
 *
 * @param {...GetUsersListener} listener
 */
UserService.prototype.getUsers = function( listener ) {
};
```

##### Example

```js
var userService = ServiceRegistry.getService( 'user.service' );
userService.getUsers( {
  usersRetrieved: function( users ) {
    var user;
    for( var userId in users ) {
      user = users[ userId ];
    }
  },
  usersRetrievalFailed: function() {
    // failure
  }
} );
```

#### getUser( userId, listener )

##### Definition

```js
/**
 * Get the current user of the application.
 *
 * @param {userservice.GetUserListener} listener
 */
UserService.prototype.getUser = function( userId, listener ) {
};
```


##### Example

```
var userService = ServiceRegistry.getService( 'user.service' );
userService.getUser( {
  userRetrieved: function( user ) {
    // success
  },
  userRetrievalFailed: function() {
    // failure
  }
} );
```

### Chat Service

#### Event `new-message`

##### Data Payload

```js
{
  userId: string, // the unique ID of the user generating the message
  text: string    // the textual data of the message
  timestamp: Date // the timestamp when the message originated
}
```

##### Example

```js
var chatService = ServiceRegistry.getService( 'chat.service' );
chatService.on( 'new-message', function( msg ) {
  // do something with the message
} );
```

#### sendMessage( { userId: string, text: string, timestamp: Date } );

##### Definition

```js
/**
 * Send a message.
 *
 * @param {ChatMessage} message - The message to send.
 */
ChatService.prototype.sendMessage = function( message ) {};
```

##### Example

```js
var chatService = ServiceRegistry.getService( 'chat.service' );
chatService.sendMessage( { userId: 'some-user-id', text: 'yo!', timestamp: new Date() } );
```

#### getMessages( listener )

##### Definition

```js
/**
 * Used to listen to users retrieval.
 * @typedef {Object} ChatService~GetMessagesListener
 * @property {Function} messagesRetrived - Messages retrieved successfully.
 * @property {Function} messagesRetrievalFailed - Message retrieval failed.
 */

/**
 * Get a list of existing chat messages.
 *
 * @param {GetMessagesListener} listener - The object to be informed of chat message retrieval
 *                            success or failure.
 */
ChatService.prototype.getMessages = function( listener ) {};
```

##### Example

```js
var chatService = ServiceRegistry.getService( 'chat.service' );
chatService.getMessages( {
  messagesRetrieved: function( messages ) {
    messages.forEach( function( msg, index ) {
      // success - each message
    } );
  },
  messageRetrievalFailed: function() {
    // failed
  }
} );
```
