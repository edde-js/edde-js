import test from "ava";
import {State} from "./state";

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
test('State: Subscribe/restore', test => {
	const state = new State();
	let counter = 0;
	let restore = false;
	state.set('foo', 'bar');
	state.subscribe('foo', () => {
		counter++;
	});
	state.restore('foo', value => {
		counter++;
		restore = true;
		test.is(value, 'bar');
	});
	test.true(restore);
	test.is(counter, 1, 'subscribe has been called!');
});
