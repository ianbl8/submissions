<script lang="ts">
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageData;

	let { session, supabase, course, loggedInUser } = data;

	let start_date = new Date(course.start_date as string).toLocaleDateString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
	let end_date = new Date(course.end_date as string).toLocaleDateString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

</script>

<PageTitle title="Course: {course.name} ({course.code})" />

<div class="container h-full mx-auto">
	<div class="pt-8 pb-4">
		<h2 class="text-2xl">{course.code}</h2>
		<h1 class="text-4xl font-semibold">{course.name}</h1>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- Course details -->
		<div class="py-3">
			<table class="table-auto">
				<tbody>
					<tr>
						<td class="font-semibold px-1 py-1">Course name</td>
						<td class="px-1 py-1">{course.name}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Course code</td>
						<td class="px-1 py-1">{course.code}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Description</td>
						<td class="px-1 py-1" id="description">{@html course.description}</td>
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
					<a class="btn btn-sm variant-ghost-tertiary" href="/course/{course.number}/edit">
						Edit this course
					</a>
				</p>
			{/if}

		</div>

		<!-- Section -->
		<div class="py-3">
			<h3 class="h3 py-1">Modules</h3>
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T S R
				</span>
			</p>
			<p class="py-1">List of modules</p>
			<p class="py-1">
				Link to each module:
				<a
					href="/module/mid"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/module/[mid]
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
				Released grade for each module (when complete)
			</p>
			<!-- Sub section -->
			<hr />
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T
				</span>
			</p>
			<p class="py-1">
				Link to create new module:
				<a
					href="/module/new"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/module/new
				</a>
			</p>
		</div>

	</div>

</div>
