import test from "ava";
import {Runtime} from "./runtime";
import {ToString} from "../utils";
import {JSDOM} from "jsdom";

test('Runtime: Common', test => {
	const runtime = new Runtime(<any>{document: true});
	test.is(ToString(runtime), 'edde-js/runtime/runtime');
	test.true(runtime.getDocument());
});
test('Runtime: Require', test => {
	const runtime = new Runtime(new JSDOM('<body><div class="prdel"></div></body>').window);
	const element = runtime.require('.prdel');
	test.truthy(element);
	test.true(element.hasClass('prdel'));
	test.throws(() => runtime.require('.nope'), error => error.message === 'Cannot get any element by selector [.nope] in global context.');
});
test('Runtime: GetSessionStorage/GetLocalStorage', test => {
	const runtime = new Runtime(new JSDOM().window);
	test.throws(() => runtime.getSessionStorage());
	test.throws(() => runtime.getLocalStorage());
});
test('Runtime: El', test => {
	const runtime = new Runtime(new JSDOM().window);
	const html = '<div class="prdel"><span>pyca</span></div>';
	test.is(runtime.el(html).export(), html);
});
test('Runtime: GetWindow', test => {
	const window = new JSDOM().window;
	const runtime = new Runtime(window);
	test.is(window, runtime.getWindow());
});
test('Runtime: CreateDocumentFragment', test => {
	const runtime = new Runtime(new JSDOM().window);
	test.truthy(runtime.createDocumentFragment());
});
test('Runtime: GetPath', test => {
	const runtime = new Runtime(new JSDOM().window);
	test.is(runtime.getPath(), 'blank');
});
test('Runtime: Selector', test => {
	const runtime = new Runtime(new JSDOM('<body><div class="prdel"></div></body>').window);
	test.truthy(runtime.selector('.prdel'));
	test.falsy(runtime.selector('.yep'));
});
test('Runtime: Html', test => {
	const runtime = new Runtime(new JSDOM().window);
	test.is(runtime.html(), runtime.html());
});
