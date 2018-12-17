import test from "ava";
import {Reactor} from "./reactor";

test('Reactor: Subscribe: Set', test => {
	const reactor = new Reactor('foo');
	let counter = 0;
	reactor.subscribe('foo', () => {
		counter++;
	});
	reactor.subscribe('foo', () => {
		counter++;
	});
	reactor.subscribe('bar', () => {
		counter++;
	});
	reactor.set('foo', 3);
	test.is(counter, 2, 'subscribe has not been called!');
});
test('Reactor: Subscribe: Push', test => {
	const reactor = new Reactor('foo');
	let counter = 0;
	reactor.subscribe('foo', () => {
		counter++;
	});
	reactor.subscribe('foo', () => {
		counter++;
	});
	reactor.subscribe('bar', () => {
		counter++;
	});
	reactor.push({
		'foo': 1,
		'bar': 2,
	});
	test.is(counter, 3, 'subscribe has not been called!');
});
test('Reactor: Update', test => {
	const reactor = new Reactor('foo');
	let counter = 0;
	reactor.push({
		'foo': 1,
		'bar': 2,
	});
	reactor.subscribe('foo', () => {
		counter++;
	});
	reactor.subscribe('foo', () => {
		counter++;
	});
	reactor.subscribe('bar', () => {
		counter++;
	});
	test.is(counter, 0, 'subscribe has been called!');
	reactor.update();
	test.is(counter, 3, 'subscribe has not been called!');
	reactor.update();
	test.is(counter, 3, 'subscribe has been called again!');
});
