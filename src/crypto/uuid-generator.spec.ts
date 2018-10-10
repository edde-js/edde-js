import test from "ava";
import {UuidGenerator} from "./uuid-generator";
import {Container, Make} from "../container";

test('UuidGenerator: Uuid v4', test => {
	const uuidGenerator = new UuidGenerator();
	test.is(uuidGenerator.uuid4().length, 36, 'guid length is good');
	test.regex(uuidGenerator.uuid4(), /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/, 'regular expression seems good')
});
test('UuidGenerator: Container', test => {
	const container = new Container();
	container.register(UuidGenerator, Make.service(UuidGenerator));
	test.is(container.create(UuidGenerator), container.create(UuidGenerator));
});
