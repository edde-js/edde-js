import test from "ava";
import {GetString, ToString} from "./to-string";

@ToString('foo')
class Foo {
}

test('ToString: Common', test => {
	test.is(GetString(new Foo), 'foo');
});
