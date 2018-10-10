import test from "ava";
import {Runtime} from "./runtime";
import {ToString} from "../utils";

test('Runtime: Common', test => {
	const runtime = new Runtime(<any>{document: true});
	test.is(ToString(runtime), 'edde-js/runtime/runtime');
	test.true(runtime.getDocument());
});
