# Pee - Pass Event Emitter

Just another dead simple Event Emitter with some routing infrastructure.

## Motivation

Lets assume that in the current scope you have two EE instances and neither have reference to the other. If you want to keep this but want to send event from one to the other then `pass` comes handy.

```coffee-script
->
  @a = new ClassA() # class ClassA extends PassEventEmitter
  @b = new ClassB() # class ClassB extends EventEmitter
  @c = new ClassC() # class ClassC extends EventEmitter

  @b.on 'event1', (e) -> console.log 'b event1 ' + e
  @b.on 'event2', (e) -> console.log 'b event2 ' + e
  @c.on 'event1', (e) -> console.log 'c event1 ' + e
  @c.on 'event2', (e) -> console.log 'c event2 ' + e

  @a.pass 'event1 event2', @b, @c

  @a.emit 'event1', '1'
  @a.emit 'event2', '2'
```

Outputs

```
b event1 1
c event1 1
b event2 2
c event2 2
```

Nothing fancy, it just registers four `on` listeners for `a` with all events listed in the first argument and these re-`emit` the event to all the other arguments, so simple delegation happens here.

Other convinient features:

* on `null` or empty string it does nothing
* when a target is `null` it is simply skipped

## License

MIT
