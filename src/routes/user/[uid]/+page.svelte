<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let { session, supabase, user, loggedInUser } = data;
	const currentUser: Boolean = user.id == loggedInUser?.id;
</script>

<div class="container h-full mx-auto">
	<!-- Page name and route -->
	<div class="pt-8 pb-4">
		{#if user.id == loggedInUser?.id}
			<h1 class="text-4xl font-bold">Your details</h1>
		{:else}
			<h1 class="text-4xl font-bold">Details: {user.forename} {user.surname}</h1>
		{/if}
	</div>

	<!-- Page content -->
	<div class="flex flex-col">
		<!-- Section -->
		<div class="py-3">
			<table class="table-auto">
				<tbody>
					<tr>
						<td class="font-semibold px-1 py-1">Forename</td>
						<td class="px-1 py-1">{user.forename}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Surname</td>
						<td class="px-1 py-1">{user.surname}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Email</td>
						<td class="px-1 py-1">
							{#if currentUser}
								{user.email}
							{:else if user.email}
								Yes
							{:else}
								No
							{/if}
						</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Role</td>
						<td class="px-1 py-1">{user.role}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Status</td>
						<td class="px-1 py-1">{user.status}</td>
					</tr>
					{#if user.student_id}
						<tr>
							<td class="font-semibold px-1 py-1">Student ID</td>
							<td class="px-1 py-1">{user.student_id}</td>
						</tr>
					{/if}
				</tbody>
			</table>
			{#if currentUser}
				<p class="py-1">
					<a class="btn btn-sm variant-ghost-tertiary" href="/user/{user.number}/edit">
						Edit your details
					</a>
				</p>
			{:else if loggedInUser?.role == 'Admin'}
				<p class="py-1">
					<a class="btn btn-sm variant-ghost-tertiary" href="/user/{user.number}/edit">
						Edit these details
					</a>
				</p>
			{/if}
		</div>
	</div>
</div>
