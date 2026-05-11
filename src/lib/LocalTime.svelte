<script lang="ts">
	import { getDictionary } from './context.svelte';
	import { formatTime } from './localize';
	import type { TimeStyle } from './localize';

	let {
		value,
		style = 'short',
		locale = undefined,
	}: {
		value: Date | string;
		style?: TimeStyle;
		locale?: string;
	} = $props();

	const dict = getDictionary();
	const activeLocale = $derived(locale ?? dict.getActiveLocaleCode());
	const formatted = $derived(formatTime(value, activeLocale, style));
</script>

<time datetime={typeof value === 'string' ? value : value.toISOString()}>{formatted}</time>
