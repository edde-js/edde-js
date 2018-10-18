import {IView} from "./types";
import {AbstractControl} from "../control";

export abstract class AbstractView extends AbstractControl implements IView {
	public abstract canHandle(path: string): boolean;
}
