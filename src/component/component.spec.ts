import test from "ava";
import {ContainerFactory} from "../container";
import {StateManager, Subscribe} from "../state";
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

//	@Bind('foo')
	public stateFoo(value: string) {
		this.foo = value;
	}
}

test('Component: Subscribe', test => {
	const container = ContainerFactory.container();
	const stateManager = container.create<StateManager>(StateManager);
	const component = container.autowire(new SomeComponent());
});
