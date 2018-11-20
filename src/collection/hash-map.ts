import {HasMapCallback, LoopContext} from "./types";

/**
 * Class for simple hash map - basically it's string index/typed value; this
 * class should be used only for consistent hash maps (with same value). For general
 * objects there is another implementation.
 */
export class HashMap<T> {
	protected hashMap: { [index: string]: T };

	public constructor(hashMap: { [index: string]: T } = {}) {
		this.hashMap = hashMap;
	}

	/**
	 * set the given key/value
	 *
	 * @param name
	 * @param value
	 */
	public set(name: string | number, value: T): HashMap<T> {
		this.hashMap[name] = value;
		return this;
	}

	/**
	 * set and return the given value
	 *
	 * @param name
	 * @param value
	 */
	public seti(name: string | number, value: T): T {
		this.set(name, value);
		return value;
	}

	/**
	 * is there explicitly defined value with the given name? It could
	 * be event null/undefined
	 *
	 * @param name
	 */
	public has(name: string): boolean {
		return this.hashMap.hasOwnProperty(name);
	}

	/**
	 * get the requested value or default value
	 *
	 * @param name
	 * @param callback
	 */
	public get(name: string, callback: () => T | null = () => null): T | null {
		return this.has(name) ? this.hashMap[name] : callback();
	}

	/**
	 * ensure the given item exists; parameter is just for simple default
	 * value (internally it's something like has-set combo)
	 *
	 * @param name
	 * @param callback
	 */
	public ensure(name: string, callback: () => T): T {
		let value = this.get(name);
		if (!value) {
			this.set(name, value = callback());
		}
		return value;
	}

	/**
	 * explicitly require a value; if value is set, but undefined/null, this method
	 * throws an exception (error)
	 *
	 * @param name
	 * @param error
	 */
	public require(name: string, error: string | null = null): T {
		const item = this.hashMap[name];
		if (!item) {
			throw new Error(error || `Required element [${name}] is missing in hash map!`);
		}
		return item;
	}

	/**
	 * get the first value (by the each and break)
	 */
	public first(): T | null {
		return this.each(() => false).value;
	}

	/**
	 * get the last value (by the each)
	 */
	public last(): T | null {
		return this.each(() => true).value;
	}

	/**
	 * copy (append) input hash map into current one
	 *
	 * @param copy
	 */
	public copy(copy: HashMap<T>): HashMap<T> {
		copy.each((k, v) => this.set(k, v));
		return this;
	}

	/**
	 * remove an item from hash map
	 *
	 * @param name
	 */
	public remove(name: string): HashMap<T> {
		this.set(name, <any>null);
		delete this.hashMap[name];
		return this;
	}

	/**
	 * loop through hashmap and provide some interesting values during the loop
	 *
	 * @param callback
	 */
	public each(callback: HasMapCallback<T>): LoopContext<T> {
		const context: LoopContext<T> = {
			count: -1,
			loop: false,
			item: null,
			value: null,
			key: null,
			cancelled: false,
		};
		for (const key in this.hashMap) {
			context.loop = true;
			context.count++;
			if (callback.call(context, context.key = key, context.value = this.hashMap[key]) === false) {
				context.cancelled = true;
				break;
			}
		}
		return context;
	}

	/**
	 * return number of items in hash map
	 */
	public getCount(): number {
		return this.each(() => true).count + 1;
	}

	/**
	 * check if a hash map is empty
	 */
	public isEmpty(): boolean {
		return this.getCount() === 0;
	}

	/**
	 * clear internal hash map
	 */
	public clear(): HashMap<T> {
		this.hashMap = {};
		return this;
	}

	/**
	 * return internal hash map representation
	 */
	public toObject(): { [index: string]: T } {
		return this.hashMap;
	}
}
