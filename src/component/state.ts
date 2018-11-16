import {HashMap} from "../collection";

/**
 * Simple map used to keep component state on one place; that means,
 * component could be rebuild to desired state by using this class.
 */
export class State extends HashMap<any> {
}
