import test from "ava";
import {ContainerFactory} from "../container";
import {StateManager, Subscribe} from "../state";
import {Component} from "./component";

class SomeComponent extends Component {
	public status: string;
	public foo: string;

	@Subscribe('foo-value', 'foo')
	public stateFooValue(value: string) {
		this.status = value;
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
	component.init();
	const state = stateManager.require('foo');
	state.push({
		'foo-value': 'prdel',
	});
	test.is(component.status, 'prdel');
	stateManager.push([
		{
			name: 'some-component',
			state: {
				'foo': 'whepee!'
			}
		}
	]);
	test.is(component.foo, 'whepee!');
	component.foo = 'nope';
	component.state({'foo': 'yahoo!'});
	test.is(component.foo, 'yahoo!');
});
