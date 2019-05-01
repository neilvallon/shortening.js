module.exports = function() {
	const MAX_INT = 0x7FFFFFFF;

	function makeTable(cs) {
		const t = new Array(256).fill(0xFF);
		for (var i = 0; i < cs.length; i++) {
			t[cs.charCodeAt(i)] = i;
		}
		return t;
	}

	const CharSet64 = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`;
	const lookupTable = makeTable(CharSet64);

	const min02 = 1 << 6;
	const min03 = (min02 + 1) << 6;
	const min04 = (min03 + 1) << 6;
	const min05 = (min04 + 1) << 6;
	const min06 = (min05 + 1) << 6;
	const minTable = [0, min02, min03, min04, min05, min06];

	function Len(n) {
		const l = Math.floor((32 - Math.clz32(n)) / 6);
		return (minTable[l] <= n)? l+1 : l;
	}

	const splitCharSet64 = CharSet64.split("");
	function Encode(n) {
		if (!Number.isSafeInteger(n) || n < 0 || MAX_INT < n) {
			return undefined;
		}

		const l = Len(n);

		n -= min06;

		var buf = "";
		for (var i = l-1; 0 <= i; i--) {
			buf = splitCharSet64[n&63] + buf;
			n >>= 6;
		}

		return buf;
	}

	function Decode(b) {
		if (b === null || b === undefined) return -1;
		if (minTable.length < b.length || b.length == 0) return -1;

		var n = 0;
		var invalid = 0x00;
		for (var i = 0; i < b.length; i++) {
			const ind = lookupTable[b.charCodeAt(i)&0xFF];
			invalid |= ind;
			n = n<<6 | ind;
		}

		n += minTable[b.length-1]

		if (invalid == 0xFF) return -2;
		if (b.length == minTable.length && (n < 0 || MAX_INT < n)) return -3;

		return n;
	}

	return {
		_cs: CharSet64,
		_mt: minTable,

		MAX_INT: MAX_INT,
		Encode: Encode,
		Decode: Decode,
	};
}();