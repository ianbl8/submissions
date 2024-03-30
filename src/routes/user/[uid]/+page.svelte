<script lang="ts">
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageData;

	let { session, supabase, user, loggedInUser } = data;
	const currentUser: Boolean = user.id == loggedInUser?.id;

	const { number, forename, surname, email, role, status, student_id } = user;
</script>

<PageTitle title="User: {user.forename} {user.surname}" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400"
				>User
			</span>
		</p>
		<h1 class="h1 font-semibold px-4 py-1 bg-surface-50 dark:bg-surface-900">
			{#if user.id == loggedInUser?.id}
				Your details
			{:else}
				{user.forename} {user.surname}
			{/if}
			<!-- Buttons -->
			<span class="grid justify-items-end pt-2 sm:pt-0 sm:float-right">
				<span>
					{#if currentUser}
						<a
							class="btn btn-sm font-semibold text-xl variant-ghost-primary float-right ml-2"
							href="/user/{number}/edit"
							>Edit
						</a>
					{:else if loggedInUser?.role == 'Admin'}
						<a
							class="btn btn-sm font-semibold text-xl variant-ghost-secondary float-right ml-2"
							href="/user/{number}/edit"
							>Edit
						</a>
					{/if}
				</span>
			</span>
		</h1>
	</header>
	<section class="flex flex-col px-4">
		<div class="form w-full mx-auto">
			<div class="flex flex-col md:flex-row">
				<div class="grow md:basis-1/3 md:mr-4">
					<h4 class="h4">Forename</h4>
					<p class="pb-4 font-semibold">{forename}</p>
				</div>
				<div class="grow md:basis-1/3 md:mr-4 md:ml-4">
					<h4 class="h4">Surname</h4>
					<p class="pb-4 font-semibold">{surname}</p>
				</div>
				<div class="grow md:basis-1/3 md:ml-4">
					<h4 class="h4">Email</h4>
					<p class="pb-4 font-semibold">{email}</p>
				</div>
			</div>
			<div class="flex flex-col md:flex-row">
				<div class="grow md:basis-1/3 md:mr-4">
					<h4 class="h4">Role</h4>
					<p class="pb-4 font-semibold">{role}</p>
				</div>
				<div class="grow md:basis-1/3 md:mr-4 md:ml-4">
					<h4 class="h4">Status</h4>
					<p class="pb-4 font-semibold">{status}</p>
				</div>
				<div class="grow md:basis-1/3 md:ml-4">
					{#if role == 'Student'}
						<h4 class="h4">Student ID</h4>
						<p class="pb-4 font-semibold">{student_id}</p>
					{/if}
				</div>
			</div>
		</div>
	</section>
</main>
