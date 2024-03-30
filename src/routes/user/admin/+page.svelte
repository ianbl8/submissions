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

	const handler = new DataHandler(users, { rowsPerPage: 10 });
	const rows = handler.getRows();
</script>

<PageTitle title="User Admin" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">User</span
			>
		</p>
		<h1 class="h1 font-semibold px-4 py-1 bg-surface-50 dark:bg-surface-900">Admin</h1>
	</header>
	<section class="flex flex-col px-4">
		<!-- User admin datatable -->
		<div class="w-full mx-auto">
			<header class="flex justify-between gap-4 py-2">
				<Search {handler} />
				<RowsPerPage {handler} />
			</header>
			<div class="table-container rounded-lg border border-surface-400 dark:border-surface-500">
				<table class="table table-hover ">
					<thead>
						<tr>
							<th></th>
							<ThSort {handler} orderBy="forename">Forename</ThSort>
							<ThSort {handler} orderBy="surname">Surname</ThSort>
							<th>Email</th>
							<th>Role</th>
							<ThSort {handler} orderBy="student_id">Student ID</ThSort>
							<th>Status</th>
							<th></th>
						</tr>
						<tr>
							<th></th>
							<ThFilter {handler} filterBy="forename" />
							<ThFilter {handler} filterBy="surname" />
							<ThFilter {handler} filterBy="email" />
							<ThFilter {handler} filterBy="role" />
							<ThFilter {handler} filterBy="student_id" />
							<ThFilter {handler} filterBy="status" />
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each $rows as row}
							<tr>
								<td></td>
								<td class="cursor-pointer" onclick="window.location='../user/{row.number}'">{row.forename}</td>
								<td class="cursor-pointer" onclick="window.location='../user/{row.number}'">{row.surname}</td>
								<td class="cursor-pointer" onclick="window.location='../user/{row.number}'">{row.email}</td>
								<td class="cursor-pointer" onclick="window.location='../user/{row.number}'">{row.role}</td>
								<td class="cursor-pointer" onclick="window.location='../user/{row.number}'"
									>{#if row.student_id}{row.student_id}{:else}—{/if}</td
								>
								<td class="cursor-pointer" onclick="window.location='../user/{row.number}'">{row.status}</td>
								<td></td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
						</tr>
					</tfoot>
				</table>
			</div>
			<footer class="flex justify-between py-2">
				<RowCount {handler} />
				<Pagination {handler} />
			</footer>
		</div>
	</section>
</main>
