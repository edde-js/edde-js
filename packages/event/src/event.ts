export abstract class AbstractEvent {
	protected cancelled: boolean;

	public constructor() {
		this.cancelled = false;
	}

	public cancel(cancel: boolean = true): AbstractEvent {
		this.cancelled = cancel;
		return this;
	}

	public isCancelled(): boolean {
		return this.cancelled;
	}
}
