Node tests.

	should = require('chai').should()

Tests for PassEventEmitter class.

	describe 'PassEventEmitter', ->
		{PassEventEmitter} = require '../src/PassEventEmitter.coffee.md'
		{EventRecorderEventEmitter} = require './EventRecorderEventEmitter.coffee.md'

		describe '#emit(), on()', ->

			it 'should emit and receive an event', ->
				'data'.should.equal 'data'
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

				ee1.listeners('event').length.should.equal 2
				ee2.listeners('event').length.should.equal 1

				ee1.emit 'event', 'data'

				ee1.eventsReceived.length.should.equal 1
				ee2.eventsReceived.length.should.equal 1

			it 'should pass multiple events', ->
				['event1 event2', 'event1,event2', ['event1','event2']].forEach (events) ->
					ee1 = new EventRecorderEventEmitter ['data1', 'data2']

					ee1.on 'event1', ee1.getHandler (e) -> e.should.equal 'data1'
					ee1.on 'event2', ee1.getHandler (e) -> e.should.equal 'data2'

					ee2 = new EventRecorderEventEmitter ['data1', 'data2']
					ee2.on 'event1', ee2.getHandler (e) -> e.should.equal 'data1'
					ee2.on 'event2', ee2.getHandler (e) -> e.should.equal 'data2'

					ee1.pass events, ee2

					ee1.listeners('event1').length.should.equal 2
					ee1.listeners('event2').length.should.equal 2
					ee2.listeners('event1').length.should.equal 1
					ee2.listeners('event2').length.should.equal 1

					ee1.emit 'event1', 'data1'
					ee1.emit 'event2', 'data2'

					ee2.eventsReceived.length.should.equal 2
					ee2.eventsReceived.length.should.equal 2

			it 'should pass multiple events to multiple targets', ->
				[yes, no].forEach (split) ->
					ee1 = new EventRecorderEventEmitter ['data1', 'data2']
					ee1.on 'event1', ee1.getHandler (e) -> e.should.equal 'data1'
					ee1.on 'event2', ee1.getHandler (e) -> e.should.equal 'data2'

					ee2 = new EventRecorderEventEmitter ['data1', 'data2']
					ee2.on 'event1', ee2.getHandler (e) -> e.should.equal 'data1'
					ee2.on 'event2', ee2.getHandler (e) -> e.should.equal 'data2'

					ee3 = new EventRecorderEventEmitter ['data1', 'data2']
					ee3.on 'event1', ee3.getHandler (e) -> e.should.equal 'data1'
					ee3.on 'event2', ee3.getHandler (e) -> e.should.equal 'data2'

					if split
						ee1.pass 'event1 event2', ee2, ee3
					else
						ee1.pass 'event1 event2', [ee2, ee3]

					ee1.listeners('event1').length.should.equal 3
					ee1.listeners('event2').length.should.equal 3
					ee2.listeners('event1').length.should.equal 1
					ee2.listeners('event2').length.should.equal 1
					ee3.listeners('event1').length.should.equal 1
					ee3.listeners('event2').length.should.equal 1

					ee1.emit 'event1', 'data1'
					ee1.emit 'event2', 'data2'

					ee1.eventsReceived.length.should.equal 2
					ee2.eventsReceived.length.should.equal 2
					ee3.eventsReceived.length.should.equal 2

			it 'should handle first object param', ->
				ee1 = new EventRecorderEventEmitter ['data1', 'data2']
				ee1.on 'event1', ee1.getHandler (e) -> e.should.equal 'data1'
				ee1.on 'event2', ee1.getHandler (e) -> e.should.equal 'data2'

				ee2 = new EventRecorderEventEmitter ['data1']
				ee2.on 'event1', ee2.getHandler (e) -> e.should.equal 'data1'
				ee2.on 'event2', ee2.getHandler (e) -> e.should.equal 'data2'

				ee3 = new EventRecorderEventEmitter ['data2']
				ee3.on 'event1', ee3.getHandler (e) -> e.should.equal 'data1'
				ee3.on 'event2', ee3.getHandler (e) -> e.should.equal 'data2'

				ee1.pass
					'event1': ee2
					'event2': ee3

				ee1.listeners('event1').length.should.equal 2
				ee1.listeners('event2').length.should.equal 2
				ee2.listeners('event1').length.should.equal 1
				ee2.listeners('event2').length.should.equal 1
				ee3.listeners('event1').length.should.equal 1
				ee3.listeners('event2').length.should.equal 1

				ee1.emit 'event1', 'data1'
				ee1.emit 'event2', 'data2'

				ee1.eventsReceived.length.should.equal 2
				ee2.eventsReceived.length.should.equal 1
				ee3.eventsReceived.length.should.equal 1

			describe 'negative tests', ->

				it 'should not add listener for empty and pure whitespace string', ->
					ee1 = new PassEventEmitter()
					ee2 = new PassEventEmitter()

					ee1.pass '', ee2
					ee1.pass '  ', ee2

					ee1.listeners('').length.should.equal 0
					ee1.listeners(' ').length.should.equal 0
					ee1.listeners('  ').length.should.equal 0

					ee1.emit '', 'empty'
					ee1.emit '  ', '2space'

				it 'should handle null targets', ->
					ee1 = new PassEventEmitter()
					ee2 = new PassEventEmitter()

					ee1.pass 'event1', null

					ee1.listeners('event1').length.should.equal 0

					ee1.emit 'event1'

					ee1.pass 'event2', [null, ee2, null]

					ee1.listeners('event2').length.should.equal 1

					ee1.emit 'event2'

				it 'should handle not EE targets', ->
					fakeEE = {}
					ee = new PassEventEmitter()

					ee.pass 'event', fakeEE

					ee.listeners('event').length.should.equal 0

					ee.emit 'event'

		describe '#static pass()', ->

			it 'should pass a simple event to any instance of given type', ->
				ee = new EventRecorderEventEmitter ['data']
				ee.on 'event', ee.getHandler (e) -> e.should.equal 'data'

				class Test extends PassEventEmitter

				PassEventEmitter.pass Test, 'event', ee

				test1 = new Test()

				test1.listeners('event').length.should.equal 1

				test1.emit 'event', 'data'

				ee.eventsReceived.length.should.equal 1

				PassEventEmitter.removeAllRoutes()

				test2 = new Test()

				test2.listeners('event').length.should.equal 0

				test2.emit 'event', 'data'

				ee.eventsReceived.length.should.equal 1 # not changed

			it 'should pass a simple event to the global emitter', ->
				expected = []
				ee = new PassEventEmitter()
				PassEventEmitter.getGlobal().on 'event', (e) =>
					expected.push 'PEE.static'
					e.should.equal 'data'

				class Test extends PassEventEmitter
				Test.getGlobal().on 'event', (e) =>
					expected.push 'Test.static'
					e.should.equal 'data'

				inherited = new Test()
				inherited.on 'event', (e) ->
					expected.push 'inherited'
					e.should.equal 'data'

				Test.pass 'event', inherited

				Test.getGlobal().emit 'event', 'data'

				expected.join(',').should.equal 'PEE.static,Test.static,inherited'
