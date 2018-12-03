import {HashMapKey, HasMapCallback, LoopContext} from "./types";

/**
 * Class for simple hash map - basically it's string index/typed value; this
 * class should be used only for consistent hash maps (with same value). For general
 * objects there is another implementation.
 */
export class HashMap<T> {
	protected hashMap: Map<HashMapKey, T>;

	public constructor(hashMap: { [index: string]: T } = {}) {
		this.hashMap = new Map();
		this.patch(hashMap);
	}

	/**
	 * set the given key/value
	 *
	 * @param name
	 * @param value
	 */
	public set(name: HashMapKey, value: T): HashMap<T> {
		this.hashMap.set(name, value);
		return this;
	}

	/**
	 * set and return the given value
	 *
	 * @param name
	 * @param value
	 */
	public seti(name: HashMapKey, value: T): T {
		this.set(name, value);
		return value;
	}

	/**
	 * is there explicitly defined value with the given name? It could
	 * be event null/undefined
	 *
	 * @param name
	 */
	public has(name: HashMapKey): boolean {
		return this.hashMap.has(name);
	}

	/**
	 * get the requested value or default value
	 *
	 * @param name
	 * @param callback
	 */
	public get(name: HashMapKey, callback: () => T | null = () => null): T | null {
		return this.has(name) ? <T>this.hashMap.get(name) : callback();
	}

	/**
	 * ensure the given item exists; parameter is just for simple default
	 * value (internally it's something like has-set combo)
	 *
	 * @param name
	 * @param callback
	 */
	public ensure(name: HashMapKey, callback: () => T): T {
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
	public require(name: HashMapKey, error: string | null = null): T {
		if (!this.hashMap.has(name)) {
			throw new Error(error || `Required element [${name}] is missing in hash map!`);
		}
		return <T>this.get(name);
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

	public patch(patch: { [index: string]: T }): HashMap<T> {
		for (const key in patch) {
			this.hashMap.set(key, patch[key]);
		}
		return this;
	}

	/**
	 * remove an item from hash map
	 *
	 * @param name
	 */
	public remove(name: HashMapKey): HashMap<T> {
		this.hashMap.delete(name);
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
		this.hashMap.forEach((v, k) => {
			/**
			 * because of some motherfucker out there, foreach cannot be broke out; thus
			 * it's needed to use this shitty construct to loop ALL items, but not call
			 * callback on them
			 */
			if (!context.cancelled) {
				context.loop = true;
				context.count++;
				if (callback.call(context, context.key = k, context.value = v) === false) {
					context.cancelled = true;
				}
			}
		});
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
		this.hashMap.clear();
		return this;
	}

	/**
	 * return internal hash map representation
	 */
	public toObject(): { [index: string]: T } {
		const object: any = {};
		this.each((k, v) => object[k] = v);
		return object;
	}
}
