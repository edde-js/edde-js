import test from "ava";
import {ToString} from "@edde-js/utils";
import {Runtime} from "./runtime";

test('Runtime: Common', test => {
	const runtime = new Runtime(<any>{document: true});
	test.is(ToString(runtime), 'edde-js/runtime/runtime');
	test.true(runtime.getDocument());
});
