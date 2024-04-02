<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import type { Grade, GradeAreas } from '$lib/types/Grade';
	import type { Rubric } from '$lib/types/Rubric';
	import type { Submission, SubmissionAreas } from '$lib/types/Submission';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: PageData;
	export let form: ActionData;

	let { session, supabase, assignment, submission, student, grading, loggedInUser } = data;
	$: ({ session, supabase, assignment, submission, student, grading, loggedInUser } = data);

	let gradingForm: HTMLFormElement;
	let loading = false;
	let grade = grading?.data?.grade ?? 0;
	let feedback = grading?.data?.feedback ?? '';
	let complete = grading?.complete ?? false;

	let submission_repo = submission?.data?.repo ?? '';
	let submission_url = submission?.data?.url ?? '';
	let submission_audio = submission?.data?.audio ?? '';
	let submission_video = submission?.data?.video ?? '';
	let submission_complete = submission?.complete ?? false;

	const { student_id, forename, surname } = student;

	const { name, code, number } = assignment;
	const rubric = assignment.rubric as Rubric;

	let grade_areas: GradeAreas = grading?.data?.areas ?? [];
	if (grade_areas.length == 0) {
		for (let i = 0; i < rubric.areas.length; i++) {
			grade_areas.push({ level: 0, grade: 0, comment: '' });
		}
	}

	$: grade = grade_areas.reduce((sum, item) => sum + item.grade, 0);

	let submission_areas: SubmissionAreas = submission?.data?.areas ?? [];
	if (submission_areas.length == 0) {
		for (let i = 0; i < rubric.areas.length; i++) {
			submission_areas.push({ level: 0, comment: '' });
		}
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

	onMount(async () => {
		gradingForm = document.querySelector('form')!;
		gradingForm.addEventListener('formdata', (event: FormDataEvent) => {
			event.formData.set('areas', JSON.stringify(grade_areas));
			grade = grade_areas.reduce((sum, item) => sum + item.grade, 0);
			event.formData.set('grade', grade);
		});
	});

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			loading = false;

			// redirect to assignment page
			if (result.type === 'redirect') {
				goto(result.location);
			}
		};
	};
</script>

<PageTitle title="Grade {student_id}: {name} ({code})" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400"
				>Assignment
			</span><span class="text-2xl md:text-3xl">&nbsp;{assignment.code} </span>
		</p>
		<h1 class="h1 font-semibold px-4 py-1 bg-surface-50 dark:bg-surface-900">
			Grade: {forename}
			{surname}
			<!-- Submit -->
			<span class="grid justify-items-end pt-2 sm:pt-0 sm:float-right">
				<button
					id="submit"
					type="submit"
					form="form"
					class="btn btn-sm font-semibold text-xl variant-ghost-primary float-right"
					value={loading ? 'Saving...' : 'Save'}
					disabled={loading}>{loading ? 'Saving...' : 'Save'}</button
				>
			</span>
		</h1>
	</header>
	<!-- Page content -->
	<section class="flex flex-col px-4">
		<!-- Grading form -->
		<div class="form w-full mx-auto">
			<form id="form" method="POST" use:enhance={handleSubmit} bind:this={gradingForm}>
				<input id="submission_id" name="submission_id" type="hidden" value={submission.id} />
				<input id="grader_id" name="grader_id" type="hidden" value={loggedInUser.id} />
				<!-- Details -->
				<div class="flex flex-col">
					{#if rubric.require_repo}
						<div class="grow">
							<p class="label mt-4">Link to repo</p>
							<p class="mb-4">
								<a class="anchor" href={submission_repo}>{submission_repo}</a>
							</p>
						</div>
					{/if}
					{#if rubric.require_url}
						<div class="grow">
							<p class="label mt-4">Link to site</p>
							<p class="mb-4">
								<a class="anchor" href={submission_url}>{submission_url}</a>
							</p>
						</div>
					{/if}
					{#if rubric.require_audio}
						<div class="grow">
							<p class="label mt-4">Link to audio recording</p>
							<p class="mb-4">
								<a class="anchor" href={submission_audio}>{submission_audio}</a>
							</p>
						</div>
					{/if}
					{#if rubric.require_video}
						<div class="grow">
							<p class="label mt-4">Link to video recording</p>
							<p class="mb-4">
								<a class="anchor" href={submission_video}>{submission_video}</a>
							</p>
						</div>
					{/if}
				</div>
				<div class="pt-4">
					<h3 class="h3">Assessment</h3>
					{#each range(1, rubric.areas.length) as a, i}
						<fieldset
							class="border border-solid border-surface-400 dark:border-surface-500 rounded-lg px-4 py-4"
						>
							<legend class="font-semibold text-lg">{rubric.areas[i].name}</legend>
							<div class="flex flex-col md:flex-row">
								<div class="grow md:basis-1/3 px-4">
									<fieldset
										class="border border-solid border-surface-400 dark:border-surface-500 rounded-lg px-4 py-2"
									>
										<legend class="font-semibold">Self Assessment</legend>
										<p class="font-semibold">{rubric.levels[submission_areas[i].level].name}</p>
										<p class="">{submission_areas[i].comment}</p>
									</fieldset>
								</div>
								<div class="grow md:basis-1/3 px-4">
									<fieldset
										class="border border-solid border-surface-400 dark:border-surface-500 rounded-lg px-4 py-2"
									>
										<legend class="font-semibold">Grade (max {rubric.areas[i].marks})</legend>
										<input
											class="input"
											type="number"
											min="0"
											max={rubric.areas[i].marks}
											bind:value={grade_areas[i].grade}
										/>
										<div class="pt-1">
											{#each range(1, rubric.levels.length) as l, j}
												<div class="flex items-center">
													<input
														class="radio rounded-full"
														type="radio"
														id="areas[{i}].level[{j}]"
														name="areas[{i}].level"
														bind:group={grade_areas[i].level}
														value={j}
													/>
													<label class="pl-2" for="areas[{i}].level[{j}]"
														>{rubric.levels[j].name}</label
													>
												</div>
											{/each}
										</div>
									</fieldset>
								</div>
								<div class="grow md:basis-2/3 px-4">
									<label for="areas[{i}].comment" class="font-semibold"
										>Comments on {rubric.areas[i].name}</label
									>
									<textarea
										id="areas[{i}].comment"
										class="textarea"
										rows={rubric.levels.length}
										bind:value={grade_areas[i].comment}
									></textarea>
								</div>
							</div>
						</fieldset>
					{/each}
				</div>
				<div class="pt-4">
					<fieldset
						class="border border-solid border-surface-400 dark:border-surface-500 rounded-lg px-4 py-4"
					>
						<legend class="font-semibold text-xl">Final grade and feedback</legend>
						<div class="flex flex-col md:flex-row">
							<div class="grow md:basis-1/4 px-4">
									<label class="label mt-4 font-bold text-xl grow" for="grade">Grade</label>
									<input class="input" id="grade" name="grade" type="number" value={grade} hidden />
									<p class="text-4xl font-bold grow">{grade}</p>
							</div>
							<div class="grow md:basis-3/4 px-4">
								<label class="label mt-4 font-semibold" for="feedback">Feedback</label>
								<textarea
									id="feedback"
									name="feedback"
									class="textarea"
									rows={rubric.levels.length}
									value={feedback}
								></textarea>
							</div>
						</div>
					</fieldset>
				</div>
				<div class="my-2 bg-surface-200 dark:bg-surface-700 rounded-lg">
					<h3 class="h3 px-2 py-2 font-semibold">Completion</h3>
					<div class="flex items-center">
						<label class="px-2 py-2 text-xl" for="complete"
							>Tick this box if grading is complete.</label
						>
						<input
							class="px-2 py-2 checkbox"
							type="checkbox"
							form="form"
							id="complete"
							name="complete"
							bind:checked={complete}
						/>
					</div>
				</div>
			</form>
		</div>
	</section>
</main>
