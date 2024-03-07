<script lang="ts">
	import type { DataHandler } from '@vincjo/datatables';
	export let handler: DataHandler;
	const rowsPerPage = handler.getRowsPerPage();
	const options = [10, 20, 30, 40, 50];
</script>

<aside class="flex place-items-center">
	Show
	<select class="select ml-2" bind:value={$rowsPerPage}>
		{#each options as option}
			<option value={option}>
				{option}
			</option>
		{/each}
	</select>
  &nbsp;users
</aside>