<script lang="ts">
	import type { PageData } from './$types';
	import type { Rubric } from '$lib/types/Rubric';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data: PageData;

	let { session, supabase, assignment, loggedInUser } = data;

	let release_at = new Date(assignment.release_at as string).toLocaleString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
	let due_at = new Date(assignment.due_at as string).toLocaleString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
	let late_at = new Date(assignment.late_at as string).toLocaleString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	const { name, code, description, link, number } = assignment;
	const rubric = assignment.rubric as Rubric;

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

<PageTitle title="Assignment: {name} ({code})" />

<main class="container h-full mx-auto">
	<header class="pt-8 pb-4">
		<p class="px-1 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text primary-400">Assignment</span>
			<span class="text-2xl md:text-3xl">&nbsp;{code}</span>
		</p>
		<h1 class="h1 font-semibold px-1 py-1">{name}</h1>
	</header>
	<section class="flex flex-col">
		<div class="flex flex-row">
			<!-- Buttons -->
			<div class="px-1 pb-4">
				{#if loggedInUser?.role == 'Admin' || loggedInUser?.role == 'Student'}
					<p class="py-1">
						<a
							class="btn btn-sm font-semibold text-xl variant-ghost-primary"
							href="/assignment/{number}/submit"
						>
							Submit
						</a>
					</p>
				{/if}
			</div>
			<div class="px-1">
				{#if loggedInUser?.role == 'Admin' || loggedInUser?.role == 'Tutor'}
					<p class="py-1">
						<a
							class="btn btn-sm font-semibold text-xl variant-ghost-secondary"
							href="/assignment/{number}/grade"
						>
							Grade
						</a>
					</p>
				{/if}
			</div>
			<div class="px-1">
				{#if loggedInUser?.role == 'Admin' || loggedInUser?.role == 'Tutor'}
					<p class="py-1">
						<a
							class="btn btn-sm font-semibold text-xl variant-ghost-tertiary"
							href="/assignment/{number}/edit"
						>
							Edit
						</a>
					</p>
				{/if}
			</div>
		</div>
		<!-- Description -->
		<div class="px-1">
			<h3 class="h3 font-semibold pb-1">Description</h3>
			<p class="pb-4">{@html description}</p>
		<!-- Details -->
		<h3 class="h3 font-semibold pb-1">Details</h3>
		</div>
		<div class="flex flex-col md:flex-row">
			<div class="basis-1/2 px-1">
				<h4 class="h4">Assignment release</h4>
				<p class="pb-4 font-semibold">{release_at}</p>
				<h4 class="h4">Submissions are due by</h4>
				<p class="pb-4 font-semibold">{due_at}</p>
				<h4 class="h4">Late submissions allowed until</h4>
				<p class="pb-4 font-semibold">{late_at}</p>
			</div>
			<div class="basis-1/2 px-1">
				<h4 class="h4">Link to assignment on course website</h4>
				<p class="pb-4"><a class="anchor" href={link} target="_blank">{link}</a></p>
				{#if rubric.show_levels_marks}
					<h4 class="h4">Total marks</h4>
					<p class="pb-4">{rubric.total_marks}</p>
				{/if}
				<h4 class="h4">Requirements</h4>
				<ul class="list-disc list-inside pb-4">
					{#if rubric.require_self_assessment}<li>Complete the self-assessment grid</li>{/if}
					{#if rubric.require_files}<li>Upload file(s)</li>{/if}
					{#if rubric.require_repo}<li>Provide a link to your repo</li>{/if}
					{#if rubric.require_url}<li>Provide a link to your website</li>{/if}
					{#if rubric.require_audio}<li>Provide a link to your audio recording</li>{/if}
					{#if rubric.require_video}<li>Provide a link to your video recording</li>{/if}
				</ul>
			</div>
		</div>
	</section>
	<!-- Rubric-->
	<section class="flex flex-col">
		<h3 class="h3 font-semibold">Rubric</h3>
		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr>
						<th></th>
						{#each range(1, rubric.areas.length) as a, i}
							<th>{rubric.areas[i].name}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each range(1, rubric.levels.length) as l, j}
						<tr>
							<th>
								{rubric.levels[j].name}
								{#if rubric.show_levels_marks}
									<p class="p font-normal">
										{rubric.levels[j].min_marks}–{rubric.levels[j].max_marks}
									</p>
								{/if}
							</th>
							{#each range(1, rubric.areas.length) as a, i}
								<td>{rubric.areas[i].descriptors[j]}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</main>
