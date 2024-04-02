<script lang="ts">
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageData;

	let { session, supabase, courses, loggedInUser } = data;
	$: ({ session, supabase, courses, loggedInUser } = data);

	for (let i = 0; i < courses?.length; i++) {
		courses[i].start = new Date(courses[i].start_date as string).toLocaleString('en-IE', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		courses[i].end = new Date(courses[i].end_date as string).toLocaleString('en-IE', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

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

<PageTitle title="Submissions Dashboard" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400"
				>Submissions
			</span>
		</p>
		<h1 class="h1 font-semibold px-4 py-1 bg-surface-50 dark:bg-surface-900">
			Dashboard
			<!-- Buttons -->
			<span class="grid justify-items-end pt-2 sm:pt-0 sm:float-right">
				<span>
					<a
						class="btn btn-sm font-semibold text-xl variant-ghost-primary float-right ml-2"
						href="/user/{loggedInUser?.number}"
						>User details
					</a>
					{#if loggedInUser?.role == 'Admin'}
						<a
							class="btn btn-sm font-semibold text-xl variant-ghost-secondary float-right ml-2"
							href="/user/admin"
							>User Admin page
						</a>
					{/if}
					{#if loggedInUser?.role == 'Admin' || loggedInUser?.role == 'Tutor'}
						<a
							class="btn btn-sm font-semibold text-xl variant-ghost-tertiary float-right ml-2"
							href="/course/new"
							>New course
						</a>
					{/if}
				</span>
			</span>
		</h1>
	</header>
	<!-- Courses -->
	<section class="flex flex-col pt-4 px-4">
		<h3 class="h3 font-semibold pb-1">Courses</h3>
		<p class="block py-1 bg-surface-100 dark:bg-surface-800 md:hidden">
			<em
				><strong>Note:</strong> Best viewed in landscape format on a larger screen. On this device, you
				can scroll across the course list.</em
			>
		</p>
		<div class="table-container pt-2">
			<table class="table table-hover">
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>Code</th>
						<th>Start</th>
						<th>End</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each range(1, courses.length) as c, i}
						<tr>
							<th>{c}</th>
							<td class="cursor-pointer" onclick="window.location='/course/{courses[i].number}'"
								>{courses[i].name}</td
							>
							<td class="cursor-pointer" onclick="window.location='/course/{courses[i].number}'"
								>{courses[i].code}</td
							>
							<td class="cursor-pointer" onclick="window.location='/course/{courses[i].number}'"
								>{courses[i].start}</td
							>
							<td class="cursor-pointer" onclick="window.location='/course/{courses[i].number}'"
								>{courses[i].end}</td
							>
							<td> </td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td colspan="6"></td>
					</tr>
				</tfoot>
			</table>
		</div>
	</section>
</main>
