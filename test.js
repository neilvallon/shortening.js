const assert = require('assert');
const Shortening = require('./shortening');

function rollover(charset, minTable, enc) {
	for (var i = 0; i < minTable.length; i++) {
		const a = enc.Encode(minTable[i] - 1)
		const b = enc.Encode(minTable[i])
		assert.equal(a.length+1, b.length);
		for (var j = 0; j < a.length; j++) assert.equal(a[j], charset[charset.length-1]);
		for (var j = 0; j < b.length; j++) assert.equal(b[j], charset[0]);
	}
}

function encCounting(charset, enc) {
	var n = 0;
	for (var i = -1; i < charset.length; i++) {
		for (var j = 0; j < charset.length; j++) {
			const id = enc.Encode(n);
			assert.equal(id[id.length-1], charset[j]);
			if (i != -1) assert.equal(id[0], charset[i]);
			n++;
		}
	}
}

function decCounting(charset, dec) {
	var n = 0;
	for (var i = -1; i < charset.length; i++) {
		for (var j = 0; j < charset.length; j++) {
			const id = (i != -1)? charset[i]+charset[j] : charset[j];
			assert.equal(dec.Decode(id), n);
			n++
		}
	}
}

function parity(s, c) {
	it("first "+ c +" ids", function() {
		for (var i = 0; i < c; i++) assert.equal(s.Decode(s.Encode(i)), i);
	});

	it("last "+ c +" ids", function() {
		for (var i = s.MAX_INT-c; i < s.MAX_INT; i++) assert.equal(s.Decode(s.Encode(i)), i);
	});

	it("random "+ c +" ids", function() {
		for (var i = 0; i < c; i++) {
			const v = Math.floor(Math.random() * s.MAX_INT)
			assert.equal(s.Decode(s.Encode(v)), v);
		}
	});
}

const parity_count = 1e5;

describe('Short32', function() {
	const Short32 = Shortening.Std32;
	describe('#encode()', function() {
		it('correctly encodes ids for first two place values', function() {
			encCounting(Short32._cs, Short32);
		});

		it('correctly encodes MAX_INT', function() {
			assert.equal(Short32.Encode(Short32.MAX_INT), "A666667");
		});

		it('correctly handles place value rollover', function() {
			rollover(Short32._cs, Short32._mt.slice(1), Short32);
		});
	});

	describe('#decode()', function() {
		it('correctly decodes ids for first two place values', function() {
			decCounting(Short32._cs, Short32);
		});

		it('correctly decodes MAX_INT', function() {
			assert.equal(Short32.Decode("A666667"), Short32.MAX_INT);
		});

		const tests = [
			{ ID: null,       Error: -1 },
			{ ID: undefined,  Error: -1 },
			{ ID: "",         Error: -1 },
			{ ID: "A66667A",  Error: -3 },
			{ ID: "AAAAAAAA", Error: -1 },
			{ ID: "*",        Error: -2 },
			{ ID: "\xFF",     Error: -2 },
		];

		for (var i = 0; i < tests.length; i++) {
			const test = tests[i];
			it("returns error("+ test.Error +") on input: "+ test.ID, function() {
				assert.equal(Short32.Decode(test.ID), test.Error);
			});
		}
	});

	describe('parity', function() {
		parity(Short32, parity_count);
	});
});

describe('Short64', function() {
	const Short64 = Shortening.Std64;
	describe('#encode()', function() {
		it('correctly encodes ids for first two place values', function() {
			encCounting(Short64._cs, Short64);
		});

		it('correctly encodes MAX_INT', function() {
			assert.equal(Short64.Encode(Short64.MAX_INT), "A----_");
		});

		it('correctly handles place value rollover', function() {
			rollover(Short64._cs, Short64._mt.slice(1), Short64);
		});
	});

	describe('#decode()', function() {
		it('correctly decodes ids for first two place values', function() {
			decCounting(Short64._cs, Short64);
		});

		it('correctly decodes MAX_INT', function() {
			assert.equal(Short64.Decode("A----_"), Short64.MAX_INT);
		});

		const tests = [
			{ ID: null,      Error: -1 },
			{ ID: undefined, Error: -1 },
			{ ID: "",        Error: -1 },
			{ ID: "A---_A",  Error: -3 },
			{ ID: "AAAAAAA", Error: -1 },
			{ ID: "*",       Error: -2 },
			{ ID: "\xFF",    Error: -2 },
		];
		for (var i = 0; i < tests.length; i++) {
			const test = tests[i];
			it("returns error("+ test.Error +") on input: "+ test.ID, function() {
				assert.equal(Short64.Decode(test.ID), test.Error);
			});
		}
	});

	describe('parity', function() {
		parity(Short64, parity_count);
	});
});
