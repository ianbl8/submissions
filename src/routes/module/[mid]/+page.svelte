<script lang="ts">
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageData;

	let { session, supabase, module, loggedInUser } = data;

	let start_date = new Date(module.start_date as string).toLocaleDateString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	let end_date = new Date(module.end_date as string).toLocaleDateString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

</script>

<PageTitle title="Module: {module.name} ({module.code})" />

<div class="container h-full mx-auto">
	<div class="pt-8 pb-4">
		<h2 class="text-2xl">{module.code}</h2>
		<h1 class="text-4xl font-semibold">{module.name}</h1>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- Module details -->
		<div class="py-3">
			<table class="table-auto">
				<tbody>
					<tr>
						<td class="font-semibold px-1 py-1">Module name</td>
						<td class="px-1 py-1">{module.name}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Module code</td>
						<td class="px-1 py-1">{module.code}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Description</td>
						<td class="px-1 py-1"><div id="description">{@html module.description}</div></td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Start date</td>
						<td class="px-1 py-1">{start_date}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">End date</td>
						<td class="px-1 py-1">{end_date}</td>
					</tr>
				</tbody>
			</table>
			{#if loggedInUser?.role == 'Admin'}
				<p class="py-1">
					<a class="btn btn-sm variant-ghost-tertiary" href="/module/{module.number}/edit">
						Edit this module
					</a>
				</p>
			{/if}

		</div>

		<!-- Section -->
		<div class="py-3">
			<h3 class="h3 py-1">Assignments</h3>
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T S R
				</span>
			</p>
			<p class="py-1">List of assignments</p>
			<p class="py-1">
				Link to each assignment:
				<a
					href="/assignment/aid"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/assignment/[aid]
				</a>
			</p>
			<!-- Sub section -->
			<hr />
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: S
				</span>
			</p>
			<p class="py-1">
				Released grade for each assignment (when complete)
			</p>
			<!-- Sub section -->
			<hr />
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T
				</span>
			</p>
			<p class="py-1">
				Link to create new assignment:
				<a
					href="/assignment/new"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/assignment/new
				</a>
			</p>
		</div>

	</div>

</div>
