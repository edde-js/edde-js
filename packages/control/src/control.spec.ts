import test from "ava";
import {Control} from "./control";

test('Control: Common', test => {
	const control = new Control();
	let render = 0;
	let release = 0;
	control.onRender = function () {
		render++;
	};
	control.onRelease = function () {
		release++;
	};
	control.render();
	control.render();
	control.release();
	control.release();
	test.is(render, 1);
	test.is(release, 1);
});
