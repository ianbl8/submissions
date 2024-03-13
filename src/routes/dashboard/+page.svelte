<script lang="ts">
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageData;

	let { session, supabase, loggedInUser } = data;
</script>

<PageTitle title="Dashboard" />

<div class="container h-full mx-auto">
	<div class="pt-8 pb-4">
		<h1 class="text-4xl font-semibold">Dashboard</h1>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- User details -->
		<div class="py-3">
			<h3 class="h3 py-1">User details</h3>
			<p class="py-1">{loggedInUser?.forename} {loggedInUser?.surname}, {loggedInUser?.role}</p>
			<p class="py-1">
				<a href="/user/{loggedInUser?.number}" class="btn btn-sm variant-ghost-tertiary">
					View your details
				</a>
			</p>
			{#if loggedInUser?.role == 'Admin'}
			<p class="py-1">
				<a
					href="/user/admin"
					class="btn btn-sm variant-ghost-secondary"
				>
					User Admin page
				</a>
			</p>
			{/if}
		</div>

		<!-- Section -->
		<div class="py-3">
			<h3 class="h3 py-1">Courses</h3>
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T S R
				</span>
			</p>
			<p class="py-1">List of courses</p>
			<p class="py-1">(probably one for a student, and multiple for others)</p>
			<p class="py-1">
				Link to each course:
				<a
					href="/course/cid"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/course/[cid]
				</a>
			</p>
			<!-- Sub section -->
			<hr />
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T
				</span>
			</p>
			<p class="py-1">
				Link to create new course:
				<a
					href="/course/new"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/course/new
				</a>
			</p>
		</div>

		<!-- Section -->
		<div class="py-3">
			<h3 class="h3 py-1">Assignments</h3>
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T S R
				</span>
			</p>
			<p class="py-1">List of upcoming assignments</p>
			<p class="py-1">(text list in date order, or calendar)</p>
			<p class="py-1">
				Link to each assignment:
				<a
					href="/assignment/aid"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/assignment/[aid]
				</a>
			</p>
		</div>
	</div>
</div>
