<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Search from '$lib/components/datatables/Search.svelte';
	import ThFilter from '$lib/components/datatables/ThFilter.svelte';
	import ThSort from '$lib/components/datatables/ThSort.svelte';
	import RowCount from '$lib/components/datatables/RowCount.svelte';
	import RowsPerPage from '$lib/components/datatables/RowsPerPage.svelte';
	import Pagination from '$lib/components/datatables/Pagination.svelte';
	import Page from '../../+page.svelte';
        
	export let data: PageData;

	let { session, supabase, users, loggedInUser } = data;
	$: ({ session, supabase, users, loggedInUser } = data);

	const handler = new DataHandler( users, { rowsPerPage: 10 });
	const rows = handler.getRows();
	
</script>

<PageTitle title="User Admin" />

<div class="container h-full mx-auto">
	<!-- Page name and route -->
	<div class="pt-8 pb-4">
		<h1 class="text-4xl font-semibold">User Admin</h1>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- Section -->
		<div class="py-3">
			<h3 class="h3 py-1">Users</h3>
			<header class="flex justify-between gap-4">
				<Search {handler} />
				<RowsPerPage {handler} />
			</header>
			<table class="table table-hover table-compact table-auto w-full">
				<thead>
					<tr>
						<ThSort {handler} orderBy="forename">Forename</ThSort>
						<ThSort {handler} orderBy="surname">Surname</ThSort>
						<th>Email</th>
						<th>Role</th>
						<ThSort {handler} orderBy="student_id">Student ID</ThSort>
						<th>Status</th>
						<th colspan="2">User details</th>
					</tr>
					<tr>
						<ThFilter {handler} filterBy="forename" />
						<ThFilter {handler} filterBy="surname" />
						<ThFilter {handler} filterBy="email" />
						<ThFilter {handler} filterBy="role" />
						<ThFilter {handler} filterBy="student_id" />
						<ThFilter {handler} filterBy="status" />
						<th colspan="2"></th>
					</tr>
				</thead>
				<tbody>
					{#each $rows as row}
						<tr>
							<td>{row.forename}</td>
							<td>{row.surname}</td>
							<td>{row.email}</td>
							<td>{row.role}</td>
							<td>{#if row.student_id}{row.student_id}{:else}—{/if}</td>
							<td>{row.status}</td>
							<td><a class="btn btn-sm variant-ghost-tertiary" href="../user/{row.number}">View</a></td>
							<td><a class="btn btn-sm variant-ghost-secondary" href="../user/{row.number}/edit">Edit</a></td>
						</tr>
					{/each}
				</tbody>
			</table>
			<footer class="flex justify-between">
				<RowCount {handler} />
				<Pagination {handler} />
			</footer>
		</div>

	</div>

</div>
