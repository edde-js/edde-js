import test from "ava";
import {State} from "./state";
import {Subscribe} from "./subscribe";
import {ToString} from "../utils";
import {ContainerFactory} from "../container";
import {StateManager} from "./state-manager";

@ToString('pyca')
class StateObject {
	public hovno: string;

	@Subscribe.To('hovno')
	public stateHovno(value: string) {
		this.hovno = value;
	}
}

test('State: Subscribe', test => {
	const state = new State();
	let counter = 0;
	state.subscribe('foo', () => {
		counter++;
	});
	state.subscribe('foo', () => {
		counter++;
	});
	state.subscribe('bar', () => {
		counter++;
	});
	state.set('foo', 3);
	test.is(counter, 2, 'subscribe has not been called!');
});
test('State: Subscribe', test => {
	const state = new State();
	let counter = 0;
	state.subscribe('foo', () => {
		counter++;
	});
	state.subscribe('foo', () => {
		counter++;
	});
	state.subscribe('bar', () => {
		counter++;
	});
	state.push({
		'foo': 1,
		'bar': 2,
	});
	test.is(counter, 3, 'subscribe has not been called!');
});
test('State: Update', test => {
	const state = new State();
	let counter = 0;
	state.push({
		'foo': 1,
		'bar': 2,
	});
	state.subscribe('foo', () => {
		counter++;
	});
	state.subscribe('foo', () => {
		counter++;
	});
	state.subscribe('bar', () => {
		counter++;
	});
	test.is(counter, 0, 'subscribe has been called!');
	state.update();
	test.is(counter, 3, 'subscribe has not been called!');
	state.update();
	test.is(counter, 3, 'subscribe has been called again!');
});
test('State: Forget', test => {
	const container = ContainerFactory.container();
	const stateManager = container.create<StateManager>(StateManager);
	const object = container.autowire(new StateObject());
	stateManager.remember(object);
	stateManager.state(StateObject).set('hovno', 'smrdi');
	test.is(object.hovno, 'smrdi');
	stateManager.state(StateObject).forget(object);
	stateManager.state(StateObject).set('hovno', 'nesmrdi');
	test.is(object.hovno, 'smrdi');
});
