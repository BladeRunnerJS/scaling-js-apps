# ServiceRegistry

## At a Glance

* Provide access to a service e.g. the BRJS EventHub

```js
var ServiceRegistry = require( 'br/ServiceRegistry' );
var EventHub = ServiceRegistry.getService( 'br.event-hub' );
```

---

## More Details

Services are accessed via a ServiceRegistry and are identified by a unique string.
For example, a BladeRunnerJS application always has access to an `EventHub` service
(an in-app messaging system). This is accessed via the ServiceRegistry as follows:

```js
var ServiceRegistry = require( 'br/ServiceRegistry' );
var EventHub = ServiceRegistry.getService( 'br.event-hub' );
```

In the upcoming exercises we'll see how to use some pre-defined ModularApp services.

As before, the real services aren't available yet. So, we'll need to use some
fake service implementations to aid development that another team has kindly provided.
