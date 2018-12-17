import {HashMap} from "../collection";
import {EventBus} from "./event-bus";
import {Container, Inject} from "../container";
import {ToString} from "../utils";

@ToString('edde/event/event-manager')
export class EventManager {
	@Inject(Container)
	protected container: Container;
	protected eventBus: HashMap<EventBus>;

	public constructor() {
		this.eventBus = new HashMap();
	}

	public scope(scope: ToString = 'global'): EventBus {
		return this.eventBus.ensure(scope.toString(), () => this.container.autowire(new EventBus()));
	}
}
