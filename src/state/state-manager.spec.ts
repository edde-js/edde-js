import test from "ava";
import {ContainerFactory} from "../container";
import {StateManager} from "./state-manager";

test('StateManager: Container', test => {
	const container = ContainerFactory.container();
	test.is(container.create(StateManager), container.create(StateManager));
});
test('StateManager: State', test => {
	const stateManager = ContainerFactory.container().create<StateManager>(StateManager);
	test.is(stateManager.state('foo'), stateManager.state('foo'));
});
