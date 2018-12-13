import {HashMap} from "../collection";

export class Message {
	protected message: HashMap<any>;

	public constructor(message: Object) {
		this.message = new HashMap(message);
	}

	public getType(): string {
		return this.message.require('type');
	}

	public hasTarget(): boolean {
		return !!this.getTarget();
	}

	public getTarget(): string | null {
		return this.message.get('target') || null;
	}

	public getAttrs(): HashMap<any> {
		return this.message.ensure('attrs', () => new HashMap);
	}

	public export(): Object {
		return {
			type: this.getType(),
			target: this.getTarget(),
			attrs: this.getAttrs().toObject()
		};
	}
}
