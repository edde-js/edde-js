import {State} from "./state";

export type States = { [index: string]: State };
export type Subscriber = (value: any, state: State) => void;
