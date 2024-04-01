<script lang="ts">
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageData;

	let { session, supabase, module, module_assignments, loggedInUser } = data;

	let start_date = new Date(module.start_date as string).toLocaleDateString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	let end_date = new Date(module.end_date as string).toLocaleDateString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const { name, code, number, description, link } = module;

	// get details from assignment_modules - a one-item array containing objects
	let assignments = module_assignments![0].assignments;
	let assignments_info = module_assignments![0].modules_assignments;

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

<PageTitle title="Module: {name} ({code})" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400"
				>Module
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
							href="/module/{number}/edit"
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
		<h3 class="h3 font-semibold pb-1">Assignments</h3>
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
						<th>Weighting</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each range(1, assignments.length) as m, i}
						<tr>
							<th>{m}</th>
							<td
								class="cursor-pointer"
								onclick="window.location='../assignment/{assignments[i].number}'"
								>{assignments[i].name}</td
							>
							<td
								class="cursor-pointer"
								onclick="window.location='../assignment/{assignments[i].number}'"
								>{assignments[i].code}</td
							>
							<td
								class="cursor-pointer"
								onclick="window.location='../assignment/{assignments[i].number}'"
								>{assignments_info[i].assignment_weighting}</td
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
					</tr>
				</tfoot>
			</table>
		</div>
	</section>
</main>
