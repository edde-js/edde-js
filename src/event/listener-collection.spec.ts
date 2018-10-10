import test from "ava";
import {ListenerCollection} from "./listener-collection";
import {AbstractEvent} from "./event";

class TestEvent extends AbstractEvent {
	public value: number;

	public constructor(value: number) {
		super();
		this.value = value;
	}

	public static toString() {
		return 'test-event';
	}
}

test('ListenerCollection: Event toString', test => {
	test.is(TestEvent.toString(), 'test-event');
});
test('ListenerCollection: Listener Order', test => {
	const listenerCollection = new ListenerCollection<TestEvent>();
	const array: number[] = [];
	const expect = [3, 1, 2];
	listenerCollection
		.add(() => {
			array.push(1);
		}, 2)
		.add(() => {
			array.push(2);
		}, 1)
		.add(() => {
			array.push(3);
		}, 3);
	listenerCollection.event(new TestEvent(0));
	test.is(array.length, 3, 'not all events has been captured');
	test.deepEqual(array, expect, 'order of event is not right ' + JSON.stringify(array));
});
test('ListenerCollection: Listener cancel', test => {
	const listenerCollection = new ListenerCollection<TestEvent>();
	const array: number[] = [];
	const expect = [3, 1];
	listenerCollection
		.add(event => {
			array.push(1);
			event.cancel();
		}, 2)
		.add(() => {
			array.push(2);
		})
		.add(() => {
			array.push(3);
		}, 3);
	listenerCollection.event(new TestEvent(0));
	test.is(array.length, 2, 'incorrect number of events has been captured');
	test.deepEqual(array, expect, 'order of event is not right ' + JSON.stringify(array));
});
test('ListenerCollection: Listener non-cancellable', test => {
	const listenerCollection = new ListenerCollection<TestEvent>();
	const array: number[] = [];
	const expect = [3, 1, 2];
	listenerCollection
		.add(event => {
			array.push(1);
			event.cancel();
		}, 2)
		.add(() => {
			array.push(2);
		}, 1, null, false)
		.add(() => {
			array.push(3);
		}, 3);
	listenerCollection.event(new TestEvent(0));
	test.is(array.length, 3, 'incorrect number of events has been captured');
	test.deepEqual(array, expect, 'order of event is not right ' + JSON.stringify(array));
});
test('ListenerCollection: Listener context', test => {
	const listenerCollection = new ListenerCollection<TestEvent>();
	const array: any[] = [];
	const context = {'foo': 'bar'};
	const expect = [context, context, context];
	listenerCollection
		.add(function () {
			array.push(this);
		}, 2, context)
		.add(function () {
			array.push(this);
		}, null, context)
		.add(function () {
			array.push(this);
		}, 3, context);
	listenerCollection.event(new TestEvent(0));
	test.is(array.length, 3, 'incorrect number of events has been captured');
	test.deepEqual(array, expect, 'context is not working properly');
});
