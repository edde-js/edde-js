import test from "ava";
import {ContainerFactory, Make} from "../container";
import {MessageBus} from "./message-bus";
import {AbstractMessageHandler} from "./message-handler";
import {Message} from "./message";
import {Packet} from "./packet";
import {IMessageHandler} from "./types";
import {ToString} from "../utils";

@ToString('foo.bar.state-message-handler')
class SomeStateHandler extends AbstractMessageHandler {
	public message(message: Message, packet: Packet): IMessageHandler {
		packet.message(this.createMessage('hovno', 'nope', {'foo': 'bar'}));
		return this;
	}
}

test('Message: Unknown service', test => {
	const container = ContainerFactory.container();
	const messageBus = container.create<MessageBus>(MessageBus);
	test.throws(() => {
		messageBus.packet(messageBus.import({
			uuid: '1',
			messages: [
				{
					uuid: '2',
					type: 'state',
					namespace: 'kaboom'
				}
			]
		}));
	}, error => error.message === 'Requested unknown factory [kaboom.state-message-handler].');
});
test('Message: Common', test => {
	const container = ContainerFactory.container()
		.register(SomeStateHandler, Make.service(SomeStateHandler));
	const messageBus = container.create<MessageBus>(MessageBus);
	const response = messageBus.packet(messageBus.import({
		uuid: '1',
		messages: [
			{
				uuid: '2',
				type: 'state',
				namespace: 'foo.bar'
			}
		]
	}));
	test.is(response.messages().getCount(), 1);
	const message = (<Message>response.messages().index(0));
	test.is('hovno', message.getType());
	test.is('nope', message.getNamespace());
	test.deepEqual({'foo': 'bar'}, message.getAttrs().toObject());
});
