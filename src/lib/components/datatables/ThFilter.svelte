<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	export let handler: DataHandler;
	export let filterBy: string;
	let value: string;
</script>

<th>
	<input
		class="input font-normal w-full bg-surface-100 dark:bg-surface-800 min-w-24"
		type="text"
		placeholder="Filter"
		bind:value
		on:input={() => {
			if (filterBy) handler.filter(value, filterBy);
		}}
	/>
</th>