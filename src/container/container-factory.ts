import {Container} from "./container";
import {Make} from "./make";
import {EventBus, EventManager} from "../event";
import {Runtime} from "../runtime";
import {HistoryService} from "../history";
import {ViewManager} from "../view";
import {Application} from "../application";
import {TemplateManager} from "../template";
import {ReactorManager} from "../reactor";
import {UuidGenerator} from "../crypto";
import {CollectionMessageService, MessageBus, MessagePortal, StateMessageService} from "../message";
import {StatesMessageService} from "../message/states-message-service";

/**
 * Creates container with common services used in edde-js.
 */
export class ContainerFactory {
	public static container(): Container {
		return this.registerServices(new Container());
	}

	/**
	 * create a container with all edde-js common services registered (supposes web browser runtime). Also all listener services are
	 * created
	 */
	public static create(): Container {
		const container = this.container();
		this.setupHistoryService(container);
		return container;
	}

	public static setupHistoryService(container: Container): void {
		container.create(HistoryService);
	}

	/**
	 * just populates container with default services without side effects
	 *
	 * @param container
	 */
	public static registerServices(container: Container): Container {
		return container
			.register(Container, Make.instance(container))
			.register(Application, Make.service(Application))
			.register(EventManager, Make.service(EventManager))
			.register(EventBus, Make.singleton(container => {
				return container.create<EventManager>(EventManager).scope('global');
			}))
			.register(HistoryService, Make.subscriber(HistoryService))
			.register(ViewManager, Make.subscriber(ViewManager))
			.register(TemplateManager, Make.service(TemplateManager))
			.register(ReactorManager, Make.service(ReactorManager))
			.register(UuidGenerator, Make.service(UuidGenerator))
			.register(MessageBus, Make.service(MessageBus))
			.register(MessagePortal, Make.service(MessagePortal))
			.register(StateMessageService, Make.service(StateMessageService))
			.register(CollectionMessageService, Make.service(CollectionMessageService))
			.register(StatesMessageService, Make.service(StatesMessageService))
			.register(Runtime, Make.singleton(() => {
				return new Runtime(window);
			}))
	}
}
