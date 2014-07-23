# Configuring Services

Easily swap service implementations:

* When better versions become available
* To interact with different services offering the same functionality
* For different runtimes e.g.
  * Tests
  * Workbenches
  * Aspects

---

## More Details

Services can be configured in two ways; *via code* or *via configuration files*. In
the exercises we're going to use the configuration file option for development.
We'll look at the code-based solution in the Feature Testing section.

Services are also configured based on the runtime scenarios. The three runtime
scenarios are:

* Workbench
* Test
* Aspect

As such, configuration files are present in the resources directories for Workbenches,
Tests and Aspects.

## Next: Workbenches
