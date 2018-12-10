import {HashMap} from "../collection";

export class Message {
	protected message: HashMap<any>;

	public constructor(message: Object) {
		this.message = new HashMap(message);
	}

	public getType(): string {
		return this.message.require('type');
	}

	public getNamespace(): string {
		return this.message.require('namespace');
	}

	public getUuid(): string {
		return this.message.require('uuid');
	}

	public getAttrs(): HashMap<any> {
		return this.message.ensure('attrs', () => new HashMap);
	}

	public export(): Object {
		return {
			type: this.getType(),
			namespace: this.getNamespace(),
			uuid: this.getUuid(),
			attrs: this.getAttrs().toObject()
		};
	}
}
