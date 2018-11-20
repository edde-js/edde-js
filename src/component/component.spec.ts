import test from "ava";
import {ContainerFactory} from "../container";
import {StateManager, Subscribe} from "../state";
import {Component} from "./component";

class SomeComponent extends Component {
	public state: string;
	public foo: string;

	@Subscribe('foo-value', 'foo')
	public stateFooValue(value: string) {
		this.state = value;
	}

	@Subscribe('foo')
	public stateFoo(value: string) {
		this.foo = value;
	}

	public static toString() {
		return 'some-component';
	}
}

test('Component: Subscribe', test => {
	const container = ContainerFactory.container();
	const stateManager = container.create<StateManager>(StateManager);
	const component = container.autowire(new SomeComponent());
	component.subscribe();
	const state = stateManager.require('foo');
	state.push({
		'foo-value': 'prdel',
	});
	test.is(component.state, 'prdel');
	stateManager.push([
		{
			name: 'some-component',
			state: {
				'foo': 'whepee!'
			}
		}
	]);
	test.is(component.foo, 'whepee!');
});
