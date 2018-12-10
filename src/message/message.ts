import {HashMap} from "../collection";

export class Message {
	protected message: HashMap<any>;

	public constructor(message: Object) {
		this.message = new HashMap(message);
	}

	public getType(): string {
		return this.message.get('type');
	}

	public getNamespace(): string {
		return this.message.get('namespace');
	}

	public getAttrs(): HashMap<any> {
		return this.message.ensure('attrs', () => new HashMap);
	}
}
