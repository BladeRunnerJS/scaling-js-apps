# User Service

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

---

## More User Service Details

### setCurrentUser( user )

#### Definition

```js
/**
 * Sets the active user for the current application session.
 *
 * @param {userservice.User} user The to set as the current user.
 */
UserService.prototype.setCurrentUser = function( user ) {
};
```

#### Example

```
var userService = ServiceRegistry.getService( 'user.service' );
userService.setCurrentUser( { userId: 'some-user-id' } );
```

### getCurrentUser( listener )

#### Definition

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

#### Example

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

### getUsers( listener )

#### Definition

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

#### Example

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

### getUser( userId, listener )

#### Definition

```js
/**
 * Get the current user of the application.
 *
 * @param {userservice.GetUserListener} listener
 */
UserService.prototype.getUser = function( userId, listener ) {
};
```

#### Example

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
