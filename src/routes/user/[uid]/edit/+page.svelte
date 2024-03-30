<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageData;
	export let form: ActionData;

	let { session, supabase, user, loggedInUser } = data;
	$: ({ session, supabase, user, loggedInUser } = data);
	const currentUser: Boolean = user.id == loggedInUser?.id;

	let newUserForm: HTMLFormElement;
	let loading = false;
	let roles = ['Admin', 'Tutor', 'Student', 'Reviewer'];
	let statuses = ['Pending', 'Active', 'Completed', 'Removed'];
	let id: string = user.id;
	let { forename, surname, email, role, status, student_id } = user;
	let selected_role: string;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};
</script>

<PageTitle title="Edit: {user.forename} {user.surname}" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">User</span
			>
		</p>
		<h1 class="h1 font-semibold px-4 py-1 bg-surface-50 dark:bg-surface-900">
			{#if currentUser}
				Edit your details
			{:else}
				Edit: {user.forename} {user.surname}
			{/if}
			<!-- Submit -->
			<span class="grid justify-items-end pt-2 sm:pt-0 sm:float-right">
				<button
					id="submit"
					type="submit"
					form="form"
					class="btn btn-sm font-semibold text-xl variant-ghost-primary float-right"
					value={loading ? 'Saving...' : 'Save'}
					disabled={loading}>{loading ? 'Saving...' : 'Save'}</button
				>
			</span>
		</h1>
	</header>
	<section class="flex flex-col px-4">
		<!-- New user form -->
		<div class="form w-full mx-auto">
			<form id="form" method="POST" use:enhance={handleSubmit} bind:this={newUserForm}>
				<input id="id" name="id" type="hidden" value={id} />
				<div class="flex flex-col md:flex-row">
					<div class="grow md:basis-1/3 md:mr-4">
						<label class="label mt-4" for="forename">Forename</label>
						<input
							class="input"
							id="forename"
							name="forename"
							type="text"
							value={form?.forename ?? forename}
							required
						/>
					</div>
					<div class="grow md:basis-1/3 md:mr-4 md:ml-4">
						<label class="label mt-4" for="surname">Surname</label>
						<input
							class="input"
							id="surname"
							name="surname"
							type="text"
							value={form?.surname ?? surname}
							required
						/>
					</div>
					<div class="grow md:basis-1/3 md:ml-4">
						<label class="label mt-4" for="email">Email</label>
						<input
							class="input"
							id="email"
							name="email"
							type="email"
							value={form?.email ?? email}
							required
						/>
					</div>
				</div>
				<div class="flex flex-col md:flex-row">
					<div class="grow md:basis-1/3 md:mr-4">
						<label class="label mt-4" for="role">Role</label>
						<select class="select" id="role" name="role" bind:value={selected_role}>
							{#each roles as r}
								{#if r == (form?.role ?? role)}
									<option value={r} selected>{r}</option>
								{:else}
									<option value={r}>{r}</option>
								{/if}
							{/each}
						</select>
					</div>
					<div class="grow md:basis-1/3 md:mr-4 md:ml-4">
						<label class="label mt-4" for="status">Status</label>
						<select class="select" id="status" name="status">
							{#each statuses as s}
								{#if s == (form?.status ?? status)}
									<option value={s} selected>{s}</option>
								{:else if loggedInUser.role == 'Admin'}
									<option value={s}>{s}</option>
								{:else}
									<option value={s} disabled>{s}</option>
								{/if}
							{/each}
						</select>
					</div>
					<div class="grow md:basis-1/3 md:ml-4">
						{#if selected_role == 'Student'}
							<label class="label mt-4" for="student_id">Student ID</label>
							<input
								class="input"
								id="student_id"
								name="student_id"
								type="text"
								value={form?.student_id ?? student_id}
							/>
						{:else}
							<input
								class="hidden"
								id="student_id"
								name="student_id"
								type="text"
								value={form?.student_id ?? student_id}
							/>
						{/if}
					</div>
				</div>
			</form>
		</div>
	</section>
</main>
