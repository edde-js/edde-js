import test from "ava";
import {Container} from "./container";
import {Make} from "./make";
import {Inject} from "./inject";
import {GetString} from "../utils";

class DependencyService {
	public static toString() {
		return 'dependency-service';
	}
}

class AnotherDependencyService {
	public static toString() {
		return 'another-dependency-service';
	}
}

class Another2DependencyService {
	public static toString() {
		return 'another2-dependency-service';
	}
}

class TestService {
	@Inject(DependencyService)
	public dependency: DependencyService;
	public foo = false;

	public static toString() {
		return 'test-service';
	}

	public init(): void {
		this.foo = true;
	}
}

class TeTestService extends TestService {
	@Inject(AnotherDependencyService)
	public anotherDependency: AnotherDependencyService;
	@Inject(Another2DependencyService)
	public another2Dependency: Another2DependencyService;
	@Inject(Container)
	public container: Container;

	public static toString() {
		return 'te-test-service';
	}
}

test('Container: Common', test => {
	const container = new Container();
	container
		.register(TestService, Make.service(TestService))
		.register(DependencyService, Make.service(DependencyService))
		.register(AnotherDependencyService, Make.service(AnotherDependencyService))
		.register(Another2DependencyService, Make.service(Another2DependencyService))
		.register(TeTestService, Make.service(TeTestService))
		.register(Container, Make.instance(container));
	const service = container.create<TestService>(TestService);
	test.is(Container.toString(), 'edde-js/container/container');
	test.is(container.create(Container), container);
	test.deepEqual(container.create(TestService), container.create(TestService));
	test.deepEqual(container.create(TeTestService), container.create(TeTestService));
	test.deepEqual(container.create<TeTestService>(TeTestService).container, container);
	test.true(service.foo);
	test.deepEqual(GetString(service.dependency), 'dependency-service');
	test.deepEqual(GetString(container.create<TeTestService>(TeTestService).anotherDependency), 'another-dependency-service');
	/**
	 * just to heat up code coverage
	 */
	container.autowire(service);
	test.deepEqual(GetString(service.dependency), 'dependency-service');
});
test('Container: Missing Service', test => {
	const container = new Container();
	test.throws(() => container.create(TestService), {message: 'Requested unknown factory [test-service].'});
});
test('Container: Factory Exception', test => {
	const container = new Container();
	container
		.register(TestService, Make.service(TestService))
		.register(DependencyService, () => {
			throw new Error('boom')
		});
	test.throws(() => container.create<TestService>(TestService).dependency, {message: 'boom'}, 'requested dependency did not throw an exception!');
});
