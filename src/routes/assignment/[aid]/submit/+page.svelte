<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import type { Rubric } from '$lib/types/Rubric';
	import type { Submission, SubmissionAreas } from '$lib/types/Submission';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: PageData;
	export let form: ActionData;

	let { session, supabase, assignment, submission, loggedInUser } = data;
	$: ({ session, supabase, assignment, submission, loggedInUser } = data);

	let submissionForm: HTMLFormElement;
	let loading = false;
	let repo = submission?.data?.repo ?? '';
	let url = submission?.data?.url ?? '';
	let audio = submission?.data?.audio ?? '';
	let video = submission?.data?.video ?? '';
	let complete = submission?.complete ?? false;

	const { name, code, number } = assignment;
	const rubric = assignment.rubric as Rubric;

	let areas: SubmissionAreas = submission?.data?.areas ?? [];
	if (areas.length == 0) {
		for (let i = 0; i < rubric.areas.length; i++) {
			areas.push({ level: 0, comment: '' });
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
		submissionForm = document.querySelector('form')!;
		submissionForm.addEventListener('formdata', (event: FormDataEvent) => {
			event.formData.set('areas', JSON.stringify(areas));
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

<PageTitle title="Submission: {name} ({code})" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400"
				>Assignment
			</span><span class="text-2xl md:text-3xl">&nbsp;{assignment.code} </span>
		</p>
		<h1 class="h1 font-semibold px-4 py-1 bg-surface-50 dark:bg-surface-900">
			Submit: {assignment.name}
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
		<!-- Submission form -->
		<div class="form w-full mx-auto">
			<form id="form" method="POST" use:enhance={handleSubmit} bind:this={submissionForm}>
				<input id="assignment_id" name="assignment_id" type="hidden" value={assignment.id} />
				<input id="student_id" name="student_id" type="hidden" value={loggedInUser.id} />
				<!-- Details -->
				<div class="flex flex-col">
					{#if rubric.require_repo}
						<div class="grow">
							<label class="label mt-4" for="name">Link to repo</label>
							<input
								class="input"
								id="repo"
								name="repo"
								type="text"
								value={form?.repo ?? repo}
								required
							/>
						</div>
					{/if}
					{#if rubric.require_url}
						<div class="grow">
							<label class="label mt-4" for="name">Link to site</label>
							<input
								class="input"
								id="url"
								name="url"
								type="text"
								value={form?.url ?? url}
								required
							/>
						</div>
					{/if}
					{#if rubric.require_audio}
						<div class="grow">
							<label class="label mt-4" for="name">Link to audio recording</label>
							<input
								class="input"
								id="audio"
								name="audio"
								type="text"
								value={form?.audio ?? audio}
								required
							/>
						</div>
					{/if}
					{#if rubric.require_video}
						<div class="grow">
							<label class="label mt-4" for="name">Link to video recording</label>
							<input
								class="input"
								id="video"
								name="video"
								type="text"
								value={form?.video ?? video}
								required
							/>
						</div>
					{/if}
				</div>
				{#if rubric.require_self_assessment}
					<div class="pt-4">
						<h3 class="h3">Self Assessment</h3>
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
											<legend class="font-semibold">Levels</legend>
											{#each range(1, rubric.levels.length) as l, j}
												<div class="flex items-center">
													<input
														class="radio rounded-full"
														type="radio"
														id="areas[{i}].level[{j}]"
														name="areas[{i}].level"
														bind:group={areas[i].level}
														value={j}
													/>
													<label class="pl-2" for="areas[{i}].level[{j}]"
														>{rubric.levels[j].name}</label
													>
												</div>
											{/each}
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
											bind:value={areas[i].comment}
										></textarea>
									</div>
								</div>
							</fieldset>
						{/each}
					</div>
				{/if}
				<div class="my-2 bg-surface-200 dark:bg-surface-700 rounded-lg">
					<h3 class="h3 px-2 py-2 font-semibold">Completion</h3>
					<div class="flex items-center">
						<label class="px-2 py-2 text-xl" for="complete"
							>Tick this box if your submission is complete.</label
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
