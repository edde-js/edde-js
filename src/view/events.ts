import {AbstractEvent} from "../event";
import {IView} from "./types";
import {ToString} from "../utils";

/**
 * Sent when there is no view to get the current path.
 */
@ToString('dead-route-event')
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

export abstract class AbstractViewEvent extends AbstractEvent {
	protected view: IView;
	protected path: string;

	public constructor(view: IView, path: string) {
		super();
		this.view = view;
		this.path = path;
	}

	public getView(): IView {
		return this.view;
	}

	public getPath(): string {
		return this.path;
	}
}

@ToString('umount-view-event')
export class UmountViewEvent extends AbstractViewEvent {
}

@ToString('mount-view-event')
export class MountViewEvent extends AbstractViewEvent {
}

@ToString('refresh-view-event')
export class RefreshViewEvent extends AbstractViewEvent {
}
