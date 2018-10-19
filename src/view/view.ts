import {IView} from "./types";
import {Component} from "../component";

export abstract class AbstractView extends Component implements IView {
	public abstract canHandle(path: string): boolean;
}
