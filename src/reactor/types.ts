import {Reactor} from "./reactor";

export type States = { [index: string]: Reactor };
export type Subscriber = (value: any, state: Reactor) => void;
