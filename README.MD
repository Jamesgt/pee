# Pee - Pass Event Emitter

Just another dead simple event emitter and some fancy shortcut.

* Emit events delayed.
* Route events.

# API

PassEventEmitter is inherited form [EventEmitter class](http://nodejs.org/api/events.html) so all of its functions are usable.

* Emits the event delayed.
```coffee-script
.emitLater(event, data, timeout)
```

* Emits the event every *timeout* ms.
```coffee-script
.emitEvery(event, data, timeout)
```

using pee | by hand
--------- | -------
`source.emitLater 'event', data, 100` | `do (data) -> setTimeout (source.emit 'event', data), 100`
`source.emitEvery 'event', data, 100` | `do (data) -> setInterval (source.emit 'event', data), 100`

* Registers a delegate which emits the received event to target.
```coffee-script
.pass(events, targets)
```

using pee | by hand
--------- | -------
`source.pass 'event', target` | `source.on 'event', (e) -> target.emit e`
`source.pass 'e1 e2', target` | `source.on 'e1', (e) -> target.emit e` <br/> `source.on 'e2', (e) -> target.emit e`
`source.pass 'e1 e2', t1, t2` <br/> or <br/> `source.pass 'e1 e2', [t1, t2]` | `source.on 'e1', (e) -> t1.emit e` <br/> `source.on 'e2', (e) -> t1.emit e` <br/> `source.on 'e1', (e) -> t2.emit e` <br/> `source.on 'e2', (e) -> t2.emit e`
`source.pass 'e1': t1, 'e2': t2` | `source.on 'e1', (e) -> t1.emit e` <br/> `source.on 'e2', (e) -> t2.emit e`

## Examples

Coffee-script example.

```coffee-script
    {PassEventEmitter} = require 'PassEventEmitter'

    ee1 = new PassEventEmitter()
    ee1.on 'event', (e) -> console.log 'ee1', e
    ee2 = new PassEventEmitter()
    ee2.on 'event', (e) -> console.log 'ee2', e

    ee2.pass 'event', ee1

    ee1.emit 'event'

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

    ee1.emit('event');

    /*
    Output is:
    ee1 data
    ee2 data
    */
```

## License

MIT

dist/PassEventEmitter.browser.min.js is generated with browserify, that uses a package with also an MIT license.
