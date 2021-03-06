# Pee - Pass Event Emitter

Event emitter with some fancy shortcut.

* Emit events delayed.
* Route events.

## Examples

Coffee-script example.

```coffee-script
    {PassEventEmitter} = require 'PassEventEmitter'

    ee1 = new PassEventEmitter()
    ee1.on 'event', (e) -> console.log 'ee1', e
    ee2 = new PassEventEmitter()
    ee2.on 'event', (e) -> console.log 'ee2', e

    ee2.pass 'event', ee1

    ee1.emit 'event', 'data'

    ###
    Output is:
    ee1 data
    ee2 data
    ###
```

Javascript example.

```javascript
    PassEventEmitter = require('PassEventEmitter').PassEventEmitter;

    ee1 = new PassEventEmitter();
    ee1.on('event', function (e) { console.log('ee1', e); });
    ee2 = new PassEventEmitter();
    ee2.on('event', function (e) { console.log('ee2', e); });

    ee2.pass('event', ee1);

    ee1.emit('event', 'data');

    /*
    Output is:
    ee1 data
    ee2 data
    */
```

# API

PassEventEmitter is inherited form [EventEmitter class](http://nodejs.org/api/events.html) so all of its functions are usable.

## .emitLater(event, data, timeout)

```coffee-script
.emitLater(event, data, timeout)
```

Emits the event delayed.

using pee | by hand
--------- | -------
`source.emitLater 'event', data, 100` | `do (data) -> setTimeout (source.emit 'event', data), 100`

## .emitEvery(event, data, timeout)

```coffee-script
.emitEvery(event, data, timeout)
```

Emits the event every *timeout* ms.

using pee | by hand
--------- | -------
`source.emitEvery 'event', data, 100` | `do (data) -> setInterval (source.emit 'event', data), 100`

## .pass(events, targets)

```coffee-script
.pass(events, targets)
```

Registers a delegate which emits the received event to target.

using pee | by hand
--------- | -------
`source.pass 'event', target` | `source.on 'event', (e) -> target.emit e`
`source.pass 'e1 e2', target` | `source.on 'e1', (e) -> target.emit e` <br/> `source.on 'e2', (e) -> target.emit e`
`source.pass 'e1 e2', t1, t2` <br/> or <br/> `source.pass 'e1 e2', [t1, t2]` | `source.on 'e1', (e) -> t1.emit e` <br/> `source.on 'e2', (e) -> t1.emit e` <br/> `source.on 'e1', (e) -> t2.emit e` <br/> `source.on 'e2', (e) -> t2.emit e`
`source.pass 'e1': t1, 'e2': t2` | `source.on 'e1', (e) -> t1.emit e` <br/> `source.on 'e2', (e) -> t2.emit e`

## *static* PassEventEmitter.getGlobal()

```coffee-script
PassEventEmitter.getGlobal() # Static call
```

Returns a global PassEventEmitter instance.

## *static* PassEventEmitter.pass(class, events, targets)

```coffee-script
PassEventEmitter.pass(class, events, targets) # Static call
```

If class is given, then it registers a route for a delegate which emits the received event to target. The route is created when an instance of class is created.

*Note:* If class is not given it passes the event to the global emitter. Same as `PassEventEmitter.getGlobal().pass('e', pee)`.

**using pee**
```coffee-script
class ClassA extends PassEventEmitter
target = new PassEventEmitter()
target.on 'event', (e) -> console.log 'target.event', e

PassEventEmitter.pass ClassA, 'event', target

new ClassA().emit 'event', 'a1'
new ClassA().emit 'event', 'a2'
new ClassA().emit 'event', 'a3'

PassEventEmitter.removeAllRoutes() # to avoid leak

###
Outputs
target.event a1
target.event a2
target.event a3
###
```

**by hand**
```coffee-script
class ClassA extends EventEmitter
target = new EventEmitter()
target.on 'event', (e) -> console.log 'target.event', e

pass = (e) -> target.emit 'event', e

a1 = new ClassA()
a1.on 'event', pass
a1.emit 'event', 'a1'
a2 = new ClassA()
a2.on 'event', pass
a2.emit 'event', 'a2'
a3 = new ClassA()
a3.on 'event', pass
a3.emit 'event', 'a3'

###
Outputs
target.event a1
target.event a2
target.event a3
###
```

## License

MIT

dist/PassEventEmitter.browser.min.js is generated with browserify, that uses a package with also an MIT license.
