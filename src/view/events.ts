import {AbstractEvent} from "../event";

/**
 * Sent when there is no view to get the current path.
 */
export class DeadRouteEvent extends AbstractEvent {
	protected path: string;

	public constructor(path: string) {
		super();
		this.path = path;
	}

	public getPath(): string {
		return this.path;
	}
}
