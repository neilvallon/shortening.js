const MAX_INT = 0xFFFFFFFF;

function makeTable(cs) {
	const t = new Array(256).fill(0xFF);
	for (let i = 0; i < cs.length; i++) {
		t[cs.charCodeAt(i)] = i;
	}
	return t;
}

function makeMinTable(base) {
	const tbl = [0];
	for (let i = 1; ; i++) {
		const n = (tbl[i-1] + 1) * base;
		if (MAX_INT < n) break;
		tbl.push(n);
	}
	return tbl
}

function New(charSet) {
	const base = charSet.length;
	if (base != 32 && base != 64) {
		throw "only base64 or base32 supported";
	}

	const offset = (base == 32)? 5:6;

	const minTable = makeMinTable(base);
	const maxmin = minTable[minTable.length-1];

	const splitCharSet = charSet.split("");
	const lookupTable = makeTable(charSet);

	function Len(n) {
		const l = Math.floor((32 - Math.clz32(n)) / offset);
		return (minTable[l] <= n)? l+1 : l;
	}

	function Encode(n) {
		if (!Number.isInteger(n) || n < 0 || MAX_INT < n) {
			return undefined;
		}

		let i = Len(n);
		n -= maxmin;

		let buf = "";
		for (; 0 < i; i--) {
			buf = splitCharSet[n&(base-1)] + buf;
			n >>>= offset;
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
			n = n*base + ind;
		}

		n += minTable[b.length-1]

		if (invalid == 0xFF) return -2;
		if (MAX_INT < n) return -3;

		return n;
	}

	return {
		// for testing only
		_cs: charSet,
		_mt: minTable,

		Encode: Encode,
		Decode: Decode,
	};
};

module.exports = {
	MAX_INT: MAX_INT,
	New:     New,
	Std64:   New(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`),
	Std32:   New(`ABCDEFGHIJKLMNOPQRSTUVWXYZ234567`),
};
