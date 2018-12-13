import test from "ava";
import {ContainerFactory} from "../container";
import {ReactorManager} from "./reactor-manager";

test('ReactorManager: Container', test => {
	const container = ContainerFactory.container();
	test.is(container.create(ReactorManager), container.create(ReactorManager));
});
test('ReactorManager: Reactor', test => {
	const reactorManager = ContainerFactory.container().create<ReactorManager>(ReactorManager);
	test.is(reactorManager.reactor('foo'), reactorManager.reactor('foo'));
});
