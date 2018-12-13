import {Reactor} from "./reactor";

export type Reactors = { [index: string]: Reactor };
export type Subscriber = (value: any, reactor: Reactor) => void;
