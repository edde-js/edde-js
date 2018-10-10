import test from 'ava';
import {ObjectMap} from "./object-map";

test('ObjectMap: Each', test => {
	const array: any[] = [];
	new ObjectMap({'a1': 'a', 'b2': 'b', 'c3': 'c'}).each((k, v) => array.push(k) && array.push(v));
	test.deepEqual(array, ['a1', 'a', 'b2', 'b', 'c3', 'c']);
});
test('ObjectMap: Each Cancel', test => {
	test.true(new ObjectMap({'a1': 'a'}).each(() => false).cancelled, 'loop has not been cancelled!');
});
