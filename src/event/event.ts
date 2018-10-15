import {IEvent} from "./types";

export abstract class AbstractEvent implements IEvent {
	protected cancelled: boolean;

	protected constructor() {
		this.cancelled = false;
	}

	public cancel(cancel: boolean = true): IEvent {
		this.cancelled = cancel;
		return this;
	}

	public isCancelled(): boolean {
		return this.cancelled;
	}
}
