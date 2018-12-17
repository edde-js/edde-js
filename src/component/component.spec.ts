import test from "ava";
import {ContainerFactory, Make} from "../container";
import {ReactorManager} from "../reactor";
import {Component} from "./component";
import {ToString} from "../utils";
import {React} from "./react";
import {TemplateManager} from "../template";
import {Runtime} from "../runtime";
import {JSDOM} from "jsdom";
import {Html} from "../dom";
import {ScopedEvent} from "./scoped-event";
import {AbstractEvent} from "../event";

@ToString('initial-event')
class InitialScopedEvent extends AbstractEvent {
}

@ToString('another-scoped-event')
class AnotherScopedEvent extends AbstractEvent {
}

@ToString('some-component')
class SomeComponent extends Component {
	public react: string;
	public bar: string;
	public count: number = 0;
	public someElement: Html;
	public scopedEvent: number = 0;

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

	@ScopedEvent('skoup-nejm', AnotherScopedEvent)
	public someScopedEvent() {
		this.scopedEvent++;
	}
}

@ToString('another-component')
class AnotherComponent extends Component {
	@ScopedEvent('foo', InitialScopedEvent)
	public someInitialEvent() {
		this.scope('skoup-nejm').emit(new AnotherScopedEvent());
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
test('Component: Parent', test => {
	const container = ContainerFactory.container();
	const component = container.autowire(new SomeComponent());
	test.is(component, component.root());
});
test('Component: Render', test => {
	const container = ContainerFactory.container();
	container.register(Runtime, function () {
		return this.instance || (this.instance = new Runtime(new JSDOM('<body><div class="yapee" data-template="some-component"><span data-bind="some-element">foo</span></div></body>').window));
	});
	const templateManager = container.create<TemplateManager>(TemplateManager);
	templateManager.bind(container.create<Runtime>(Runtime).html());
	const component: SomeComponent = container.autowire(new SomeComponent());
	test.is('<div class="yapee"><span>foo</span></div>', component.render().getElement().outerHTML);
	test.truthy(component.someElement, 'element is not bound!');
	test.is('<span>foo</span>', component.someElement.getElement().outerHTML);
});
test('Component: Scope', test => {
	const container = ContainerFactory.container();
	container.register(AnotherComponent, Make.classOf(AnotherComponent));
	container.register(Runtime, function () {
		return this.instance || (this.instance = new Runtime(new JSDOM(`
			<body>
				<div class="yahoo" data-template="another-component"><span>not so much important stuff here!</span></div>
				<div class="yapee" data-template="some-component"><span data-bind="some-element">foo</span><div data-component="another-component"></div></div>
			</body>
		`).window));
	});
	const templateManager = container.create<TemplateManager>(TemplateManager);
	templateManager.bind(container.create<Runtime>(Runtime).html());
	const component: SomeComponent = container.autowire(new SomeComponent());
	test.is('<div class="yapee"><span>foo</span><div class="yahoo"><span>not so much important stuff here!</span></div></div>', component.render().getElement().outerHTML);
});
