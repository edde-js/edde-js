import {CollectionCallback, LoopContext} from "./types";

export class Collection<T> {
	protected collection: T[];

	public constructor(collection: T[] = []) {
		this.collection = collection;
	}

	/**
	 * it's strange, but add a new value to the collection
	 *
	 * @param item
	 */
	public add(item: T): Collection<T> {
		this.collection.push(item);
		return this;
	}

	/**
	 * return first item of the collection
	 */
	public first(): T | null {
		return this.collection.length > 0 ? this.collection[0] : null;
	}

	/**
	 * return last item of the collection
	 */
	public last(): T | null {
		return this.collection.length > 0 ? this.collection[this.collection.length - 1] : null;
	}

	/**
	 * reverse an order of items in current collection; this method mutates **actual** collection!
	 */
	public reverse(): Collection<T> {
		this.collection = this.collection.reverse();
		return this;
	}

	/**
	 * return an item on the given index or default value
	 *
	 * @param index
	 * @param value
	 */
	public index(index: number, value: T | null = null): T | null {
		if (index < 0 || index >= this.collection.length) {
			return value;
		}
		return this.collection[index];
	}

	/**
	 * loop through all items in the collection; this in callback is set to loop object
	 * holding some interesting values during the loop
	 *
	 * @param callback
	 */
	public each(callback: CollectionCallback<T>): LoopContext<T> {
		const context: LoopContext<T> = {
			count: -1,
			loop: false,
			item: null,
			value: null,
			key: null,
			cancelled: false,
		};
		for (context.count = 0; context.count < this.collection.length; context.key = context.count++) {
			context.loop = true;
			if (callback.call(context, context.value = this.collection[context.count], context.count) === false) {
				context.cancelled = true;
				break;
			}
		}
		return context;
	}

	/**
	 * sleach is "sub each" or "sliced each"; returns a new instance of collection based on slice of the
	 * current collection
	 *
	 * @param callback
	 * @param start
	 * @param length
	 */
	public sleach(callback: CollectionCallback<T>, start?: number, length?: number) {
		return this.slice(start, length).each(callback);
	}

	/**
	 * run callback on each item and return an array
	 *
	 * @param callback
	 */
	public collect<U>(callback: (item: T) => U = (item) => <U><unknown>item): Collection<U> {
		const collection = new Collection<U>();
		this.each(item => collection.add(callback(item)));
		return collection;
	}

	/**
	 * slice current collection and return a new one
	 *
	 * @param start
	 * @param length
	 */
	public slice(start?: number, length?: number): Collection<T> {
		/**
		 * variable to eliminate excessive calls for Array.length
		 */
		const collectionLength = this.collection.length;
		start = start || 0;
		length = start + (length || collectionLength);
		const items = [];
		for (let i = start; i < length && i < collectionLength; i++) {
			items.push(this.collection[i]);
		}
		return new Collection<T>(items);
	}

	/**
	 * return clone of an internal array
	 */
	public toArray(): T[] {
		return this.collection.slice(0);
	}

	/**
	 * copy items from the given collection into the current one
	 *
	 * @param copy
	 */
	public copy(copy: Collection<T>): Collection<T> {
		this.collection = this.collection.concat(copy.toArray());
		return this;
	}

	/**
	 * replace internal array by cloned array of the given collection
	 *
	 * @param replace
	 */
	public replace(replace: Collection<T>): Collection<T> {
		this.collection = replace.toArray();
		return this;
	}

	/**
	 * return number of items in a collection
	 */
	public getCount(): number {
		return this.collection.length;
	}

	/**
	 * is a collection empty?
	 */
	public isEmpty(): boolean {
		return this.getCount() === 0;
	}

	/**
	 * clear the collection; creates a new instance of an array internally
	 */
	public clear(): Collection<T> {
		this.collection = [];
		return this;
	}

	/**
	 * remove items by the given callback; when callback returns explicit **false**, item is
	 * ignored (removed); array index is shrinked by removed items
	 *
	 * @param callback
	 * @param name
	 */
	public removeBy(callback: (item: T) => boolean, name?: string): Collection<T> {
		const collection: T[] = [];
		this.each((value: T) => {
			if (callback(value) !== false) {
				collection[collection.length] = value;
			}
		});
		this.collection = collection;
		return this;
	}

	/**
	 * sort the collection by the given sort function
	 *
	 * @param sort
	 */
	public sort(sort?: (alpha: T, beta: T) => number): Collection<T> {
		this.collection = this.collection.sort(sort);
		return this;
	}
}
