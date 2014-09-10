# Apps & Aspects

How do you take the Blades that you've built and add them to an application? What if you have blades that are focused on providing functionality that is only for certain users or targeted at particular devices? Building applications in the way we've being doing really helps us solve this problems.

Within BRJS we have something called [aspects](http://bladerunnerjs.org/docs/concepts/aspects/). Aspects are application entry points that we can compose out of blades. They're the glue code.

![BladeRunnerJS Aspects example](../img/apps-aspects.png)

We're building ModularApp and you'll noticed the following which will look very similar to the structure you see in blade directories:

* index.html - application entry point
* src - directory for our JavaScript
* themes - skinning and theming
* resources - HTML templates and other resources
* test-* - directories for application tests

So, the next thing we need to do is bring the Blades that we've created into the default entry-point Aspect.
