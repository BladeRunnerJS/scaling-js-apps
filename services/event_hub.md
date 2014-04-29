# EventHub

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
