import {Collection, HashMap, CollectionCallback, LoopContext} from ".";

/**
 * Class intended to be used when one key could have multiple values (for example
 * event handlers)
 */
export class HashMapCollection<T> {
	protected hashMap: HashMap<Collection<T>>;

	public constructor() {
		this.hashMap = new HashMap<Collection<T>>();
	}

	/**
	 * add a new item under the given key to the collection
	 *
	 * @param name
	 * @param item
	 */
	public add(name: string, item: T): HashMapCollection<T> {
		this.hashMap.ensure(name, () => new Collection<T>()).add(item);
		return this;
	}

	/**
	 * is the given hashmap collection available?
	 *
	 * @param name
	 */
	public has(name: string): boolean {
		return this.hashMap.has(name);
	}

	/**
	 * get collection of the given name or default value
	 *
	 * @param name
	 * @param callback
	 */
	public get(name: string, callback: () => Collection<T> | null = () => null): Collection<T> | null {
		return this.hashMap.get(name, callback);
	}

	/**
	 * ensure that collection with the given name exists
	 *
	 * @param name
	 * @param callback
	 */
	public ensure(name: string, callback: () => Collection<T> = () => new Collection()): Collection<T> {
		let value = this.get(name);
		if (!value) {
			this.hashMap.set(name, value = callback());
		}
		return value;
	}

	/**
	 * clear the collection; internal hashmap is not changed
	 */
	public clear(): HashMapCollection<T> {
		this.hashMap.clear();
		return this;
	}

	/**
	 * remove items by the given callback; runs through all items in all collections in this
	 * hashmap
	 *
	 * @param callback
	 */
	public deleteBy(callback: (item: T) => boolean): HashMapCollection<T> {
		this.hashMap.each((_: any, item: Collection<T>) => item.removeBy(callback));
		return this;
	}

	/**
	 * remove item by a callback from the given collection
	 *
	 * @param name
	 * @param callback
	 */
	public removeBy(name: string, callback: (item: T) => boolean): HashMapCollection<T> {
		this.toCollection(name).removeBy(callback);
		return this;
	}

	/**
	 * is hashmap empty?
	 */
	public isEmpty(): boolean {
		return this.hashMap.isEmpty();
	}

	/**
	 * return a collection of the given name
	 *
	 * @param name
	 */
	public toCollection(name: string): Collection<T> {
		return <Collection<T>>this.hashMap.get(name, () => new Collection());
	}

	/**
	 * return an array of the given element name
	 *
	 * @param name
	 */
	public toArray(name: string): T[] {
		return this.toCollection(name).toArray();
	}

	/**
	 * run a loop over the given named collection
	 *
	 * @param name
	 * @param callback
	 */
	public each(name: string, callback: CollectionCallback<T>): LoopContext<T> {
		return this.toCollection(name).each(callback);
	}

	/**
	 * sort a collection of the given name
	 *
	 * @param name
	 * @param sort
	 */
	public sort(name: string, sort?: (alpha: T, beta: T) => number): HashMapCollection<T> {
		this.toCollection(name).sort(sort);
		return this;
	}
}
