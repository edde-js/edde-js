import test from "ava";
import {ContainerFactory} from "../container";
import {React, StateManager} from "../state";
import {Component} from "./component";
import {ToString} from "../utils";

@ToString('some-component')
class SomeComponent extends Component {
	public react: string;

	@React('foo')
	public reactFoo(value: string) {
		this.react = value;
	}
}

test('Component: Subscribe', test => {
	const container = ContainerFactory.container();
	const stateManager = container.create<StateManager>(StateManager);
	const component = container.autowire(new SomeComponent());
	component.register(stateManager.state(SomeComponent));
	stateManager.patch({
		[<any>SomeComponent]: {
			'foo': 'yep!'
		},
	});
	test.is(component.react, 'yep!');
});
