<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	export let handler: DataHandler;
	const rowsPerPage = handler.getRowsPerPage();
	const options = [10, 20, 40, 80, 160, 320, 640];
</script>

<aside class="flex place-items-center">
	Users&nbsp;per&nbsp;page
	<select class="select ml-2" bind:value={$rowsPerPage}>
		{#each options as option}
			<option value={option}>
				{option}
			</option>
		{/each}
	</select>
</aside>