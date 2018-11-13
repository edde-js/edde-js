import {Collection} from "./collection";

export function $<T>(collection: T[]): Collection<T> {
	return new Collection(collection);
}
