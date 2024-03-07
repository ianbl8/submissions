<script lang="ts">
	import { DataHandler } from '@vincjo/datatables';
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

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
			<!--
			{#if users}
				{#each users as user}
					<p class="py-1 font-semibold">Number {user.number}</p>
					<p class="py-1">
						– Details:
						<a
							href="/user/{user.number}"
							class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
						>
							/user/{user.number}
						</a>
					</p>
					<p class="py-1">
						– Edit:
						<a
							href="/user/{user.number}/edit"
							class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
						>
							/user/{user.number}/edit
						</a>
					</p>
						{/each}
			{:else}
				<p class="py-1">No users</p>
			{/if}
			-->
			<table class="table table-hover table-compact table-auto w-full">
				<thead>
					<tr>
						<td>Forename</td>
						<td>Surname</td>
						<td>Email</td>
						<td>Role</td>
						<td>Student ID</td>
						<td>Status</td>
						<td>User page</td>
						<td>Edit user</td>
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
							<td><a href="../user/{row.number}">User page</a></td>
							<td><a href="../user/{row.number}/edit">Edit user</a></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

	</div>

</div>
