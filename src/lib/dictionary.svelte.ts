import IntlMessageFormat from 'intl-messageformat';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import type { LocalText } from './localizeTypes.ts';

export class Dictionary {
	#data: LocalText[] | undefined = $state();
	#mfCache = new SvelteMap<string, IntlMessageFormat>();
	readonly #defaultLanguage: string;

	constructor(defaultLanguage: string = 'en') {
		this.#defaultLanguage = defaultLanguage;
	}

	#getCompiledMF(content: string, localeCode: string): IntlMessageFormat {
		const key = `${content}\x00${localeCode}`;
		let mf = this.#mfCache.get(key);
		if (!mf) {
			mf = new IntlMessageFormat(content, localeCode);
			this.#mfCache.set(key, mf);
		}
		return mf;
	}

	getContent(
		slug: string,
		scope?: string | null,
		contentId?: number | null
	): LocalText | undefined {
		if (!this.#data) {
			console.error('getContent called with no dictionary defined');
			return undefined;
		}
		return this.#data.find((item) => {
			if (item.link.slug !== slug) return false;
			if (scope !== undefined && scope !== null && item.link.scope !== scope) return false;
			if (contentId !== undefined && contentId !== null && item.scoped_content_id !== contentId)
				return false;
			return true;
		});
	}

	getContentBySlug(slug: string): LocalText | undefined {
		return this.getContent(slug);
	}

	get isLoaded(): boolean {
		return this.#data !== undefined;
	}

	getActiveLocaleCode(): string {
		return this.#data?.[0]?.locale.code ?? this.#defaultLanguage;
	}

	localText(
		slug: string,
		values?: Record<string, unknown>,
		scope?: string | null,
		contentId?: number | null
	): string {
		const item = this.getContent(slug, scope, contentId);
		if (!item) return slug;
		if (!values) return item.content;
		try {
			return String(this.#getCompiledMF(item.content, item.locale.code).format(values));
		} catch (e) {
			console.error(`localText: ICU format error for slug "${slug}"`, e);
			return item.content;
		}
	}

	loadDictionary(data: LocalText[], flattened = false): boolean {
		if (!data) {
			console.error('loadDictionary called without data.');
			return false;
		}
		this.#mfCache.clear();
		const result = flattened ? this.#verifiedFlat(data) : this.#flattenDictionary(data);
		this.#data = result;
		return result !== undefined;
	}

	mergeDictionary(data: LocalText[], flattened = false): boolean {
		if (!data) {
			console.error('mergeDictionary called without data.');
			return false;
		}
		const incoming = flattened ? this.#verifiedFlat(data) : this.#flattenDictionary(data);
		if (!incoming) return false;
		if (!this.#data) {
			this.#data = incoming;
			return true;
		}
		const existingKeys = new SvelteSet(
			this.#data.map((item) => `${item.link.id}|${item.scoped_content_id ?? 'null'}`)
		);
		const newEntries = incoming.filter(
			(item) => !existingKeys.has(`${item.link.id}|${item.scoped_content_id ?? 'null'}`)
		);
		if (newEntries.length > 0) this.#data = [...this.#data, ...newEntries];
		return true;
	}

	#verifiedFlat(data: LocalText[]): LocalText[] | undefined {
		const seen = new SvelteSet<string>();
		for (const item of data) {
			const key = `${item.link.id}|${item.scoped_content_id ?? 'null'}`;
			if (seen.has(key)) {
				console.warn('verifiedFlat: collision found, re-flattening.', key);
				return this.#flattenDictionary(data);
			}
			seen.add(key);
		}
		return data;
	}

	#flattenDictionary(payload: LocalText[]): LocalText[] | undefined {
		if (!payload || payload.length < 1) {
			console.error('flattenDictionary called with no data.');
			return undefined;
		}
		const def = this.#defaultLanguage;
		const grouped = payload.reduce<Record<string, Record<string, LocalText>>>((results, item) => {
			const key = `${item.link.id}|${item.scoped_content_id ?? 'null'}`;
			if (!results[key]) results[key] = {};
			results[key][item.locale.code] = item;
			return results;
		}, {});
		return Object.values(grouped).map(
			(localeEntries) => localeEntries[def] ?? Object.values(localeEntries)[0]
		);
	}
}
