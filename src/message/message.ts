import {HashMap} from "../collection";

export class Message {
	protected type: string;
	protected target: string | null;
	protected attrs: {} | null;

	public constructor(type: string, target: string | null = null, attrs: {} | null = null) {
		this.type = type;
		this.target = target || null;
		this.attrs = attrs || null;
	}

	public getType(): string {
		return this.type;
	}

	public hasTarget(): boolean {
		return !!this.target;
	}

	public getTarget(): string | null {
		return this.target;
	}

	public getAttrs(): HashMap<any> {
		return new HashMap(this.attrs);
	}

	public export(): Object {
		return {
			type: this.type,
			target: this.target,
			attrs: this.attrs,
		};
	}
}
