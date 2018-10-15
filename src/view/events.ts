import {AbstractEvent} from "../event";
import {IView} from "./types";

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

export class UmountViewEvent extends AbstractViewEvent {
}

export class MountViewEvent extends AbstractViewEvent {
}

export class RefreshViewEvent extends AbstractViewEvent {
}
