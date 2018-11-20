export class Strings {
	/**
	 * replace space characters by exact space
	 *
	 * @param string
	 */
	public static unspace(string: string): string {
		return (string.match(/[^\x20\t\r\n\f]+/g) || []).join(' ');
	}

	public static fromKebabCase(string: string): string {
		return string.replace(/-\w/g, _ => _[1].toUpperCase());
	}

	public static split(string: string, delimiter: string = ':'): string[] {
		if (string.indexOf(delimiter) !== -1) {
			return string.split(delimiter, 2);
		}
		return [
			string,
			string,
		];
	}
}
