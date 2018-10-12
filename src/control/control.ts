/**
 * Control is bound to the root html element where it lives. It's controls just
 * subtree of DOM and it cannot have references outside if it's scope.
 */
import {Html} from "../dom";
import {ParentControl} from "./types";

export class Control {
	/**
	 * root html element of this control
	 */
	protected root: Html;
	protected parent: ParentControl;

	public constructor(root: Html, parent: ParentControl = null) {
		this.root = root;
		this.parent = parent;
	}
}
