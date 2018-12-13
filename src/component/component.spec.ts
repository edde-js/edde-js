import test from "ava";
import {ContainerFactory} from "../container";
import {ReactorManager} from "../reactor";
import {Component} from "./component";
import {ToString} from "../utils";
import {React} from "./react";

@ToString('some-component')
class SomeComponent extends Component {
	public react: string;
	public bar: string;
	public count: number = 0;

	@React('foo')
	public reactFoo(value: string) {
		this.react = value;
	}

	@React('count')
	public reactCount() {
		this.count++;
	}

	@React('bar', 'bar')
	public reactBar(value: string) {
		this.bar = value;
	}
}

test('Component: Subscribe', test => {
	const container = ContainerFactory.container();
	const reactorManager = container.create<ReactorManager>(ReactorManager);
	const component = container.autowire(new SomeComponent());
	component.register({
		'default': reactorManager.reactor(SomeComponent),
		'bar': reactorManager.reactor('bar')
	});
	reactorManager.patch({
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
test('Component: Forget', test => {
	const container = ContainerFactory.container();
	const reactorManager = container.create<ReactorManager>(ReactorManager);
	const component = container.autowire(new SomeComponent());
	component.register({
		'default': reactorManager.reactor(SomeComponent),
	});
	component.register({
		'default': reactorManager.reactor(SomeComponent),
	});
	reactorManager.patch({
		[<any>SomeComponent]: {
			'count': true
		},
	});
	test.is(component.count, 1);
});
