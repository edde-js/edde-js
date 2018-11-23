import test from "ava";
import {ContainerFactory} from "../container";
import {Bind, State, StateManager, Subscribe} from "../state";
import {Component} from "./component";
import {ToString} from "../utils";

@ToString('some-component')
class SomeComponent extends Component {
	public status: string;
	public foo: string;

	@Subscribe('foo-value', 'foo')
	public stateFooValue(value: string) {
		this.status = value;
	}

	@Bind('foo')
	public stateFoo(value: string) {
		this.foo = value;
	}
}

test('Component: Subscribe', test => {
	const container = ContainerFactory.container();
	const stateManager = container.create<StateManager>(StateManager);
	const component = container.autowire(new SomeComponent());
	/**
	 * because init() is protected, this hack "unlocks" visibility
	 */
	(<any>component).init();
	let state = stateManager.require('foo');
	state.push({
		'foo-value': 'prdel',
	});
	test.is(component.status, 'prdel');
	component.bind(stateManager.state(SomeComponent));
	stateManager.push({
		[<any>SomeComponent]: {
			'foo': 'whepee!'
		}
	});
	test.is(component.foo, 'whepee!');
	component.foo = 'nope';
	component.push({'foo': 'yahoo!'});
	test.is(component.foo, 'yahoo!');
	state = component.getState();
	component.bind(new State());
	test.is(component.foo, 'yahoo!');
	state.patch({'foo': 'foo!'});
	test.is(component.foo, 'yahoo!');
});
