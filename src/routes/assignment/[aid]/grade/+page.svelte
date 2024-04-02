<script lang="ts">
	import type { PageData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Plus from '$lib/components/icons/Plus.svelte';
	import Minus from '$lib/components/icons/Minus.svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Rubric } from '$lib/types/Rubric';

	export let data: PageData;

	let { session, supabase, assignment, assignment_submissions, students, loggedInUser } = data;
	$: ({ session, supabase, assignment, assignment_submissions, students, loggedInUser } = data);

	let addAssignmentForm: HTMLFormElement;
	let loading = false;

	let authorisedUser: boolean = loggedInUser?.role == 'Admin' || loggedInUser?.role == 'Tutor';

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

	let release_date = new Date(assignment.release_at as string);
	let due_date = new Date(assignment.due_at as string);
	let late_date = new Date(assignment.late_at as string);
	let submit_date = new Date();

	for (let i = 0; i < assignment_submissions?.length; i++) {
		assignment_submissions[i].submitted_at = new Date(assignment_submissions[i].updated_at as string).toLocaleString('en-IE', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
		submit_date = new Date(assignment_submissions[i].updated_at as string);
		if (submit_date > late_date) {
			assignment_submissions[i].status = 'Out of time'
		} else if (submit_date > due_date) {
			assignment_submissions[i].status = 'Late'
		} else if (submit_date >= release_date && submit_date <= due_date) {
			assignment_submissions[i].status = 'On time'
		} else if (submit_date < release_date) {
			assignment_submissions[i].status = 'Too early'
		} else {
			assignment_submissions[i].status = 'No submission'
		};
	}

	const { name, code, number, description, link } = assignment;
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

<PageTitle title="Submissions for {name} ({code})" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400"
				>Assignment
			</span><span class="text-2xl md:text-3xl">&nbsp;{assignment.code} </span>
		</p>
		<h1 class="h1 font-semibold px-4 py-1 bg-surface-50 dark:bg-surface-900">
			Grade: {assignment.name}
			<!-- Button -->
			<span class="grid justify-items-end pt-2 sm:pt-0 sm:float-right">
				<span>
					<a
						class="btn btn-sm font-semibold text-xl variant-ghost-primary float-right ml-2"
						href="/assignment/{number}"
						>Assignment
					</a>
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
					<h4 class="h4">Assignment release</h4>
					<p class="pb-4 font-semibold">{release_at}</p>
					<h4 class="h4">Submissions are due by</h4>
					<p class="pb-4 font-semibold">{due_at}</p>
					<h4 class="h4">Late submissions allowed until</h4>
					<p class="pb-4 font-semibold">{late_at}</p>
				</div>
				<div class="basis-1/2">
					<h4 class="h4">Link to assignment on course website</h4>
					<p class="pb-4"><a class="anchor" href={link} target="_blank">{link}</a></p>
					{#if rubric}
						<h4 class="h4">Total marks</h4>
						<p class="pb-4">{rubric.total_marks}</p>
						<h4 class="h4">Requirements</h4>
						<ul class="list-disc list-inside pb-4">
							{#if rubric.require_self_assessment}<li>Complete the self-assessment grid</li>{/if}
							{#if rubric.require_files}<li>Upload file(s)</li>{/if}
							{#if rubric.require_repo}<li>Provide a link to your repo</li>{/if}
							{#if rubric.require_url}<li>Provide a link to your website</li>{/if}
							{#if rubric.require_audio}<li>Provide a link to your audio recording</li>{/if}
							{#if rubric.require_video}<li>Provide a link to your video recording</li>{/if}
						</ul>
					{/if}
				</div>
			</div>
		</div>
	</section>
	<!-- Submissions -->
	<section class="flex flex-col pt-4 px-4">
		<h3 class="h3 font-semibold pb-1">Submissions</h3>
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
						<th>Student ID</th>
						<th>Status</th>
						<th>Submitted</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{#each range(1, assignment_submissions.length) as s, i}
						<tr>
							<th>{s}</th>
							<td
								class="cursor-pointer"
								onclick="window.location='../../assignment/{assignment.number}/grade/{assignment_submissions[
									i
								].number}'">{assignment_submissions[i].student_id}</td
							>
							<td
								class="cursor-pointer"
								onclick="window.location='../../assignment/{assignment.number}/grade/{assignment_submissions[
									i
								].number}'">{assignment_submissions[i].complete ? 'Submitted' : 'Draft'}</td
							>
							<td
								class="cursor-pointer"
								onclick="window.location='../../assignment/{assignment.number}/grade/{assignment_submissions[
									i
								].number}'"
								>{assignment_submissions[i].submitted_at}</td
							>
							<td>
								{assignment_submissions[i].status}
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<td colspan="5"></td>
					</tr>
				</tfoot>
			</table>
		</div>
	</section>
</main>
