import {ToString} from "../utils";

@ToString('edde-js/crypto/uuid-generator')
export class UuidGenerator {
	/**
	 * generate uuid v4
	 *
	 * @param glue
	 */
	public uuid4(glue: string = '-'): string {
		let a: any, b: any;
		for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : glue) {
		}
		return b;
	}
}
