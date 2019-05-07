# Shortening.js
[![Build Status](https://img.shields.io/travis/com/neilvallon/shortening.js/master.svg)](https://travis-ci.com/neilvallon/shortening.js) [![npm](https://img.shields.io/npm/v/shortening.svg)](https://www.npmjs.com/package/shortening) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/shortening.svg)

A bijective base encoder for creating short URLs and identifiers.

## Usage

#### shortening.New()
```
// Input:  {string} charSet: [length = 32|64]
// Output: {coder}  Encoder/Decoder object or throw
const base32hex = shortening.New("0123456789ABCDEFGHIJKLMNOPQRSTUV")
base32hex.Encode(1024);   // "V0"
base32hex.Decode("SHORT") // 31025053
```

#### coder.Encode()
```
// Input:  {number}                  uint32[0, 4294967295]
// Output: {string|undefined}        undefined for out of range input
shortening.Std32.Encode(1024);       // "7A"
shortening.Std64.Encode(1024);       // "PA"
shortening.Std64.Encode(-1);         // undefined
shortening.Std64.Encode(4294967296); // undefined
```

#### coder.Decode()
```
// Input:  {string}
// Output: {number}               uint32[0, 4294967295] | negative sentinel
shortening.Std32.Decode("SHORT"); // 20201043
shortening.Std64.Decode("SHORT"); // 320926867
shortening.Std64.Decode("");      // -1
```

## Performance
* Node v12.1.0
* Intel Xeon X5675 - 3.06 GHz

```
Exhaustive Encode+Decode test:
Std32
11m13.84s / 2^32 = 156.9ns
Std64
10m11.24s / 2^32 = 142.3ns

$ npm run bench
Std32.Encode   119ns ± 1%
Std32.Decode  49.6ns ± 1%
Std64.Encode  98.4ns ± 1%
Std64.Decode  45.2ns ± 0%
```
