import test from 'ava';
import {HashMapCollection} from "./hash-map-collection";
import {Collection} from "./collection";

test('HashMapCollection: Empty HashMap', test => {
	const hashMapCollection = new HashMapCollection<number>();
	test.is(hashMapCollection.toArray('foo').length, 0, 'the array length is not zero');
	test.is(hashMapCollection.toCollection('foo').toArray().length, 0, 'collection -> array length is not zero');
	test.true(hashMapCollection.isEmpty(), 'empty hash map collection is not empty!?');
});
test('HashMapCollection: Adding elements', test => {
	const hashMapCollection = new HashMapCollection<number>();
	hashMapCollection.add('foo', 1);
	hashMapCollection.add('foo', 2);
	hashMapCollection.add('foo', 3);
	test.false(hashMapCollection.isEmpty(), 'not empty hash map collection is still empty!?');
	test.deepEqual(hashMapCollection.toArray('foo'), [1, 2, 3], 'named collection is not equal');
	test.true(hashMapCollection.has('foo'), 'there is an element called "foo"');
	test.false(hashMapCollection.has('moo'), 'there is no element called "moo"');
});
test('HashMapCollection: Iteration', test => {
	const hashMapCollection = new HashMapCollection<number>();
	hashMapCollection.add('foo', 1);
	hashMapCollection.add('foo', 2);
	hashMapCollection.add('foo', 3);
	const collect: number[] = [];
	hashMapCollection.each('foo', item => {
		collect.push(item);
	});
	test.is(collect.length, 3, "the length of eache'd array is good");
	test.deepEqual(collect, [1, 2, 3], "the content of expected eache'd array is good");
});
test('HashMapCollection: Sort', test => {
	const hashMapCollection = new HashMapCollection<any>();
	hashMapCollection.add('foo', {'item': 4});
	hashMapCollection.add('foo', {'item': 12});
	hashMapCollection.add('foo', {'item': 8});
	hashMapCollection.sort('foo', (a, b) => a['item'] - b['item']);
	test.deepEqual(hashMapCollection.toArray('foo'), [
		{'item': 4},
		{'item': 8},
		{'item': 12},
	], 'hash map is sorting properly');
});
test('HashMapCollection: Remove by', test => {
	const hashMapCollection = new HashMapCollection<string>();
	hashMapCollection.add('name', 'string');
	hashMapCollection.add('name', 'another string');
	hashMapCollection.add('mooo', 'string');
	hashMapCollection.removeBy('name', item => item !== 'string');
	test.deepEqual(hashMapCollection.toArray('name'), ['another string']);
});
test('HashMapCollection: Delete by', test => {
	const hashMapCollection = new HashMapCollection<string>();
	hashMapCollection.add('name', 'string');
	hashMapCollection.add('name', 'another string');
	hashMapCollection.add('mooo', 'string');
	hashMapCollection.deleteBy(item => item !== 'string');
	test.deepEqual(hashMapCollection.toArray('name'), ['another string']);
});
test('HashMapCollection: Clear', test => {
	const hashMapCollection = new HashMapCollection<number>();
	test.true(hashMapCollection.isEmpty());
	hashMapCollection.add('foo', 1);
	hashMapCollection.add('foo', 2);
	hashMapCollection.add('foo', 3);
	test.false(hashMapCollection.isEmpty());
	hashMapCollection.clear();
	test.true(hashMapCollection.isEmpty());
});
test('HashMapCollection: Ensure', test => {
	const hashMapCollection = new HashMapCollection<number>();
	hashMapCollection.ensure('foo', () => new Collection<number>().add(1).add(2));
	test.true(hashMapCollection.has('foo'));
	test.deepEqual((<any>hashMapCollection.get('foo')).toArray(), [1, 2]);
	hashMapCollection.add('bar', 1);
	hashMapCollection.ensure('bar');
	hashMapCollection.ensure('car');
	test.true(hashMapCollection.has('bar'));
});
