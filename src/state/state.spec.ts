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
test('State: Refresh', test => {
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
	state.refresh();
	test.is(counter, 3, 'subscribe has not been called!');
	state.refresh();
	test.is(counter, 3, 'subscribe has been called again!');
});
