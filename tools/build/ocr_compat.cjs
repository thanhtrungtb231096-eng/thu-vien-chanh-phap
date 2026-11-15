/* Floating-point Vietnamese models require the generic core on current Node/V8. */
const path=require('node:path');
const features=require(path.join(require('./project_paths.cjs').dependencies,'ocr/node_modules/wasm-feature-detect'));
features.simd=async()=>false;
features.relaxedSimd=async()=>false;
