# Shortening.js
[![Build Status](https://img.shields.io/travis/com/neilvallon/shortening.js/master.svg)](https://travis-ci.com/neilvallon/shortening.js) [![npm](https://img.shields.io/npm/v/shortening.svg)](https://www.npmjs.com/package/shortening) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/shortening.svg)

A bijective base encoder for creating short URLs and identifiers.

## Example
```
var shortening = require("shortening")

// Input:  Uint32[0, 4294967295]
// Output: String | undefined
shortening.Std32.Encode(1024);       // "7A"
shortening.Std64.Encode(1024);       // "PA"
shortening.Std64.Encode(-1);         // undefined
shortening.Std64.Encode(4294967296); // undefined

// Input:  String
// Output: Uint32[0, 4294967295] | Negative Sentinel
shortening.Std32.Decode("SHORT"); // 20201043
shortening.Std64.Decode("SHORT"); // 320926867
```
