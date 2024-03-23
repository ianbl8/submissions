<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import type { Rubric } from '$lib/types/Rubric';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import sanitizeHtml from 'sanitize-html';

	export let data: PageData;
	export let form: ActionData;

	let { session, supabase, assignment, loggedInUser } = data;
	$: ({ session, supabase, assignment, loggedInUser } = data);

	let editAssignmentForm: HTMLFormElement;
	let loading = false;
	let id: string = assignment.id;
	let name = assignment.name;
	let code = assignment.code;
	let description = assignment.description;
	let link = assignment.link;
	let rubric = assignment.rubric as Rubric;
	let release_at = new Date(assignment.release_at!);
	let due_at = new Date(assignment.due_at!);
	let late_at = new Date(assignment.late_at!);

	// rubric object
	let {
		total_marks,
		levels,
		show_levels_marks,
		areas,
		require_self_assessment,
		require_files,
		require_repo,
		require_url,
		require_audio,
		require_video
	} = rubric;

	const addLevel = () => {
		if (levels.length < 7) {
			levels = [...levels, { name: '', min_marks: 0, max_marks: 100 }];
		}
	};
	const removeLevel = () => {
		if (levels.length > 2) {
			levels = levels.slice(0, levels.length - 1);
		}
	};
	const addArea = () => {
		if (areas.length < 7) {
			areas = [...areas, { name: '', marks: 20, descriptors: [] }];
		}
	};
	const removeArea = () => {
		if (areas.length > 1) {
			areas = areas.slice(0, areas.length - 1);
		}
	};

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

	// set up Quill input
	onMount(async () => {
		const { default: Quill } = await import('quill');
		let descriptionInput: HTMLElement = document.getElementById('description')!;
		let quill = new Quill(descriptionInput, {
			modules: {
				toolbar: [
					['bold', 'italic'],
					['link', 'blockquote', 'code-block'],
					[{ list: 'ordered' }, { list: 'bullet' }]
				]
			},
			theme: 'snow'
		});

		// parse dates into datetime-local format
		// https://stackoverflow.com/questions/64440010/trying-to-set-datetime-local-using-javascript
		if (release_at) {
			const releaseInput = <HTMLInputElement>document.getElementById('release_at')!;
			releaseInput.value = release_at.toISOString().slice(0, -1);
		}
		if (due_at) {
			const dueInput = <HTMLInputElement>document.getElementById('due_at')!;
			dueInput.value = late_at.toISOString().slice(0, -1);
		}
		if (late_at) {
			const lateInput = <HTMLInputElement>document.getElementById('late_at')!;
			lateInput.value = due_at!.toISOString().slice(0, -1);
		}

		if (assignment.description) {
			quill.clipboard.dangerouslyPasteHTML(assignment.description, 'user');
		}

		// update levels and areas arrays, and description using Quill input
		editAssignmentForm = document.querySelector('form')!;
		editAssignmentForm.addEventListener('formdata', (event: FormDataEvent) => {
			event.formData.set('levels', JSON.stringify(levels));
			event.formData.set('areas', JSON.stringify(areas));
			let html = quill.getSemanticHTML(0);
			description = sanitizeHtml(html, {
				allowedTags: [
					'p',
					'br',
					'strong',
					'em',
					'b',
					'i',
					'a',
					'blockquote',
					'pre',
					'ol',
					'ul',
					'li'
				]
			});
			event.formData.set('description', description);
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

<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.3/dist/quill.snow.css" rel="stylesheet" />
</svelte:head>

<PageTitle title="Edit: {assignment.name} ({assignment.code})" />

<div class="container h-full mx-auto">
	<div class="pt-8 pb-4">
		<h1 class="text-4xl font-semibold">Edit assignment: {assignment.name} ({assignment.code})</h1>
		<h3 class="h3 py-1 mt-4">Please update the assignment details</h3>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">
		<!-- Assignment details form -->
		<div class="form">
			<form method="POST" use:enhance={handleSubmit} bind:this={editAssignmentForm}>
				<input id="id" name="id" type="hidden" value={id} />
				<div>
					<label class="label mt-4" for="name">Assignment name</label>
					<input
						class="input"
						id="name"
						name="name"
						type="text"
						value={form?.name ?? name}
						required
					/>
				</div>
				<div>
					<label class="label mt-4" for="code">Assignment code</label>
					<input
						class="input"
						id="code"
						name="code"
						type="text"
						value={form?.code ?? code}
						required
					/>
				</div>
				<div>
					<label class="label mt-4" for="description">Description</label>
					<div id="description" />
					<!-- Quill input -->
				</div>
				<div>
					<label class="label mt-4" for="link">Link to assignment</label>
					<input
						class="input"
						id="link"
						name="link"
						type="text"
						value={form?.link ?? link}
						required
					/>
				</div>
				<div>
					<label class="label mt-4" for="release_at">Release date/time</label>
					<input
						class="input"
						id="release_at"
						name="release_at"
						type="datetime-local"
						value={form?.release_at ?? release_at}
						required
					/>
				</div>
				<div>
					<label class="label mt-4" for="due_at">Due date/time</label>
					<input
						class="input"
						id="due_at"
						name="due_at"
						type="datetime-local"
						value={form?.due_at ?? due_at}
						required
					/>
				</div>
				<div>
					<label class="label mt-4" for="late_at">Open until date/time</label>
					<input
						class="input"
						id="late_at"
						name="late_at"
						type="datetime-local"
						value={form?.late_at ?? late_at}
						required
					/>
				</div>
				<!-- Rubric -->
				<hr class="mt-4 pt-4" />
				<h2 class="h2">Rubric</h2>
				<div>
					<label class="label mt-4" for="total_marks">Total marks available (e.g. 100)</label>
					<input
						class="input"
						id="total_marks"
						name="total_marks"
						type="number"
						value={form?.total_marks ?? total_marks}
					/>
				</div>
				<fieldset class="border border-solid border-stone-900 p-3">
					<legend class="font-semibold">Levels</legend>
					<div class="mt-4">
						Number of levels: <span class="font-bold">{levels.length}</span>
						&nbsp;&nbsp;&nbsp;
						{#if levels.length < 7}
							<button class="btn btn-sm variant-ghost-secondary" on:click|preventDefault={addLevel}
								>Add a level</button
							>
						{:else}
							<button
								class="btn btn-sm variant-ghost-secondary"
								on:click|preventDefault={addLevel}
								disabled>Add a level</button
							>
						{/if}
						{#if levels.length > 2}
							<button
								class="btn btn-sm variant-ghost-secondary"
								on:click|preventDefault={removeLevel}>Remove a level</button
							>
						{:else}
							<button
								class="btn btn-sm variant-ghost-secondary"
								on:click|preventDefault={removeLevel}
								disabled>Remove a level</button
							>
						{/if}
					</div>
					{#each range(1, levels.length) as l, i}
						<div>
							<label class="label mt-4" for="levels[{i}].name">Level {l}</label>
							<input
								class="input"
								id="levels[{i}].name"
								name="levels[{i}].name"
								type="text"
								bind:value={levels[i].name}
							/>
						</div>
						<div>
							<label class="label mt-4" for="levels[{i}].min_marks">Min marks</label>
							<input
								class="input"
								id="levels[{i}].min_marks"
								name="levels[{i}].min_marks"
								type="number"
								bind:value={levels[i].min_marks}
							/>
						</div>
						<div>
							<label class="label mt-4" for="levels[{i}].max_marks">Max marks</label>
							<input
								class="input"
								id="levels[{i}].max_marks"
								name="levels[{i}].max_marks"
								type="number"
								bind:value={levels[i].max_marks}
							/>
						</div>
					{/each}
					<div>
						<label class="label mt-4" for="show_levels_marks"
							>Show the mark range for each level</label
						>
						<input
							class="checkbox"
							id="show_levels_marks"
							name="show_levels_marks"
							type="checkbox"
							bind:checked={show_levels_marks}
						/>
					</div>
				</fieldset>
				<fieldset class="border border-solid border-stone-900 p-3">
					<legend class="font-semibold">Areas</legend>
					<div class="mt-4">
						Number of areas: <span class="font-bold">{areas.length}</span>
						&nbsp;&nbsp;&nbsp;
						{#if areas.length < 7}
							<button class="btn btn-sm variant-ghost-secondary" on:click|preventDefault={addArea}
								>Add an area</button
							>
						{:else}
							<button
								class="btn btn-sm variant-ghost-secondary"
								on:click|preventDefault={addArea}
								disabled>Add an area</button
							>
						{/if}
						{#if areas.length > 1}
							<button
								class="btn btn-sm variant-ghost-secondary"
								on:click|preventDefault={removeArea}>Remove an area</button
							>
						{:else}
							<button
								class="btn btn-sm variant-ghost-secondary"
								on:click|preventDefault={removeArea}
								disabled>Remove an area</button
							>
						{/if}
					</div>
					{#each range(1, areas.length) as a, i}
						<div>
							<label class="label mt-4" for="areas[{i}].name">Area {a}</label>
							<input
								class="input"
								id="areas[{i}].name"
								name="areas[{i}].name"
								type="text"
								bind:value={areas[i].name}
							/>
						</div>
						<div>
							<label class="label mt-4" for="areas[{i}].min_marks">Marks allowed</label>
							<input
								class="input"
								id="areas[{i}].marks"
								name="areas[{i}].marks"
								type="number"
								bind:value={areas[i].marks}
							/>
						</div>
						{#each range(1, levels.length) as l, j}
							<div>
								<label class="label mt-4" for="areas[{i}].descriptors[{j}]"
									>Descriptors for Level {l}</label
								>
								<input
									class="input"
									id="areas[{i}].descriptors[{j}]"
									name="areas[{i}].descriptors[{j}]"
									type="text"
									bind:value={areas[i].descriptors[j]}
								/>
							</div>
						{/each}
					{/each}
				</fieldset>
				<fieldset class="border border-solid border-stone-900 p-3">
					<legend class="font-semibold">Requirements</legend>
					<div>
						<label class="label mt-4" for="require_self_assessment"
							>Self assessment using the rubric</label
						>
						<input
							class="checkbox"
							id="require_self_assessment"
							name="require_self_assessment"
							type="checkbox"
							bind:checked={require_self_assessment}
						/>
					</div>
					<div>
						<label class="label mt-4" for="require_files">File uploads</label>
						<input
							class="checkbox"
							id="require_files"
							name="require_files"
							type="checkbox"
							bind:checked={require_files}
						/>
					</div>
					<div>
						<label class="label mt-4" for="require_repo">Link to a repository (e.g. GitHub)</label>
						<input
							class="checkbox"
							id="require_repo"
							name="require_repo"
							type="checkbox"
							bind:checked={require_repo}
						/>
					</div>
					<div>
						<label class="label mt-4" for="require_url">Link to a website</label>
						<input
							class="checkbox"
							id="require_url"
							name="require_url"
							type="checkbox"
							bind:checked={require_url}
						/>
					</div>
					<div>
						<label class="label mt-4" for="require_audio">Link to an audio recording</label>
						<input
							class="checkbox"
							id="require_audio"
							name="require_audio"
							type="checkbox"
							bind:checked={require_audio}
						/>
					</div>
					<div>
						<label class="label mt-4" for="require_video">Link to a video recording</label>
						<input
							class="checkbox"
							id="require_video"
							name="require_video"
							type="checkbox"
							bind:checked={require_video}
						/>
					</div>
				</fieldset>
				<!-- Submit -->
				<div>
					<input
						type="submit"
						class="btn btn-md variant-ghost-primary mt-4"
						value={loading ? 'Loading...' : 'Save'}
						disabled={loading}
					/>
				</div>
			</form>
		</div>
	</div>
</div>
