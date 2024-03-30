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

	const { name, code, number, description, link } = module;

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
					<p class="pb-4 text-lg">{@html description}</p>
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


</main>
