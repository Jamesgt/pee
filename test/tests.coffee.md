Tests.

	require 'should'

Tests for PassEventEmitter class.

	describe 'PassEventEmitter', ->
		PassEventEmitter = require '../src/PassEventEmitter.coffee.md'

		class EventRecorderEventEmitter extends PassEventEmitter

			constructor: (@expectedEvents) ->
				super()
				@eventsReceived = []

			done: () ->
				@allDone() if @eventsReceived.length is @expectedEvents.length

			getHandler: (callback) ->
				(e) =>
					@eventsReceived.push e
					callback e
					@done()

			allDone: () ->
				@eventsReceived[i].should.equal event for event, i in @expectedEvents

		describe '#emit(), on()', ->

			it 'should emit and receive an event', ->
				ee = new EventRecorderEventEmitter ['data']

				ee.on 'event', ee.getHandler (e) -> e.should.equal 'data'

				ee.emit 'event', 'data'

		describe '#pass()', ->

			it 'should pass a simple event', ->
				ee1 = new EventRecorderEventEmitter ['data']
				ee2 = new EventRecorderEventEmitter ['data']

				ee1.on 'event', ee1.getHandler (e) -> e.should.equal 'data'
				ee2.on 'event', ee2.getHandler (e) -> e.should.equal 'data'

				ee1.pass 'event', ee2

				ee1.emit 'event', 'data'

			it 'should pass multiple events', ->
				ee1 = new EventRecorderEventEmitter ['data1', 'data2']

				ee1.on 'event1', ee1.getHandler (e) -> e.should.equal 'data1'
				ee1.on 'event2', ee1.getHandler (e) -> e.should.equal 'data2'

				ee2 = new EventRecorderEventEmitter ['data1', 'data2']
				ee2.on 'event1', ee2.getHandler (e) -> e.should.equal 'data1'
				ee2.on 'event2', ee2.getHandler (e) -> e.should.equal 'data2'

				ee1.pass 'event1 event2', ee2

				ee1.emit 'event1', 'data1'
				ee1.emit 'event2', 'data2'

			it 'should pass multiple events to multiple targets', ->
				ee1 = new EventRecorderEventEmitter ['data1', 'data2']
				ee1.on 'event1', ee1.getHandler (e) -> e.should.equal 'data1'
				ee1.on 'event2', ee1.getHandler (e) -> e.should.equal 'data2'

				ee2 = new EventRecorderEventEmitter ['data1', 'data2']
				ee2.on 'event1', ee2.getHandler (e) -> e.should.equal 'data1'
				ee2.on 'event2', ee2.getHandler (e) -> e.should.equal 'data2'

				ee3 = new EventRecorderEventEmitter ['data1', 'data2']
				ee3.on 'event1', ee3.getHandler (e) -> e.should.equal 'data1'
				ee3.on 'event2', ee3.getHandler (e) -> e.should.equal 'data2'

				ee1.pass 'event1 event2', [ee2, ee3]

				ee1.emit 'event1', 'data1'
				ee1.emit 'event2', 'data2'

			describe 'negative tests', ->

				it 'should handle empty or whitespace strings', ->
					ee1 = new PassEventEmitter()
					ee2 = new PassEventEmitter()

					ee1.pass '', ee2
					ee1.pass '  ', ee2

					ee1.events.should.be.empty

					ee1.emit '', 'empty'
					ee1.emit '  ', '2space'

				it 'should handle null targets', ->
					ee1 = new PassEventEmitter()
					ee2 = new PassEventEmitter()

					ee1.pass 'event1', null
					ee1.emit 'event1'

					ee1.pass 'event2', [null, ee2, null]
					ee1.emit 'event2'
