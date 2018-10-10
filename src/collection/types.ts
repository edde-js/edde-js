/**
 * loop item holding some interesting values over the loop
 */
export type LoopContext<T> = {
	count: number;
	loop: boolean;
	item: any | null;
	value: T | null;
	key: number | string | null;
	cancelled: boolean;
};
/**
 * specific item callback for a collection (array, number indexed)
 */
export type CollectionCallback<T> = (this: LoopContext<T>, value: T, index: number) => any | boolean;
/**
 * specific item callback for a hashmap (string/number indexed, arbitrary value)
 */
export type HasMapCallback<T> = (this: LoopContext<T>, key: string | number, value: T) => any | boolean;
