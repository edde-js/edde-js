import test from "ava";
import {ContainerFactory} from "../container";
import {ViewManager} from "./view-manager";
import {EventBus} from "../event";
import {DeadRouteEvent} from "./events";

test('ViewManager: Common Events', test => {
	const container = ContainerFactory.container();
	const viewManager = container.create<ViewManager>(ViewManager);
	const eventBus = container.create<EventBus>(EventBus);
	let deadEvent = null;
	eventBus.listener(DeadRouteEvent).add((event: DeadRouteEvent) => {
		deadEvent = event.getPath();
	});
	viewManager.routeTo('nope');
	test.is(deadEvent, 'nope');
});
