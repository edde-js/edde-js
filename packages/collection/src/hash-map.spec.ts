import test from 'ava';
import {HashMap} from "./hash-map";

test('HashMap: Common', test => {
	const hashMap = new HashMap<string>();
	test.true(hashMap.isEmpty(), 'hash map is empty');
	hashMap.set('foo', 'muhaha');
	hashMap.set('bar', 'blah');
	test.false(hashMap.isEmpty(), 'hash map is not empty');
	test.true(hashMap.has('foo'), 'hash map has a foo value');
	test.true(hashMap.has('bar'), 'hash map has a bar value');
	test.false(hashMap.has('blah'), 'blah is not present in hash map');
	test.is(hashMap.get('foo'), 'muhaha', 'the value of foo matches');
	test.is(hashMap.get('bar'), 'blah', 'the value of bar matches');
});
test('HashMap: Count', test => {
	const hashMap = new HashMap<string>();
	hashMap.set('foo', 'muhaha');
	hashMap.set('bar', 'blah');
	test.is(hashMap.getCount(), 2, 'hash map is counting properly');
	hashMap.set('foobar', 'blah');
	test.is(hashMap.getCount(), 3, 'updated hash map is counting properly')
});
test('HashMap: Count II', test => {
	const hashMap = new HashMap<string>();
	hashMap.set('foo', 'muhaha');
	hashMap.set('bar', 'blah');
	hashMap.remove('bar');
	test.false(hashMap.has('bar'), 'bar was removed from hashMap');
	hashMap.set('foobar', 'blah');
	test.is(hashMap.getCount(), 2, 'updated hash map is counting properly')
});
test('HashMap: Clear', test => {
	test.true(new HashMap<number>({'a': 1, 'b': 2}).clear().isEmpty(), 'clear is working :)');
});
test('HashMap: Is empty', test => {
	test.true(new HashMap<string>().isEmpty());
	test.false(new HashMap<number>({'1': 1, '2': 2}).isEmpty());
});
test('HashMap: Copy', test => {
	const hashMap = new HashMap<string>();
	hashMap.set('foo', 'FOO');
	hashMap.set('bar', 'BAR');
	hashMap.copy(new HashMap<string>({
		'FOO': 'foo',
		'BAR': 'bar',
	}));
	test.deepEqual(hashMap.toObject(), <any>{
		'foo': 'FOO',
		'bar': 'BAR',
		'FOO': 'foo',
		'BAR': 'bar',
	});
});
test('HashMap: Replace', test => {
	const hashMap = new HashMap<string>();
	hashMap.set('foo', 'FOO');
	hashMap.set('bar', 'BAR');
	hashMap.replace(new HashMap<string>({
		'FOO': 'foo',
		'BAR': 'bar',
	}));
	test.deepEqual(hashMap.toObject(), <any>{
		'FOO': 'foo',
		'BAR': 'bar',
	});
});
test('HashMap: First item', test => {
	const hashMap = new HashMap<string>({
		'abc': 'abc',
		'def': 'def',
		'ghi': 'ghi',
	});
	test.is(hashMap.first(), 'abc');
});
test('HashMap: Last item', test => {
	const hashMap = new HashMap<string>({
		'abc': 'abc',
		'def': 'def',
		'ghi': 'ghi',
	});
	test.is(hashMap.last(), 'ghi');
});
test('HashMap: Get default', test => {
	const hashMap = new HashMap<string | undefined | boolean>({
		'abc': false,
		'def': undefined,
	});
	test.is(hashMap.get('abc', () => 'prd'), <any>false, 'falsey value is not respected');
	test.is(hashMap.get('def', () => 'prd'), <any>undefined, 'falsey value is not respected');
});
test('HashMap: Require', test => {
	test.deepEqual(new HashMap().set('foo', 'yep').require('foo'), 'yep', 'require did not returned expected value');
});
test('HashMap: Require error', test => {
	test.throws(() => new HashMap().require('nope'), Error, 'Required element [nope] is missing in hash map!');
});
