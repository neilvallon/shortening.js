const Shortening = require('./shortening');
const Short32 = Shortening.Std32;
const Short64 = Shortening.Std64;

const Benchmark = require('benchmark');

const benchSet = 4096;

const rng = (max) => { return Math.floor(Math.random()*max); };
const test_n32 = new Array(benchSet).fill(Short32.MAX_INT).map(rng);
const test_n64 = new Array(benchSet).fill(Short64.MAX_INT).map(rng);

const test_b32 = test_n32.map(Short32.Encode);
const test_b64 = test_n64.map(Short64.Encode);

const suite = new Benchmark.Suite;
suite.add('Short32.Encode', function() {
	for (var i = 0; i < benchSet; i++) Short32.Encode(test_n32[i]);
}).add('Short32.Decode', function() {
	for (var i = 0; i < benchSet; i++) Short32.Decode(test_b32[i]);
}).add('Short64.Encode', function() {
	for (var i = 0; i < benchSet; i++) Short64.Encode(test_n64[i]);
}).add('Short64.Decode', function() {
	for (var i = 0; i < benchSet; i++) Short64.Decode(test_b64[i]);
}).on('cycle', function(event) {
	let bench = event.target;
	bench.hz *= benchSet;
	console.log(bench.name, (1e9/bench.hz).toFixed(2), "ns/op");
	console.log(String(event.target));
}).run();
