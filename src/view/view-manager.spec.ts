import test from "ava";
import {ContainerFactory, Make} from "../container";
import {ViewManager} from "./view-manager";
import {EventBus} from "../event";
import {DeadRouteEvent} from "./events";
import {AbstractView} from "./view";
import {GetString, ToString} from "../utils";
import {IView} from "./types";
import {Runtime} from "../runtime";
import {JSDOM} from "jsdom";
import {TemplateManager} from "../template";

@ToString('boo')
class SomeView extends AbstractView {
	public canHandle(path: string): boolean {
		return path === '/path';
	}
}

test('ViewManager: Common Events', test => {
	const container = ContainerFactory.container();
	const viewManager = container.create<ViewManager>(ViewManager);
	const eventBus = container.create<EventBus>(EventBus);
	const templateManager = container.create<TemplateManager>(TemplateManager);
	container.register(Runtime, function () {
		return new Runtime(new JSDOM('<body><div data-template="boo"></div><main></main></body>').window);
	});
	const runtime = container.create<Runtime>(Runtime);
	templateManager.bind(runtime.html());
	container.register(SomeView, Make.service(SomeView));
	viewManager.register(SomeView);
	let deadEvent = null;
	eventBus.listener(DeadRouteEvent).add((event: DeadRouteEvent) => {
		deadEvent = event.getPath();
	});
	viewManager.routeTo('nope');
	test.is(deadEvent, 'nope');
	const view = viewManager.routeTo('/path');
	test.truthy(view);
	test.is(GetString(<IView>view), 'boo');
});
