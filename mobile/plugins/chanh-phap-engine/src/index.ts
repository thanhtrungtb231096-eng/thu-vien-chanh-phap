import { registerPlugin } from '@capacitor/core';
import type { ChanhPhapEnginePlugin } from './definitions';

const ChanhPhapEngine = registerPlugin<ChanhPhapEnginePlugin>('ChanhPhapEngine');

export * from './definitions';
export { ChanhPhapEngine };

