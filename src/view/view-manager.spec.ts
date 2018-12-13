import test from "ava";
import {ContainerFactory, Make} from "../container";
import {ViewManager} from "./view-manager";
import {EventBus} from "../event";
import {DeadRouteEvent, MountViewEvent, RefreshViewEvent, UmountViewEvent} from "./events";
import {AbstractView} from "./view";
import {GetString, ToString} from "../utils";
import {IView} from "./types";
import {Runtime} from "../runtime";
import {JSDOM} from "jsdom";
import {TemplateManager} from "../template";
import {Html} from "../dom";

@ToString('boo')
class SomeView extends AbstractView {
	public canHandle(path: string): boolean {
		return path === '/path';
	}
}

@ToString('bar')
class SomeSomeView extends AbstractView {
	public canHandle(path: string): boolean {
		return path === '/some-some';
	}
}

test('ViewManager: Common Events', test => {
	const container = ContainerFactory.container();
	const viewManager = container.create<ViewManager>(ViewManager);
	const eventBus = container.create<EventBus>(EventBus);
	const templateManager = container.create<TemplateManager>(TemplateManager);
	container.register(Runtime, function () {
		return this.instance || (this.instance = new Runtime(new JSDOM('<body><div class="bardel is-hidden" data-template="bar"></div><div class="prdel is-hidden" data-template="boo"></div><main></main></body>').window));
	});
	const runtime = container.create<Runtime>(Runtime);
	templateManager.bind(runtime.html());
	container.register(SomeView, Make.service(SomeView));
	container.register(SomeSomeView, Make.service(SomeSomeView));
	viewManager.register(SomeView);
	viewManager.register(SomeSomeView);
	let deadEvent = null;
	let routedView = null;
	let routedPath = null;
	let refresh = null;
	let umount = null;
	eventBus.listener(DeadRouteEvent).add((event: DeadRouteEvent) => {
		deadEvent = event.getPath();
	});
	eventBus.listener(MountViewEvent).add((event: MountViewEvent) => {
		routedView = event.getView();
		routedPath = event.getPath();
	});
	eventBus.listener(RefreshViewEvent).add((event: RefreshViewEvent) => {
		refresh = event.getView();
	});
	eventBus.listener(UmountViewEvent).add((event: UmountViewEvent) => {
		umount = event.getView();
	});
	viewManager.routeTo('nope');
	test.is(deadEvent, 'nope');
	const view = viewManager.routeTo('/path');
	test.is(routedView, view);
	test.is(routedPath, '/path');
	test.truthy(view);
	test.is(view, viewManager.routeTo('/path'));
	test.is(refresh, view);
	test.is(GetString(<IView>view), 'boo');
	test.truthy((<any>view).root);
	test.truthy((<any>view).root.getElement().parentElement);
	test.is(runtime.require('main').getElement(), runtime.require('main').getElement());
	test.is((<Html>(<any>view).root).getElement().outerHTML, '<div class="prdel"></div>');
	test.is(runtime.require('body').getElement().outerHTML, '<body><main><div class="prdel"></div></main></body>');
	test.truthy(viewManager.routeTo('/some-some'));
	test.is(umount, view);
});
test('View: Types', test => {
	test.false(IView.canHandle('/'));
	test.truthy(IView.mount());
	test.truthy(IView.umount());
});
