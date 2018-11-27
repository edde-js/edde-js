import {State} from "./state";

export type States = { [index: string]: {} };
export type Subscriber = (value: any, state: State) => void;
