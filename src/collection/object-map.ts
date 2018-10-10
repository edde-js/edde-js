import {HasMapCallback, LoopContext} from "./types";

/**
 * Provides an interesting stuff for iterating over any object; when values are not types,
 * this implementation could be used.
 */
export class ObjectMap {
	protected object: any;

	public constructor(object: {}) {
		this.object = object;
	}

	/**
	 * iterate over internal object
	 *
	 * @param callback
	 */
	public each(callback: HasMapCallback<any>): LoopContext<any> {
		const context: LoopContext<any> = {
			count: -1,
			loop: false,
			item: null,
			value: null,
			key: null,
			cancelled: false,
		};
		for (const key in this.object) {
			context.loop = true;
			context.count++;
			if (callback.call(context, context.key = key, context.value = this.object[key]) === false) {
				context.cancelled = true;
				break;
			}
		}
		return context;
	}
}
