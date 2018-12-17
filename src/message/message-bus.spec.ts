import test from "ava";
import {ContainerFactory, Make} from "../container";
import {MessageBus} from "./message-bus";
import {Message} from "./message";
import {Packet} from "./packet";
import {IMessageService} from "./types";
import {ToString} from "../utils";
import {AbstractMessageService} from "./message-service";

@ToString('foo.bar.some-message-service')
class SomeMessageService extends AbstractMessageService {
	public onStateMessage(message: Message, packet: Packet): IMessageService {
		packet.message(new Message('hovno', 'nope', {'foo': 'bar'}));
		return this;
	}
}

test('Message: Unknown service', test => {
	const container = ContainerFactory.container();
	const messageBus = container.create<MessageBus>(MessageBus);
	test.throws(() => {
		messageBus.packet(messageBus.import({
			messages: [
				{
					type: 'foo',
					target: 'kaboom',
				}
			]
		}));
	}, {message: 'Cannot resolve message service for message type [foo]. Please register one message service of [kaboom, message-bus.foo-message-service, message-bus.common-message-service] to Container.'});
});
test('Message: Common', test => {
	const container = ContainerFactory.container()
		.register(SomeMessageService, Make.service(SomeMessageService));
	const messageBus = container.create<MessageBus>(MessageBus);
	const response = messageBus.packet(messageBus.import({
		messages: [
			{
				type: 'state',
				target: 'foo.bar.some-message-service',
			}
		]
	}));
	test.is(response.messages().getCount(), 1);
	const message = (<Message>response.messages().index(0));
	test.is('hovno', message.getType());
	test.is('nope', message.getTarget());
	test.deepEqual({'foo': 'bar'}, message.getAttrs().toObject());
});
