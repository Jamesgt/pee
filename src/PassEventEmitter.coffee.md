Just another dead simple event emitter and some fancy shortcut.

	{EventEmitter} = require 'events'

	class exports.PassEventEmitter extends EventEmitter

Emits the event delayed.

using pee | by hand
--------- | -------
`source.emitLater 'event', data, 100` | `do (data) -> setTimeout (source.emit 'event', data), 100`
`source.emitEvery 'event', data, 100` | `do (data) -> setInterval (source.emit 'event', data), 100`

		emitLater: (name, args...) ->
			args.unshift null unless args.length < 2
			setTimeout (=> @emit name, args[0]), args[1]

		emitEvery: (name, args...) ->
			args.unshift null unless args.length < 2
			setInterval (=> @emit name, args[0]), args[1]

Registers a delegate: emits the received event to target.

using pee | by hand
--------- | -------
`source.pass 'event', target` | `source.on 'event', (e) -> target.emit e`
`source.pass 'e1 e2', target` | `source.on 'e1', (e) -> target.emit e` <br/> `source.on 'e2', (e) -> target.emit e`
`source.pass 'e1 e2', t1, t2` <br/> or <br/> `source.pass 'e1 e2', [t1, t2]` | `source.on 'e1', (e) -> t1.emit e` <br/> `source.on 'e2', (e) -> t1.emit e` <br/> `source.on 'e1', (e) -> t2.emit e` <br/> `source.on 'e2', (e) -> t2.emit e`
`source.pass 'e1': t1, 'e2': t2` | `source.on 'e1', (e) -> t1.emit e` <br/> `source.on 'e2', (e) -> t2.emit e`

		pass: (names, targets, moreTargets...) ->
			return @pass name, t for own name, t of names if names is Object(names) and not targets?
			return unless targets?
			@pass names, moreTargets if moreTargets.length > 0
			for name in names.split ' ' when name isnt ''
				for target in (if Array.isArray targets then targets else [targets]) when target?.on?
					do (name, target) => @on name, (e) -> target.emit name, e
			return
