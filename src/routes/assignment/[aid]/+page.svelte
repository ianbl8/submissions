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
		minute: '2-digit',
	});
	let due_at = new Date(assignment.due_at as string).toLocaleString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
	let late_at = new Date(assignment.late_at as string).toLocaleString('en-IE', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

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

<PageTitle title="Assignment: {assignment.name} ({assignment.code})" />

<div class="container h-full mx-auto">
	<div class="pt-8 pb-4">
		<h2 class="text-2xl">{assignment.code}</h2>
		<h1 class="text-4xl font-semibold">{assignment.name}</h1>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- Assignment details -->
		<div class="py-3">
			<table class="table-auto">
				<tbody>
					<tr>
						<td class="font-semibold px-1 py-1">Assignment name</td>
						<td class="px-1 py-1">{assignment.name}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Assignment code</td>
						<td class="px-1 py-1">{assignment.code}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Description</td>
						<td class="px-1 py-1"><div id="description">{@html assignment.description}</div></td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Link to assignment</td>
						<td class="px-1 py-1"><a href={assignment.link} target="_blank">{assignment.link}</a></td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Total marks</td>
						<td class="px-1 py-1">{rubric.total_marks}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Rubric</td>
						<td class="px-1 py-1">
							<table>
								<thead>
									<th>Rubric</th>
									{#each range(1, rubric.areas.length) as a, i}
										<th>{rubric.areas[i].name}</th>
									{/each}
								</thead>
								<tbody>
									{#each range(1, rubric.levels.length) as l, j}
										<tr>
											<td>{rubric.levels[j].name}
												{#if rubric.show_levels_marks}
													<br />({rubric.levels[j].min_marks} – {rubric.levels[j].max_marks})
												{/if}
											</td>
											{#each range(1, rubric.areas.length) as a, i}
												<td>{rubric.areas[i].descriptors[j]}</td>
											{/each}
										</tr>
									{/each}
								</tbody>
							</table>
						</td>
						</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Requirements</td>
						<td class="px-1 py-1">
							<ul>
								{#if rubric.require_self_assessment}<li>Complete the self-assessment grid</li>{/if}
								{#if rubric.require_files}<li>Upload file(s)</li>{/if}
								{#if rubric.require_repo}<li>Provide a link to your repo</li>{/if}
								{#if rubric.require_url}<li>Provide a link to your website</li>{/if}
								{#if rubric.require_audio}<li>Provide a link to your audio recording</li>{/if}
								{#if rubric.require_video}<li>Provide a link to your video recording</li>{/if}
							</ul>
						</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Release date/time</td>
						<td class="px-1 py-1">{release_at}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Due date/time</td>
						<td class="px-1 py-1">{due_at}</td>
					</tr>
					<tr>
						<td class="font-semibold px-1 py-1">Open until date/time</td>
						<td class="px-1 py-1">{late_at}</td>
					</tr>
				</tbody>
			</table>
			{#if loggedInUser?.role == 'Admin'}
				<p class="py-1">
					<a class="btn btn-sm variant-ghost-tertiary" href="/assignment/{assignment.number}/edit">
						Edit this assignment
					</a>
				</p>
			{/if}
		
			<!-- Sub section -->
			<hr />
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T S
				</span>
			</p>
			<p class="py-1">
				Link to submit assignment:
				<a
					href="/assignment/aid/submit"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/assignment/[aid]/submit
				</a>
			</p>
			<p class="py-1">
				Released assignment grade (when complete)
			</p>
				<!-- Sub section -->
			<hr />
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T
				</span>
			</p>
			<p class="py-1">
				Link to edit assignment details:
				<a
					href="/assignment/aid/edit"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/assignment/[aid]/edit
				</a>
			</p>
			<p class="py-1">
				Link to assignment submissions for grading:
				<a
					href="/assignment/aid/grade"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/assignment/[aid]/grade
				</a>
			</p>
		</div>

	</div>

</div>
