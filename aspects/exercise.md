# Composing Blades into an Aspect Exercise (15 mins)

## Decide who is going to push

All company teams should do this exercise, but only one of those teams is going to
push their code to github. The other teams can either try to merge that pushed code
to their local version, or discard their version before pulling.

*Now: decide which team within your company is going to be in charge of the Aspect*.

Sorted? Right, now for the exercise for each team.

## Aspect Structure

The structure of an Aspect has some similarities to a Blade. It has:

* `src` for JavaScript
* `themes` for CSS

However, because an Aspect is an entry point for our application it also has
a `index.html`. Within that file you'll see that it references an `App` object.
The definition for this can be found in `default-asepct/src/modularapp`.

## A note on CSS

The default CSS file can be found in `default-asepct/themes/standard/style.css`. It's important
to realise that the styles defined here will also be inherited by the Blades.

If you want to test this out, open the `style.css` file (which already has some
contents contributed by another team) and add:

```css
body {
  background-color: red;
}
```

And load up a workbench for a Blade. You'll see the background colour is red.

When the Aspect is loaded the CSS for it will be loaded first followed by the CSS
for the Blades. So it's possible for the rules in an Aspect to override those in
a Blade. It's also why you should take care when naming your Blade CSS. A good idea
is to have a top level element with a class and then use that to namespace all
your styles e.g.

```css
.chat-input {}

.chat-input .chat-input-message {}

.chat-input .chat-input-button {}
```

The reason I've even prefixed the `message` and `button` with `chat-input` is that
these are reasonably common CSS classes, so I'm being very careful.

## Viewing the Aspect

As with Workbenches, an Aspect is served using the development server. The
default aspect URL for ModularApp is http://localhost:7070/modularapp/

Loading that up will show you a default message that the Aspect has successfully
loaded.

## Adding a Blade to an Aspect

First, delete the default Aspect message from the `index.html` file. Then open up
`App.js`. The `App` class is a class in exactly the same what that all the View Models
that we've created up until this point are. So, we treat it in exactly the same way.

This `App.js` has had a little bit of work done to it already. Another team has
very kindly added `Header` and `Login` Blades to the Aspect - isn't that nice of them!
So, we're going to add the other Blades within the `handleUserLogin` function
(which is unsurprisingly called after a user has logged in).

### Require the Blade Classes

To add a Blade to an Aspect you need to:

1. `require` the Blade View Model definition
2. Create an instance of that View Model
3. Bind the instance to the HTML view template (using a `KnockoutComponent` helper class)
4. Create an element (again using the helper class) and add it to the DOM

Here's how to do it for the Messages Blade.

```js
var InputViewModel = require( 'modularapp/chat/messages/MessagesViewModel' );

App.prototype.handleUserLogin = function( user ) {

  var userService = ServiceRegistry.getService( 'user.service' );
  userService.setCurrentUser( user );

  this.loginEl.classList.add( 'fadeOutUpBig' );

  var self = this;
  setTimeout( function() {
    self.loginEl.style.display = "none";
  }, 300 );

  // Add other Blades here:

  // Create and add Messages Blade
  var messagesViewModel = new MessagesViewModel();
  var messagesComponent =
    new KnockoutComponent( 'modularapp.chat.messages.view-template', messagesViewModel );
  var messagesEl = messagesComponent.getElement();
  document.body.appendChild( messagesEl );

};

```

Simple, huh!

If you do need more help you can check out the [How to Add a Blade to an Aspect docs](http://bladerunnerjs.org/docs/use/add_blade_to_aspect/) and read up more on
[Aspects](http://bladerunnerjs.org/docs/concepts/aspects/).

## Add the other Blades

The order in which you add the Blades is important for layout purposes. You could of
course update the `index.html` file to have some elements that help define the layout
e.g. have `section`s and some CSS that provide a layout guide without adding the
Blades.

But, since we're appending all the elements to `document.body` they should be
added in the following order:

1. Header - *already done in the `App` constructor*
2. Login - *already done in the `App` constructor*
3. Messages - *done, above*
4. Input
5. User Card

Please add the Input and User Card Blades.

## Aspect Complete - The chosen team should push to github

The *chosen team* can now push the updates to

* `git add default-aspect`
* `git commit -m 'updating asepct to contain all Blades'`
* `git pull origin master`
* Fix any merge conflicts - *there shouldn't be any*
* `git push origin master`

## Where next?

If you've completed this really quickly you can:

Take a look at the code for the Login Blade and see how it's used in the Aspect.
This will also give you a sneak-peak at [Services](http://bladerunnerjs.org/docs/concepts/services/).

You could also read up on [Aspects](http://bladerunnerjs.org/docs/concepts/aspects/) or
have a think about the answers to the retrospective questions.
