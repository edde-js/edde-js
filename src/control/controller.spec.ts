import test from "ava";
import {Controller} from "./controller";

test('Controller: Common', test => {
	const controller = new Controller();
	let render = 0;
	let release = 0;
	controller.onRender = function () {
		render++;
	};
	controller.onRelease = function () {
		release++;
	};
	controller.render();
	controller.render();
	controller.release();
	controller.release();
	test.is(render, 1);
	test.is(release, 1);
});
