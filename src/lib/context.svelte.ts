import { getContext, setContext } from 'svelte';
import type { Dictionary } from './dictionary.svelte';

const KEY = Symbol('dictionary');

export function setDictionary(dict: Dictionary): void {
	setContext(KEY, dict);
}

export function getDictionary(): Dictionary {
	return getContext<Dictionary>(KEY);
}
