<script lang="ts">
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageData;

	let { session, supabase, course, course_modules, loggedInUser } = data;

	let start_date = new Date(course.start_date as string).toLocaleDateString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	let end_date = new Date(course.end_date as string).toLocaleDateString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const { name, code, number, description, link } = course;

	// get details from course_modules - a one-item array containing objects
	let modules = course_modules![0].modules;
	let modules_info = course_modules![0].courses_modules;

	// range helper
	function range(from: number, to: number) {
		const result = [];
		let i = from;
		while (i <= to) {
			result.push(i);
			i += 1;
		}
		return result;
	}
</script>

<PageTitle title="Course: {name} ({code})" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400"
				>Course
			</span><span class="text-2xl md:text-3xl">&nbsp;{code} </span>
		</p>
		<h1 class="h1 font-semibold px-4 py-1 bg-surface-50 dark:bg-surface-900">
			{name}
			<!-- Buttons -->
			<span class="grid justify-items-end pt-2 sm:pt-0 sm:float-right">
				<span>
					{#if loggedInUser?.role == 'Admin' || loggedInUser?.role == 'Tutor'}
						<a
							class="btn btn-sm font-semibold text-xl variant-ghost-secondary float-right ml-2"
							href="/course/{number}/edit"
							>Edit
						</a>
					{/if}
				</span>
			</span>
		</h1>
	</header>
	<section class="flex flex-col px-4">
		<div class="w-full mx-auto">
			<div class="flex flex-col">
				<div class="grow">
					<h3 class="h3 font-semibold pb-1">Description</h3>
					<p id="description" class="pb-4 text-lg">{@html description}</p>
				</div>
				<!-- Details -->
				<h3 class="h3 font-semibold pb-1">Details</h3>
			</div>
			<div class="flex flex-col md:flex-row">
				<div class="basis-1/2">
					<h4 class="h4">Start date</h4>
					<p class="pb-4 font-semibold">{start_date}</p>
					<h4 class="h4">End date</h4>
					<p class="pb-4 font-semibold">{end_date}</p>
				</div>
				<div class="basis-1/2">
					<h4 class="h4">Link to module on course website</h4>
					<p class="pb-4"><a class="anchor" href={link} target="_blank">{link}</a></p>
				</div>
			</div>
		</div>
	</section>

	<!-- Modules -->
	<section class="flex flex-col pt-4 px-4">
		<h3 class="h3 font-semibold pb-1">Modules</h3>
		<p class="block py-1 bg-surface-100 dark:bg-surface-800 md:hidden">
			<em
				><strong>Note:</strong> Best viewed in landscape format on a larger screen. On this device, you
				can scroll across the module list.</em
			>
		</p>
		<div class="table-container pt-2">
			<table class="table table-hover">
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>Code</th>
						<th>Level</th>
						<th>Credits</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each range(1, modules.length) as m, i}
						<tr>
							<th>{m}</th>
							<td class="cursor-pointer" onclick="window.location='../module/{modules[i].number}'"
								>{modules[i].name}</td
							>
							<td class="cursor-pointer" onclick="window.location='../module/{modules[i].number}'"
								>{modules[i].code}</td
							>
							<td class="cursor-pointer" onclick="window.location='../module/{modules[i].number}'"
								>{modules_info[i].module_level}</td
							>
							<td class="cursor-pointer" onclick="window.location='../module/{modules[i].number}'"
								>{modules_info[i].module_credits}</td
							>
							<td></td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</tfoot>
			</table>
		</div>
	</section>
</main>
