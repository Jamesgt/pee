EventRecorderEventEmitter test helper class.

	{PassEventEmitter} = require '../src/PassEventEmitter.coffee.md'

	class exports.EventRecorderEventEmitter extends PassEventEmitter

Be very careful to feed the ctor with the least expected values.
If `['1', '2', '3']` is given, but only `'1'` and `'2'` arrives it won't run the final check.

		constructor: (@expectedEvents) ->
			super()
			@eventsReceived = []

		done: () ->
			if @eventsReceived.length > @expectedEvents.length
				throw Error 'Received more events than expected.'
			@allDone() if @eventsReceived.length is @expectedEvents.length

		getHandler: (callback) ->
			(e) =>
				@eventsReceived.push e
				callback e
				@done()

		allDone: () ->
			@eventsReceived[i].should.equal event for event, i in @expectedEvents
