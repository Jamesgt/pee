Just another dead simple event emitter.

	module.exports = class PassEventEmitter

		constructor: () ->
			@events = {}

		on: (name, callback) ->
			return unless callback?
			return if name is ''
			@events[name] ?= []
			@events[name].push callback
			return

		emit: (name, e) ->
			callback e for callback in @events[name] if @events[name]?
			return

		pass: (names, target) ->
			return unless target?
			for name in names.split ' '
				continue if name is ''
				unless Array.isArray target
					do (name, target) => @on name, (e) -> target.emit name, e
					continue
				target.forEach (t) =>
					return unless t?
					do (name, t) => @on name, (e) -> t.emit name, e
			return
