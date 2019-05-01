const assert = require('assert');
const Shortening = require('./shortening');

describe('Short32', function() {
	const Short32 = Shortening.Std32;
	describe('parity', function() {
		it('exhaustive parity check', function() {
			for (var i = 0; i < Short32.MAX_INT; i++) {
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
			for (var i = 0; i < Short64.MAX_INT; i++) {
				let enc = Short64.Encode(i);
				let dec = Short64.Decode(enc);
				assert.equal(dec, i);
			}
		}).timeout(0);
	});
});
