import {ToString} from "../utils";

export type Subscriber = (value: any) => void;
export type SubscribeProperty = {
	state: ToString;
	name: string;
	handler: string
};
export type SubscribeObject = {
	'::subscribers': SubscribeProperty[];
};
export type PushState = { name: string, state: Object };
