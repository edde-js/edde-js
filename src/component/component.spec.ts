import test from "ava";
import {ContainerFactory} from "../container";
import {React, StateManager} from "../state";
import {Component} from "./component";
import {ToString} from "../utils";

@ToString('some-component')
class SomeComponent extends Component {
	public react: string;
	public bar: string;

	@React('foo')
	public reactFoo(value: string) {
		this.react = value;
	}

	@React('bar', 'bar')
	public reactBar(value: string) {
		this.bar = value;
	}
}

test('Component: Subscribe', test => {
	const container = ContainerFactory.container();
	const stateManager = container.create<StateManager>(StateManager);
	const component = container.autowire(new SomeComponent());
	component.register({
		'_': stateManager.state(SomeComponent),
		'bar': stateManager.state('bar')
	});
	stateManager.patch({
		[<any>SomeComponent]: {
			'foo': 'yep!'
		},
		'bar': {
			'bar': 'yahoo!',
		},
	});
	test.is(component.react, 'yep!');
	test.is(component.bar, 'yahoo!');
});
