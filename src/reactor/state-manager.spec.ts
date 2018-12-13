import test from "ava";
import {ContainerFactory} from "../container";
import {StateManager} from "./state-manager";

test('ReactorManager: Container', test => {
	const container = ContainerFactory.container();
	test.is(container.create(StateManager), container.create(StateManager));
});
test('ReactorManager: Reactor', test => {
	const stateManager = ContainerFactory.container().create<StateManager>(StateManager);
	test.is(stateManager.reactor('foo'), stateManager.reactor('foo'));
});
