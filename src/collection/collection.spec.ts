import test from "ava";
import {Collection} from ".";

test('Collection: Common', test => {
	const collection = new Collection<string>();
	test.is(collection.toArray().length, 0, 'empty collection gives an empty array');
	test.is(collection.getCount(), 0, 'collection count is zero');
	test.true(collection.isEmpty(), 'collection is empty');
	collection.add('1');
	collection.add('2');
	collection.add('3');
	test.false(collection.isEmpty(), 'collection is not empty');
	test.is(collection.getCount(), 3, 'count seems to be ok');
	test.is(collection.toArray().length, 3, 'array length sounds good');
	test.deepEqual(collection.toArray(), ['1', '2', '3'], 'array contents is nice');
});
test('Collection: Clear', test => {
	test.true(new Collection<number>([1, 2, 3]).clear().isEmpty(), 'collection is empty');
});
test('Collection: First', test => {
	test.is(new Collection<number>().first(), null, 'first item is null of empty collection');
	test.is(new Collection<number>([3, 2, 1]).first(), 3, 'first item is correct');
});
test('Collection: Last', test => {
	test.is(new Collection<number>().last(), null, 'last item is null of empty collection');
	test.is(new Collection<number>([1, 2, 3]).last(), 3, 'last item is correct');
});
test('Collection: Index', test => {
	test.is(new Collection<number>().index(12), null, 'index out of range is null');
	test.is(new Collection<number>().index(12, 224), 224, 'default value of an index is not returned!');
	test.is(new Collection<number>([1, 2, 3]).index(1), 2, 'index is correct');
});
test('Collection: Cancelled loop', test => {
	test.is(new Collection<number>().each(() => false).cancelled, false, 'cancelled flag has been set (when collection is empty)');
	test.is(new Collection<number>().add(1).each(() => false).cancelled, true, 'cancelled flag has not been set');
});
test('Collection: Reverse', test => {
	test.deepEqual(new Collection<number>([1, 2, 3]).reverse().toArray(), [3, 2, 1], 'reversing is working, yapee!');
});
test('Collection: Cloned Array', test => {
	const collection = new Collection<number>([1, 2]);
	test.true(collection.toArray() !== collection.toArray());
});
test('Collection: Copy', test => {
	const collection = new Collection<string>(['a', 'b', 'c']);
	test.false(collection.isEmpty());
	collection.copy(new Collection<string>(['d', 'e', 'f']));
	test.deepEqual(collection.toArray(), ['a', 'b', 'c', 'd', 'e', 'f']);
});
test('Collection: Replace', test => {
	const collection = new Collection<string>(['a', 'b', 'c']);
	test.false(collection.isEmpty());
	collection.replace(new Collection<string>(['d', 'e', 'f']));
	test.deepEqual(collection.toArray(), ['d', 'e', 'f'], 'replace is working properly');
});
test('Collection: Simple Iteration', test => {
	const collection = new Collection<number>([1, 2, 3, 4]);
	const current: number[] = [];
	const expect = [1, 2, 3, 4];
	collection.each((value: number) => {
		current.push(value);
	});
	test.deepEqual(current, expect, 'iteration seems good');
});
test('Collection: Sub collection', test => {
	test.deepEqual(new Collection<string>(['a', 'b', 'c', 'd']).slice(2, 2).toArray(), ['c', 'd'], 'subEach collection I is working properly');
	test.deepEqual(new Collection<string>(['a', 'b', 'c', 'd']).slice(2).toArray(), ['c', 'd'], 'subEach collection II is working properly');
	test.deepEqual(new Collection<string>(['a', 'b', 'c', 'd']).slice(0, 2).toArray(), ['a', 'b'], 'subEach collection III is working properly');
	test.deepEqual(new Collection<string>(['a', 'b', 'c', 'd']).slice(0).toArray(), ['a', 'b', 'c', 'd'], 'subEach collection IV is working properly');
	test.deepEqual(new Collection<string>(['a', 'b', 'c', 'd']).slice(10).toArray(), [], 'subEach collection V is working properly');
});
test('Collection: Sub each', test => {
	const array: string[] = [];
	new Collection<string>(['a', 'b', 'c', 'd']).sleach(item => array.push(item), 2, 2);
	test.deepEqual(array, ['c', 'd'], 'subEach collection I is working properly');
});
