import test from "ava";
import {Html} from "./html";
import {JSDOM} from "jsdom";

test('Html: Common', test => {
	const native = <HTMLElement>new JSDOM('<div class="bar">').window.document.querySelector('.bar');
	test.truthy(native);
	const element = new Html(native);
	test.true(element.hasClass('bar'));
	test.true(element.addClass('foo').hasClass('foo'));
	test.true(element.addClass('foo').hasClass('foo'));
	test.false(element.toggleClass('foo').hasClass('foo'));
	test.true(element.toggleClass('foo').hasClass('foo'));
	test.true(element.toggleClass('poo', true).hasClass('poo'));
	test.true(element.toggleClass('poo', true).hasClass('poo'));
	test.false(element.toggleClass('foo', false).hasClass('foo'));
	test.false(element.toggleClass('foo', false).hasClass('foo'));
	let click = false;
	element.listenTo('click', () => {
		click = true;
	});
	native.click();
	test.true(click);
});
