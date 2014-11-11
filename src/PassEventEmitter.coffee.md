Just another dead simple event emitter and some fancy shortcut.

	{EventEmitter} = require 'events'

	class exports.PassEventEmitter extends EventEmitter

		@_PassEventEmitter_routes = {}

		constructor: () ->
			super()

			routes = PassEventEmitter._PassEventEmitter_routes[@constructor]
			if routes
				for own name, targets of routes
					PassEventEmitter._PassEventEmitter_doPass func: (name, target) =>
						@on name, (e) -> target.emit name, e
					, name, targets

		emit: (event, data) ->
			super event, data
			PassEventEmitter.postEmitHook? @.constructor, event, data

		emitLater: (name, args...) ->
			args.unshift null if args.length < 2
			setTimeout (=> @emit name, args[0]), args[1]

		emitEvery: (name, args...) ->
			args.unshift null if args.length < 2
			setInterval (=> @emit name, args[0]), args[1]

		pass: (names, targets...) ->
			if names is Object(names) and not Array.isArray names
				@pass name, t for own name, t of names
				return
			PassEventEmitter._PassEventEmitter_doPass func: (name, target) =>
				@on name, (e) -> target.emit name, e
			, names, targets
			return

		@_PassEventEmitter_doPass: (action, names, targets) ->
			return if targets.length is 0
			# sanitize input
			args = names: names, targets: []
			args.names = names.split /\s|,/g unless Array.isArray names
			args.targets = args.targets.concat t for t in targets
			for name in args.names when name isnt ''
				for target in args.targets when target?.on?
					do (name, target) => action.func name, target, action.meta
			return

		@pass: (sourceType, names, targets...) ->
			PassEventEmitter._PassEventEmitter_doPass
				func: (name, target, sourceType) =>
					PassEventEmitter._PassEventEmitter_routes[sourceType] ?= {}
					PassEventEmitter._PassEventEmitter_routes[sourceType][name] ?= []
					PassEventEmitter._PassEventEmitter_routes[sourceType][name].push target
				meta: sourceType
			, names, targets

		@removeAllRoutes: () ->
			PassEventEmitter._PassEventEmitter_routes = {}
