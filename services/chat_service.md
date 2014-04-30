# Chat Service

Retrieved from the `ServiceRegistry` using:

```js
var chatService = ServiceRegistry.getService( 'chat.service' );
```

It allows you to:

* .on( 'new-message', function() { } )
* sendMessage( message )
* getMessages( listener )

You can find the definition of the User Service in:
`modularapp/libs/chatservice/src/ChatService.js`.

*Full details of both services, along with some examples of use,
can be found at the end of this page*

---

## More Chat Service Details

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
