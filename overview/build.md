# What are We Building?

A chat app...

## Blades

### Chat Messages

* Display a list of the last 20 chat messages
* Display new messages as they are received/sent
* Display the user who has sent the message

### Chat Input

* Input field to allow a user to send a message

### User List View

* Display a list of online users
* Display new users as they come online/join the chat
* Remove users as they go offline/leave the chat
* Trigger a `user-selected` event when additional user information is requested

### User Info Card

* Displays information about user

### Chat Stats

* Most active user
* Number of chat messages
* ...

### Private Chat?

## Services

### Chat Service

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

### User Lookup Service

* getUserInfo( userId ): userInfo

### Data Sync Service?

## Ideas

### Chat Bot Service

### Audio Video Blade

### Mark-up/Markdown formatting Chat Service
