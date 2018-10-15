import {Container} from "./container";
import {Make} from "./make";
import {EventBus} from "../event";
import {Runtime} from "../runtime";
import {HistoryService} from "../history";

/**
 * Creates container with common services used in edde-js.
 */
export class ContainerFactory {
	/**
	 * create a container with all edde-js common services registered (supposes web browser runtime). Also all listener services are
	 * created
	 */
	public static client(): Container {
		const container = this.registerClientServices(new Container());
		container.create(HistoryService);
		return container;
	}

	/**
	 * just populates container with default services without side effects
	 *
	 * @param container
	 */
	public static registerClientServices(container: Container): Container {
		return container
			.register(Container, Make.instance(Container))
			.register(EventBus, Make.service(EventBus))
			.register(Runtime, Make.singleton(() => {
				return new Runtime(window);
			}))
			.register(HistoryService, Make.subscriber(HistoryService));
	}
}
