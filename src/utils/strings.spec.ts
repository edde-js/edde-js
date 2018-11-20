import test from "ava";
import {Strings} from "./strings";

test('Strings: Unispace', test => {
	test.is(Strings.unispace(''), '');
	test.is(Strings.unispace('ab'), 'ab');
	test.is(Strings.unispace('a  b'), 'a b');
});
test('Strings: ToKebabCase', test => {
	test.deepEqual(Strings.toKebabCase('aaa'), 'aaa');
	test.deepEqual(Strings.toKebabCase('a-aa'), 'aAa');
});
test('Strings: Split', test => {
	test.deepEqual(Strings.split('a:b'), ['a', 'b']);
	test.deepEqual(Strings.split('ab'), ['ab', 'ab']);
	test.deepEqual(Strings.split('a|b', '|'), ['a', 'b']);
});
