# ModularApp Services

## Chat Service

* getUsers(): Array:String Of User IDs
* `user-joined`: userId
* `user-left`: userId
* sendMessage( message )
* getMessages(): Array:Message
* `new-message`: message

#### Message

* text: String
* userId: String
* timestamp: Date

### User Service

* getUserInfo( userId ): userInfo

# Configuring Services

Services can be configured in two ways; via code or via configuration files. In
the exercises we're doing to use the configuration file option for development.
We'll look at the code-based solution in the Feature Testing section.

Services are also configured based on the runtime scenarios. The three runtime
scenarios are:

* Workbench
* Test
* Aspect

As such, configuration files are present in the resources directories for Workbenches,
Tests and Aspects.

## Next: Exercises
