export class Strings {
	/**
	 * replace space characters by exact space
	 *
	 * @param string
	 */
	public static unspace(string: string): string {
		return (string.match(/[^\x20\t\r\n\f]+/g) || []).join(' ');
	}
}
