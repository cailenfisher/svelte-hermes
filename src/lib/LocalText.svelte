<script lang="ts">
	import { getDictionary } from './context.svelte';

	let {
		slug,
		scope = undefined,
		contentId = undefined,
		values = undefined
	}: {
		slug: string;
		scope?: string | null;
		contentId?: number | null;
		values?: Record<string, unknown>;
	} = $props();

	const dict = getDictionary();
	let local_content = $derived(dict.getContent(slug, scope, contentId));
	let formatted = $derived(local_content ? dict.localText(slug, values, scope, contentId) : undefined);
</script>

{#if local_content && formatted !== undefined}
	<span dir={local_content.locale.dir}>{formatted}</span>
{:else}
	<span style="color: red">Missing localized content: {slug}</span>
{/if}
