# svelte-hermes

Runtime i18n library for SvelteKit, built to support the [SvelteBuilder](https://github.com/cailenfisher/SvelteBuilder) ecosystem, but possibly useful for other projects.

## What it does

svelte-hermes provides a reactive dictionary and a small set of components for rendering localized content that lives in a database or API — content that changes without a redeploy. It is intentionally not a build-time system like Paraglide. Every piece of content is addressed by a typed `slug + scope + entity ID` triple, which makes it possible to handle both static UI labels and per-entity content (e.g., a product description localized per product) through a single unified API.

ICU message formatting (pluralization, variable interpolation, etc.) is provided by `intl-messageformat`.

## Installation

```sh
pnpm add svelte-hermes
```

Requires Svelte 5.

## Core concepts

### `Dictionary`

The central reactive store. Load it with an array of `LocalText` records fetched from your backend, then read from it anywhere in your component tree.

```ts
import { Dictionary } from 'svelte-hermes';

const dict = new Dictionary('en'); // pass your default language code
dict.loadDictionary(await fetchTranslations());
```

`loadDictionary` replaces the current entries. `mergeDictionary` adds new entries without clearing existing ones — useful for lazy-loading translations per route.

### Context helpers

Provide the dictionary once at the root of your app, consume it anywhere below.

```svelte
<!-- +layout.svelte -->
<script lang="ts">
	import { Dictionary, setDictionary } from 'svelte-hermes';

	const dict = new Dictionary('en');
	setDictionary(dict);

	$effect(() => {
		fetch('/api/translations')
			.then((r) => r.json())
			.then((data) => dict.loadDictionary(data));
	});
</script>

<slot />
```

```ts
// anywhere in the tree
import { getDictionary } from 'svelte-hermes';
const dict = getDictionary();
```

### `LocalText` component

Renders a localized string by slug. Falls back to a visible error if the slug is missing.

```svelte
<script>
	import { LocalTextComponent as LocalText } from 'svelte-hermes';
</script>

<!-- Basic usage -->
<LocalText slug="hero.headline" />

<!-- With ICU variable interpolation -->
<LocalText slug="welcome.message" values={{ name: 'Ada' }} />

<!-- Scoped to an entity type + specific entity ID -->
<LocalText slug="product.description" scope="product" contentId={42} />
```

Renders a `<span>` with the `dir` attribute set from the locale, so RTL languages work without extra configuration.

### `LocalDate` and `LocalTime` components

Format dates and times using the active locale. Both render a `<time>` element with a proper `datetime` attribute.

```svelte
<script>
	import { LocalDate, LocalTime } from 'svelte-hermes';
</script>

<LocalDate value={new Date()} />
<LocalDate value="2026-01-15" style="long" />

<LocalTime value={new Date()} />
<LocalTime value={new Date()} style="medium" locale="fr" />
```

`style` accepts `'full' | 'long' | 'medium' | 'short'`. `locale` overrides the active dictionary locale when provided.

### Utility functions

```ts
import { formatDate, formatTime, formatDateTime } from 'svelte-hermes';

formatDate(new Date(), 'en', 'long');
formatTime(new Date(), 'fr', 'short');
formatDateTime(new Date(), 'de', 'medium', 'short');
```

## Data shape

Your backend should return `LocalText[]`:

```ts
type LocalText = {
	id: number;
	scoped_content_id: number | null; // entity ID when scoped (e.g. product ID)
	content: string; // ICU message string
	locale: {
		id: number;
		code: string; // e.g. 'en', 'fr', 'ar'
		name: string;
		native_name: string;
		dir: 'ltr' | 'rtl' | 'auto' | null;
	};
	link: {
		id: number;
		slug: string; // lookup key, e.g. 'hero.headline'
		title: string;
		scope: string | null; // e.g. 'product', null for global UI strings
	};
};
```

When multiple locales are present in the payload, `Dictionary` flattens the data down to one entry per slug/scope/entity triple, preferring the default language.

## API reference

| Export               | Type      | Description                               |
| -------------------- | --------- | ----------------------------------------- |
| `Dictionary`         | class     | Reactive store for localized content      |
| `setDictionary`      | function  | Provide a `Dictionary` via Svelte context |
| `getDictionary`      | function  | Consume the context `Dictionary`          |
| `LocalTextComponent` | component | Render a localized string                 |
| `LocalDate`          | component | Render a localized date                   |
| `LocalTime`          | component | Render a localized time                   |
| `formatDate`         | function  | Format a date to a string                 |
| `formatTime`         | function  | Format a time to a string                 |
| `formatDateTime`     | function  | Format a date + time to a string          |
| `LocalText`          | type      | Shape of a single translation entry       |
| `Locale`             | type      | Shape of a locale record                  |
| `LocalTextLink`      | type      | Shape of a translation link/slug record   |
