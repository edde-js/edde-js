import {HashMap} from "../collection";

export class Message {
	protected message: HashMap<any>;

	public constructor(message: Object) {
		this.message = new HashMap(message);
	}

	public getService(): string {
		return this.message.require('service');
	}

	public getType(): string {
		return this.message.require('type');
	}

	public getUuid(): string {
		return this.message.require('uuid');
	}

	public getAttrs(): HashMap<any> {
		return this.message.ensure('attrs', () => new HashMap);
	}

	public export(): Object {
		return {
			service: this.getService(),
			type: this.getType(),
			uuid: this.getUuid(),
			attrs: this.getAttrs().toObject()
		};
	}
}
