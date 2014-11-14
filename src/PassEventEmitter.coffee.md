# PassEventEmitter class
Extends the Node.js built-in [EventEmitter class](http://nodejs.org/api/events.html).

	{EventEmitter} = require 'events'

	class exports.PassEventEmitter extends EventEmitter

## Storage for static routes
See `PassEventEmitter.pass()`

		@_PEE_routes = {}

## Global PassEventEmitter
For those who need a big static instance.

		global = null

		@getGlobal: () ->
			global ?= new PassEventEmitter()
			return global

## Constructor
Creates the delegates if any static route was defined.

		constructor: () ->
			super()

			routes = PassEventEmitter._PEE_routes[@constructor]
			if routes
				for own name, targets of routes
					PassEventEmitter._PEE_doPass func: (name, target) =>
						@on name, (e) -> target.emit name, e
					, name, targets

## Delayed shortcuts
When you need to emit your event a bit later.

		emitLater: (name, args...) ->
			args.unshift null if args.length < 2
			setTimeout (=> @emit name, args[0]), args[1]

		emitEvery: (name, args...) ->
			args.unshift null if args.length < 2
			setInterval (=> @emit name, args[0]), args[1]

## Delegate factory
Possible calls:
- `.pass('e', pee)`
- `.pass('e1 e2', pee)`
- `.pass('e1, e2', pee)`
- `.pass(['e1', 'e2'], pee)`
- `.pass('e', pee1, pee2)`
- `.pass('e', [pee1, pee2])`
- `.pass({'e1': pee1, 'e2': pee2})`

Of course combinations can also be used:
- `.pass(['e1', 'e2'], [pee1, pee2])`
- `.pass({'e1, e2': [pee1, pee2], 'e3 e4': [pee3, pee4]})`

		pass: (names, targets...) ->
			if names is Object(names) and not Array.isArray names
				@pass name, t for own name, t of names
				return
			PassEventEmitter._PEE_doPass func: (name, target) =>
				@on name, (e) -> target.emit name, e
			, names, targets
			return

## Static helper
Unfortunately cannot make it private, but prefix makes it hard to shadow it.

		@_PEE_doPass: (action, names, targets) ->
			return if targets.length is 0
			# sanitize input
			args = names: names, targets: []
			args.names = names.split /\s|,/g unless Array.isArray names
			args.targets = args.targets.concat t for t in targets
			for name in args.names when name isnt ''
				for target in args.targets when target?.on?
					do (name, target) => action.func name, target, action.meta
			return

## Static delegate factory
Possible calls:
- `.pass(MyClass, 'e', pee)` Registers a route.
- `.pass('e', pee)` Event `e` on the global emitter is passed to `pee`.

Registered class routes are used when a new instance of `MyClass` is created.

*eventNames* and *targets* parameters can be used the same way as in instance `pass`.

		@pass: (args...) ->
			return if args.length < 2 # global
			if typeof args[0] is 'string'
				[sourceType, names, targets] = [null, args[0], args[1...]]
			else
				[sourceType, names, targets] = [args[0], args[1], args[2...]]
			unless sourceType?
				PassEventEmitter._PEE_doPass func: (name, target) =>
					PassEventEmitter.getGlobal().on name, (e) -> target.emit name, e
				, names, targets
				return
			PassEventEmitter._PEE_doPass
				func: (name, target, sourceType) =>
					PassEventEmitter._PEE_routes[sourceType] ?= {}
					PassEventEmitter._PEE_routes[sourceType][name] ?= []
					PassEventEmitter._PEE_routes[sourceType][name].push target
				meta: sourceType
			, names, targets

## Cleanup
Since routes hold references to target emitters, you have to clean up them before gc can forget them.

		@removeAllRoutes: () ->
			PassEventEmitter._PEE_routes = {}
