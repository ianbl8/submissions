<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageData;
	export let form: ActionData;

	let { session, supabase, user, loggedInUser } = data;
	$: ({ session, supabase, user, loggedInUser } = data);

	let newUserForm: HTMLFormElement;
	let loading = false;
	let roles = ['Admin', 'Tutor', 'Student', 'Reviewer'];
	let statuses = ['Pending', 'Active', 'Completed', 'Removed'];
	let id: string = user.id;
	let forename = user.forename;
	let surname = user.surname;
	let email = user.email;
	let role = user.role;
	let status = user.status;
	let student_id = user.student_id;
	let selected_role: string;

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};
</script>

<PageTitle title="Edit: {user.forename} {user.surname}" />

<div class="container h-full mx-auto">
	<div class="pt-8 pb-4">
		{#if user.id == loggedInUser?.id}
			<h1 class="text-4xl font-semibold">Edit your details</h1>
			<h3 class="h3 py-1 mt-4">Please update your details</h3>
			{:else}
			<h1 class="text-4xl font-semibold">Edit details: {user.forename} {user.surname}</h1>
			<h3 class="h3 py-1 mt-4">Please update their details</h3>
			{/if}
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- User details form -->
		<div class="form">
			<form method="POST" use:enhance={handleSubmit} bind:this={newUserForm}>
				<input id="id" name="id" type="hidden" value={id} />
				<div>
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
				<div>
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
				<div>
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
				<div>
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
				<div>
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
				<div>
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
						<input class="hidden" id="student_id" name="student_id" type="text" value={form?.student_id ?? student_id} />
					{/if}
				</div>
				<div>
					<input
						type="submit"
						class="btn btn-md variant-ghost-primary mt-4"
						value={loading ? 'Loading...' : 'Save'}
						disabled={loading}
					/>
				</div>
			</form>
		</div>
	</div>
</div>
