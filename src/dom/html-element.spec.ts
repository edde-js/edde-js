import test from "ava";
import {HtmlElement} from "./html-element";
import {JSDOM} from "jsdom";

test('HtmlElement: Common', test => {
	const native = <HTMLElement>new JSDOM('<div class="bar">').window.document.querySelector('.bar');
	test.truthy(native);
	const element = new HtmlElement(native);
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
	element.native('click', () => {
		click = true;
	});
	native.click();
	test.true(click);
});
