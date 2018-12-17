import test from "ava";
import {EventBus} from "./event-bus";
import {AbstractEvent} from "./event";
import {ListenTo} from "./listen-to";
import {GetString} from "../utils";
import {ContainerFactory} from "../container";
import {EventManager} from "./event-manager";

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
		this.events.push(GetString(event));
	}
}

class Class_B extends Class_A {
	@ListenTo(FooEvent)
	public handleBFooEvent(event: FooEvent) {
		this.events.push(GetString(event));
	}
}

class Class_C extends Class_A {
	@ListenTo(BarEvent)
	public handleCBarEvent(event: BarEvent) {
		this.events.push(GetString(event));
	}
}

class Class_D extends Class_C {
	@ListenTo(FooBarBarEvent)
	public handleDFooBarBarEvent(event: FooBarBarEvent) {
		this.events.push(GetString(event));
	}

	@ListenTo(FooBarEvent)
	public handleDFooBar2Event(event: FooBarEvent) {
		this.events.push(GetString(event));
	}

	@ListenTo(PooEvent)
	public handleDPooEvent(event: PooEvent) {
		this.events.push(GetString(event));
	}

	@ListenTo(PooEvent)
	public handleDPoo2Event(event: PooEvent) {
		this.events.push(GetString(event));
	}
}

class NoListener {
}

test('EventBus: Same instance', test => {
	const container = ContainerFactory.container();
	test.is(container.create(EventBus), container.create(EventBus));
	test.is(container.create(EventBus), container.create<EventManager>(EventManager).scope('global'));
	test.is(container.create(EventBus), container.create<EventManager>(EventManager).scope());
});
test('EventBus: Common', test => {
	const eventBus = new EventBus();
	const array: any[] = [];
	const expect = ['bar-event', 'foo-event'];
	test.is(GetString(eventBus), 'edde-js/event/event-bus');
	eventBus.listener(FooEvent).add(event => {
		array.push(GetString(event));
	});
	eventBus.listener(BarEvent).add(event => {
		array.push(GetString(event));
	});
	test.is(GetString(new FooEvent('nope')), 'foo-event');
	test.is(GetString(new BarEvent('nope')), 'bar-event');
	eventBus.emit(new BarEvent('blah-blah'));
	eventBus.emit(new FooEvent('some-data'));
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
	eventBus.emit(new FooEvent('foo'));
	eventBus.emit(new BarEvent('bar'));
	eventBus.emit(new FooBarEvent('foo-bar'));
	eventBus.emit(new PooEvent('poo-bar'));
	eventBus.emit(new FooBarBarEvent('foo-bar-bar'));
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
