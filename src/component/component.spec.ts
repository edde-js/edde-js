import test from "ava";
import {ContainerFactory} from "../container";
import {StateManager, Subscribe} from "../state";
import {Component} from "./component";
import {ToString} from "../utils";

@ToString('some-component')
class SomeComponent extends Component {
	public absolute: string;
	public relative: string;
	public foo: string;

	@Subscribe.State('absolute', 'foo')
	public stateAbsolute(value: string) {
		this.absolute = value;
	}

	@Subscribe.To('relative')
	public stateRelative(value: string) {
		this.relative = value;
	}

//	@Local('foo')
	public stateFoo(value: string) {
		this.foo = value;
	}
}

test('Component: Subscribe', test => {
	const container = ContainerFactory.container();
	const stateManager = container.create<StateManager>(StateManager);
	const component = container.autowire(new SomeComponent());
	stateManager.remember(component);
	stateManager.patch({
		[<any>SomeComponent]: {
			'relative': 'yep!'
		},
		'foo': {
			'absolute': 'mwah!'
		}
	});
	test.is(component.relative, 'yep!');
	test.is(component.absolute, 'mwah!');
});
