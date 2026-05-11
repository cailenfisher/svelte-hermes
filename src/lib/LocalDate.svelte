<script lang="ts">
	import { getDictionary } from './context.svelte';
	import { formatDate } from './localize';
	import type { DateStyle } from './localize';

	let {
		value,
		style = 'medium',
		locale = undefined,
	}: {
		value: Date | string;
		style?: DateStyle;
		locale?: string;
	} = $props();

	const dict = getDictionary();
	const activeLocale = $derived(locale ?? dict.getActiveLocaleCode());
	const formatted = $derived(formatDate(value, activeLocale, style));
</script>

<time datetime={typeof value === 'string' ? value : value.toISOString()}>{formatted}</time>
