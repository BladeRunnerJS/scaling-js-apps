# Services

## At a Glance

* Provide access to shared resources e.g.
  * in-app messages system,
  * persistence storage
  * realtime data services
  * anything that interacts with a Web API
* Represent a contract - some would call these interfaces!

---

## More Details

Services provide access to shared resources such as an in-app messages system,
persistence storage, realtime data services or anything that interacts with
a Web API.

Services represent a contract; they expose functions with defined parameters and
return values. Yes, some would call these interfaces!

In large scale applications services are essential. They:

* Allow implementations to be swapped in and out in different environments/scenarios or if a better implementation comes along
* Facilitate testing of features, avoiding IO
* Result in a loosely coupled application architecture
* Enable development to take place when the real implementation isn't ready yet

We've found that they also:

* Enable new types of development tools and workflows
* In conjunction with MVVM they allow Features to be tested End-to-End (UI <-> Service)

Workbenches in particular are a good example of this where you can easily add code to enable
development or even build your own helper tools.
