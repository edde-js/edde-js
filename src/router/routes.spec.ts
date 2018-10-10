import test from "ava";
import {Routes} from "./routes";
import {NoopRouteHandler} from "./route-handler";

test('Routes: NoopRouter', test => {
	const route = Routes.noop();
	test.false(route.match('/'));
	/**
	 * this should not fail by an error (exception)
	 */
	route.handle('/');
	route.handler().setup();
	test.throws(() => route.handler().setup(), Error, 'Route handler is already ready! Do not call setup() method multiple times. Or the God will kill one cute kitten!');
});
test('Routes: StaticRouter', test => {
	const route = Routes.path('/', new NoopRouteHandler());
	test.true(route.match('/'));
	/**
	 * this should not fail by an error (exception)
	 */
	route.handle('/');
	route.handler().setup();
	test.throws(() => route.handler().setup(), Error, 'Route handler is already ready! Do not call setup() method multiple times. Or the God will kill one cute kitten!');
});
