import test from "ava";
import {Container} from "./container";
import {Make} from "./make";
import {Inject} from "./inject";
import {ToString} from "../utils";

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

	public static toString() {
		return 'te-test-service';
	}
}

test('Container: Common', test => {
	const container = new Container();
	container
		.factory(TestService, Make.service(TestService))
		.factory(DependencyService, Make.service(DependencyService))
		.factory(AnotherDependencyService, Make.service(AnotherDependencyService))
		.factory(Another2DependencyService, Make.service(Another2DependencyService))
		.factory(TeTestService, Make.service(TeTestService))
		.factory(Container, Make.instance(container));
	const service = container.create<TestService>(TestService);
	test.is(container.create(Container), container);
	test.deepEqual(container.create(TestService), container.create(TestService));
	test.deepEqual(container.create(TeTestService), container.create(TeTestService));
	test.true(service.foo);
	test.deepEqual(ToString(service.dependency), 'dependency-service');
	test.deepEqual(ToString(container.create<TeTestService>(TeTestService).anotherDependency), 'another-dependency-service');
	/**
	 * just to heat up code coverage
	 */
	container.autowire(service);
	test.deepEqual(ToString(service.dependency), 'dependency-service');
});
test('Container: Missing Service', test => {
	const container = new Container();
	test.throws(() => container.create(TestService), Error, 'requested service did not throw an exception');
});
test('Container: Factory Exception', test => {
	const container = new Container();
	container
		.factory(TestService, Make.service(TestService))
		.factory(DependencyService, () => {
			throw new Error('boom')
		});
	test.throws(() => container.create<TestService>(TestService).dependency, Error, 'requested dependency did not throw an exception!');
});
