const assert = require('assert');
const Shortening = require('./shortening');

const MAX_INT = Shortening.MAX_INT;

describe('Short32', function() {
	const Short32 = Shortening.Std32;
	describe('parity', function() {
		it('exhaustive parity check', function() {
			for (var i = 0; i < MAX_INT; i++) {
				let enc = Short32.Encode(i);
				let dec = Short32.Decode(enc);
				assert.equal(dec, i);
			}
		}).timeout(0);
	});
});

describe('Short64', function() {
	const Short64 = Shortening.Std64;
	describe('parity', function() {
		it('exhaustive parity check', function() {
			for (var i = 0; i < MAX_INT; i++) {
				let enc = Short64.Encode(i);
				let dec = Short64.Decode(enc);
				assert.equal(dec, i);
			}
		}).timeout(0);
	});
});
