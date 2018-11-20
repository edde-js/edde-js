import test from "ava";
import {ContainerFactory} from "../container";
import {StateManager} from "../state";
//class SomeComponent extends Component {
//	public state: string;
//
//	@Subscribe('foo', 'foo-value')
//	public stateFooValue(value: string) {
//		this.state = 'yep!';
//	}
//}
test('Component: Subscribe', test => {
	const container = ContainerFactory.container();
	const stateManager = container.create<StateManager>(StateManager);
//	const component = container.autowire(new SomeComponent());
//	component.subscribe();
//	stateManager.require('foo');
});
