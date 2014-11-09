# Pee - Pass Event Emitter

Just another dead simple event emitter and some fancy shortcut.

Can emit the event delayed.

using pee | by hand
--------- | -------
`source.emitLater 'event', data, 100` | `do (data) -> setTimeout (source.emit 'event', data), 100`
`source.emitEvery 'event', data, 100` | `do (data) -> setInterval (source.emit 'event', data), 100`

Can register a delegate which emits the received event to target.

using pee | by hand
--------- | -------
`source.pass 'event', target` | `source.on 'event', (e) -> target.emit e`
`source.pass 'e1 e2', target` | `source.on 'e1', (e) -> target.emit e` <br/> `source.on 'e2', (e) -> target.emit e`
`source.pass 'e1 e2', t1, t2` <br/> or <br/> `source.pass 'e1 e2', [t1, t2]` | `source.on 'e1', (e) -> t1.emit e` <br/> `source.on 'e2', (e) -> t1.emit e` <br/> `source.on 'e1', (e) -> t2.emit e` <br/> `source.on 'e2', (e) -> t2.emit e`
`source.pass 'e1': t1, 'e2': t2` | `source.on 'e1', (e) -> t1.emit e` <br/> `source.on 'e2', (e) -> t2.emit e`

## License

MIT

dist/PassEventEmitter.browser.min.js is generated with browserify, that uses a package with also an MIT license.
