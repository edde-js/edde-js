import test from "ava";
import {Router} from "./router";
import {Route404Event, RouteChangeEvent, RouteDoneEvent, RouteRefreshEvent} from "./events";
import {PathRoute, Routes} from "./routes";
import {NoopRouteHandler} from "./route-handler";
import {Container, Make} from "../container";
import {EventBus} from "../event";
import {ToString} from "../utils";

test.beforeEach(test => {
	const container = new Container();
	container
		.register(EventBus, Make.service(EventBus))
		.register(Router, Make.service(Router));
	test.context = container;
});
test('Router: Common', test => {
	const container = <Container>test.context;
	const eventBus = <EventBus>container.create(EventBus);
	const router = <Router>container.create(Router);
	test.plan(1);
	eventBus.listener(Route404Event).add(() => test.true(true));
	router.run('nope');
});
test('Router: Setup setup error', test => {
	const container = <Container>test.context;
	const router = <Router>container.create(Router);
	router.setup();
	test.throws(() => router.setup(), Error, 'Router is already ready! Do not call setup() method multiple times. It is not nice from you!');
});
test('Router: Events', test => {
	const container = <Container>test.context;
	const eventBus = <EventBus>container.create(EventBus);
	const router = <Router>container.create(Router);
	router.register(Routes.path('/bar', new NoopRouteHandler()));
	router.register(Routes.path('/foo-bar', new NoopRouteHandler()));
	router.setup();
	const array: any[] = [];
	const expect = [
		'edde-js/router/route-change-event',
		'edde-js/router/route-done-event',
		'edde-js/router/route-refresh-event',
		'edde-js/router/route-done-event',
		'edde-js/router/route-404-event',
	];
	eventBus.listener(RouteRefreshEvent).add(event => array.push(ToString(event)));
	eventBus.listener(RouteChangeEvent).add((event: RouteChangeEvent) => {
		array.push(ToString(event));
		test.is(event.getPath(), '/foo-bar');
		test.true(event.getRoute() instanceof PathRoute);
	});
	eventBus.listener(RouteDoneEvent).add((event: RouteDoneEvent) => {
		array.push(ToString(event));
		test.is(event.getPath(), '/foo-bar');
		test.true(event.getRoute() instanceof PathRoute);
	});
	eventBus.listener(Route404Event).add((event: Route404Event) => {
		array.push(ToString(event));
		test.is(event.getPath(), '/nope');
	});
	router.run('/foo-bar');
	router.run('/foo-bar');
	router.run('/nope');
	test.is(array.length, 5, 'not all events has been sent!');
	test.deepEqual(array, expect, 'events has not been sent in the right order');
});
