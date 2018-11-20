import {Container} from "./container";
import {Make} from "./make";
import {EventBus} from "../event";
import {Runtime} from "../runtime";
import {HistoryService} from "../history";
import {ViewManager} from "../view/view-manager";
import {Application} from "../application";
import {TemplateManager} from "../template";

/**
 * Creates container with common services used in edde-js.
 */
export class ContainerFactory {
	/**
	 * create a container with all edde-js common services registered (supposes web browser runtime). Also all listener services are
	 * created
	 */
	public static create(): Container {
		const container = this.registerServices(new Container());
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
			.register(EventBus, Make.service(EventBus))
			.register(HistoryService, Make.subscriber(HistoryService))
			.register(ViewManager, Make.subscriber(ViewManager))
			.register(TemplateManager, Make.service(TemplateManager))
			.register(Runtime, Make.singleton(() => {
				return new Runtime(window);
			}))
	}
}
