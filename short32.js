module.exports = function() {
	const MAX_INT = 0xFFFFFFFF;

	function makeTable(cs) {
		const t = new Array(256).fill(0xFF);
		for (let i = 0; i < cs.length; i++) {
			t[cs.charCodeAt(i)] = i;
		}
		return t;
	}

	const CharSet32 = `ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`;
	const lookupTable = makeTable(CharSet32);

	const min02 = 1 << 5;
	const min03 = (min02 + 1) << 5;
	const min04 = (min03 + 1) << 5;
	const min05 = (min04 + 1) << 5;
	const min06 = (min05 + 1) << 5;
	const min07 = (min06 + 1) << 5;
	const minTable = [0, min02, min03, min04, min05, min06, min07];

	function Len(n) {
		const l = Math.floor((32 - Math.clz32(n)) / 5);
		return (minTable[l] <= n)? l+1 : l;
	}

	const splitCharSet32 = CharSet32.split("");
	function Encode(n) {
		if (!Number.isInteger(n) || n < 0 || MAX_INT < n) {
			return undefined;
		}

		let i = Len(n);
		n -= min07;

		let buf = "";
		for (; 0 < i; i--) {
			buf = splitCharSet32[n&31] + buf;
			n >>>= 5;
		}

		return buf;
	}

	function Decode(b) {
		if (b === null || b === undefined) return -1;
		if (minTable.length < b.length || b.length == 0) return -1;

		let n = 0;
		let invalid = 0x00;
		for (let i = 0; i < b.length; i++) {
			const ind = lookupTable[b.charCodeAt(i)&0xFF];
			invalid |= ind;
			n = n*32 + ind;
		}

		n += minTable[b.length-1]

		if (invalid == 0xFF) return -2;
		if (MAX_INT < n) return -3;

		return n;
	}

	return {
		_cs: CharSet32,
		_mt: minTable,

		MAX_INT: MAX_INT,
		Encode: Encode,
		Decode: Decode,
	};
}();
