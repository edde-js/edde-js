import {HashMap} from "../collection";
import {Reactor} from "./reactor";
import {ToString} from "../utils";

@ToString('edde-js/reactor/reactor-manager')
export class ReactorManager {
	protected reactors: HashMap<Reactor>;

	public constructor() {
		this.reactors = new HashMap();
	}

	public has(name: ToString): boolean {
		return this.reactors.has(name.toString());
	}

	/**
	 * return a reactor; it does not exist, new one is created and
	 * set under the given name
	 *
	 * @param name
	 */
	public reactor(name: ToString): Reactor {
		return this.reactors.ensure(name.toString(), () => new Reactor(name.toString()));
	}

	public patch(states: Object): ReactorManager {
		new HashMap(<any>states).each((name, state) => this.reactor(name).patch(state));
		return this;
	}

	public update(): ReactorManager {
		this.reactors.each((_, state) => state.update());
		return this;
	}

	/**
	 * export all states (just for read)
	 */
	public export(): { [index: string]: {} } {
		const object: { [index: string]: {} } = {};
		this.reactors.each((name, reactor) => object[name] = reactor.toObject());
		return object;
	}
}
