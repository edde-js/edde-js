import test from "ava";
import {EventBus} from "./event-bus";
import {AbstractEvent} from "./event";
import {ListenTo} from "./listen-to";
import {ToString} from "../utils";

class FooEvent extends AbstractEvent {
	public value: any;

	public constructor(value: any) {
		super();
		this.value = value;
	}

	public static toString() {
		return 'foo-event';
	}
}

class BarEvent extends AbstractEvent {
	public value: any;

	public constructor(value: any) {
		super();
		this.value = value;
	}

	public static toString() {
		return 'bar-event';
	}
}

class PooEvent extends AbstractEvent {
	public value: any;

	public constructor(value: any) {
		super();
		this.value = value;
	}

	public static toString() {
		return 'poo-event';
	}
}

class FooBarEvent extends AbstractEvent {
	public value: any;

	public constructor(value: any) {
		super();
		this.value = value;
	}

	public static toString() {
		return 'foo-bar-event';
	}
}

class FooBarBarEvent extends AbstractEvent {
	public value: any;

	public constructor(value: any) {
		super();
		this.value = value;
	}

	public static toString() {
		return 'foo-bar-bar-event';
	}
}

class Class_A {
	public events: string[] = [];

	@ListenTo(FooBarEvent)
	public handleAFooBarEvent(event: FooBarEvent) {
		this.events.push(ToString(event));
	}
}

class Class_B extends Class_A {
	@ListenTo(FooEvent)
	public handleBFooEvent(event: FooEvent) {
		this.events.push(ToString(event));
	}
}

class Class_C extends Class_A {
	@ListenTo(BarEvent)
	public handleCBarEvent(event: BarEvent) {
		this.events.push(ToString(event));
	}
}

class Class_D extends Class_C {
	@ListenTo(FooBarBarEvent)
	public handleDFooBarBarEvent(event: FooBarBarEvent) {
		this.events.push(ToString(event));
	}

	@ListenTo(FooBarEvent)
	public handleDFooBar2Event(event: FooBarEvent) {
		this.events.push(ToString(event));
	}

	@ListenTo(PooEvent)
	public handleDPooEvent(event: PooEvent) {
		this.events.push(ToString(event));
	}

	@ListenTo(PooEvent)
	public handleDPoo2Event(event: PooEvent) {
		this.events.push(ToString(event));
	}
}

class NoListener {
}

test('EventBus: Common', test => {
	const eventBus = new EventBus();
	const array: any[] = [];
	const expect = ['bar-event', 'foo-event'];
	test.is(ToString(eventBus), 'edde-js/event/event-bus');
	eventBus.listener(FooEvent).add(event => {
		array.push(ToString(event));
	});
	eventBus.listener(BarEvent).add(event => {
		array.push(ToString(event));
	});
	test.is(ToString(new FooEvent('nope')), 'foo-event');
	test.is(ToString(new BarEvent('nope')), 'bar-event');
	eventBus.event(new BarEvent('blah-blah'));
	eventBus.event(new FooEvent('some-data'));
	test.is(array.length, 2, 'events has not been captured!');
	test.deepEqual(array, expect, 'events are not same!');
});
test('EventBus: Subscribe', test => {
	const eventBus = new EventBus();
	const classB = eventBus.subscribe(new Class_B());
	const classC = eventBus.subscribe(new Class_C());
	const classD = eventBus.subscribe(new Class_D());
	test.is((<any>Class_A.prototype)['::listeners'].length, 1, 'Class_A has wrong amount of listeners!');
	test.is((<any>Class_B.prototype)['::listeners'].length, 2, 'Class_B has wrong amount of listeners!');
	test.is((<any>Class_C.prototype)['::listeners'].length, 2, 'Class_C has wrong amount of listeners!');
	test.is((<any>Class_D.prototype)['::listeners'].length, 6, 'Class_D has wrong amount of listeners!');
	eventBus.subscribe(new NoListener());
	test.is(eventBus.listener(FooEvent).getCount(), 1);
	test.is(eventBus.listener(BarEvent).getCount(), 2);
	test.is(eventBus.listener(FooBarEvent).getCount(), 4);
	test.is(eventBus.listener(FooBarBarEvent).getCount(), 1);
	test.is(eventBus.listener(PooEvent).getCount(), 2);
	eventBus.event(new FooEvent('foo'));
	eventBus.event(new BarEvent('bar'));
	eventBus.event(new FooBarEvent('foo-bar'));
	eventBus.event(new PooEvent('poo-bar'));
	eventBus.event(new FooBarBarEvent('foo-bar-bar'));
	test.is(classB.events.length, 2, 'class has caught wrong amount of events!');
	test.deepEqual(classB.events, [
		'foo-event',
		'foo-bar-event',
	]);
	test.is(classC.events.length, 2, 'class has caught wrong amount of events!');
	test.deepEqual(classC.events, [
		'bar-event',
		'foo-bar-event',
	]);
	test.is(classD.events.length, 6, 'class has caught wrong amount of events!');
	test.deepEqual(classD.events, [
		'bar-event',
		'foo-bar-event',
		'foo-bar-event',
		'poo-event',
		'poo-event',
		'foo-bar-bar-event',
	]);
});
