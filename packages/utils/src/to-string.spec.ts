import test from "ava";
import {ToString} from "./to-string";

class Foo {
	public static toString() {
		return 'foo';
	}
}

test('ToString: Common', test => {
	test.is(ToString(new Foo), 'foo');
});
