<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import type { Levels, Areas } from '$lib/types/Rubric';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import sanitizeHtml from 'sanitize-html';
	import Plus from '$lib/components/icons/Plus.svelte';
	import Minus from '$lib/components/icons/Minus.svelte';

	export let data: PageData;
	export let form: ActionData;

	let { session, supabase, loggedInUser } = data;
	$: ({ session, supabase, loggedInUser } = data);

	let newAssignmentForm: HTMLFormElement;
	let loading = false;
	let name: string = '';
	let code: string = '';
	let description: string = '';
	let link: string = '';
	let release_at: string = '';
	let due_at: string = '';
	let late_at: string = '';

	// rubric object properties
	let total_marks: number = 100;
	let levels: Levels = [
		{ name: '', min_marks: 0, max_marks: 39 },
		{ name: '', min_marks: 40, max_marks: 49 },
		{ name: '', min_marks: 50, max_marks: 59 },
		{ name: '', min_marks: 60, max_marks: 69 },
		{ name: '', min_marks: 70, max_marks: 100 }
	];
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
	let show_levels_marks: boolean = true;
	let areas: Areas = [
		{ name: '', marks: 20, descriptors: [] },
		{ name: '', marks: 20, descriptors: [] },
		{ name: '', marks: 20, descriptors: [] },
		{ name: '', marks: 20, descriptors: [] },
		{ name: '', marks: 20, descriptors: [] }
	];
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
	let require_self_assessment: boolean = true;
	let require_files: boolean = false;
	let require_repo: boolean = false;
	let require_url: boolean = false;
	let require_audio: boolean = false;
	let require_video: boolean = false;

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

		// update levels and areas arrays, and description using Quill input
		newAssignmentForm = document.querySelector('form')!;
		newAssignmentForm.addEventListener('formdata', (event: FormDataEvent) => {
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

<PageTitle title="New assignment" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400"
				>Assignment</span
			>
		</p>
		<h1 class="h1 font-semibold px-4 py-1 bg-surface-50 dark:bg-surface-900">
			New assignment
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
	<section class="flex flex-col px-4">
		<!-- New assignment form -->
		<div class="form w-full mx-auto">
			<form id="form" method="POST" use:enhance={handleSubmit} bind:this={newAssignmentForm}>
				<!-- Details -->
				<div class="flex flex-col md:flex-row">
					<div class="grow md:basis-2/3 md:mr-4">
						<label class="label mt-4" for="name">Assignment name (required)</label>
						<input
							class="input"
							id="name"
							name="name"
							type="text"
							value={form?.name ?? name}
							required
						/>
					</div>
					<div class="grow md:basis-1/3 md:ml-4">
						<label class="label mt-4" for="code">Assignment code (required)</label>
						<input
							class="input"
							id="code"
							name="code"
							type="text"
							value={form?.code ?? code}
							required
						/>
					</div>
				</div>
				<div>
					<label class="label mt-4" for="description">Description (required)</label>
					<div id="description" class="rounded-b-lg" />
					<!-- Quill input -->
				</div>
				<div>
					<label class="label mt-4" for="link"
						>Link to assignment on course website (required)</label
					>
					<input
						class="input"
						id="link"
						name="link"
						type="text"
						value={form?.link ?? link}
						required
					/>
				</div>
				<div class="flex flex-col md:flex-row">
					<div class="grow md:basis-1/3 md:mr-4">
						<label class="label mt-4" for="release_at">Assignment release date/time</label>
						<input
							class="input"
							id="release_at"
							name="release_at"
							type="datetime-local"
							value={form?.release_at ?? release_at}
							required
						/>
					</div>
					<div class="grow md:basis-1/3 md:mr-4 md:ml-4">
						<label class="label mt-4" for="due_at">Submissions due by date/time</label>
						<input
							class="input"
							id="due_at"
							name="due_at"
							type="datetime-local"
							value={form?.due_at ?? due_at}
							required
						/>
					</div>
					<div class="grow md:basis-1/3 md:ml-4">
						<label class="label mt-4" for="late_at">Open for late submissions until</label>
						<input
							class="input"
							id="late_at"
							name="late_at"
							type="datetime-local"
							value={form?.late_at ?? late_at}
							required
						/>
					</div>
				</div>
				<!-- Requirements -->
				<div class="pt-4">
					<fieldset
						class="border border-solid border-surface-400 dark:border-surface-500 rounded-lg px-4 py-4"
					>
						<legend class="font-semibold">Requirements</legend>
						<div class="flex flex-col md:flex-row">
							<div class="grow md:basis-1/3 px-4">
								<div>
									<label class="label mt-2" for="require_self_assessment"
										><input
											class="checkbox mr-1"
											id="require_self_assessment"
											name="require_self_assessment"
											type="checkbox"
											bind:checked={require_self_assessment}
										/> Self assessment using the rubric
									</label>
								</div>
								<div>
									<label class="label mt-2" for="require_files">
										<input
											class="checkbox mr-1"
											id="require_files"
											name="require_files"
											type="checkbox"
											bind:checked={require_files}
										/> File uploads</label
									>
								</div>
							</div>
							<div class="grow md:basis-1/3 px-4">
								<div>
									<label class="label mt-2" for="require_repo"
										><input
											class="checkbox mr-1"
											id="require_repo"
											name="require_repo"
											type="checkbox"
											bind:checked={require_repo}
										/> Link to a repository (e.g. GitHub)</label
									>
								</div>
								<div>
									<label class="label mt-2" for="require_url"
										><input
											class="checkbox mr-1"
											id="require_url"
											name="require_url"
											type="checkbox"
											bind:checked={require_url}
										/> Link to a website</label
									>
								</div>
							</div>
							<div class="grow md:basis-1/3 px-4">
								<div>
									<label class="label mt-2" for="require_audio"
										><input
											class="checkbox mr-1"
											id="require_audio"
											name="require_audio"
											type="checkbox"
											bind:checked={require_audio}
										/> Link to an audio recording</label
									>
								</div>
								<div>
									<label class="label mt-2" for="require_video"
										><input
											class="checkbox mr-1"
											id="require_video"
											name="require_video"
											type="checkbox"
											bind:checked={require_video}
										/> Link to a video recording</label
									>
								</div>
							</div>
						</div>
					</fieldset>
				</div>
				<!-- Rubric -->
				<div class="mt-4 pt-4">
					<h3 class="h3 font-semibold">Rubric</h3>
				</div>
				<div class="flex flex-col md:flex-row">
					<div class="basis-1/2 md:mr-4">
						<div class="flex items-center pb-4">
							<label class="label basis-2/3" for="total_marks"
								>Total marks available <span class="hidden sm:inline">(e.g. 100 marks)</span></label
							>
							<input
								class="input basis-1/3"
								id="total_marks"
								name="total_marks"
								type="number"
								value={form?.total_marks ?? total_marks}
							/>
						</div>
						<fieldset
							class="border border-solid border-surface-400 dark:border-surface-500 rounded-lg px-4 py-4"
						>
							<legend class="font-semibold">Levels</legend>
							<div class="flex items-center">
								Number of levels: <span class="font-bold text-lg pl-2">{levels.length}</span>
								&nbsp;&nbsp;&nbsp;
								{#if levels.length < 7}
									<button
										class="btn-icon btn-sm variant-ghost-secondary mx-2"
										on:click|preventDefault={addLevel}><Plus /></button
									>
								{:else}
									<button
										class="btn-icon btn-sm variant-ghost-secondary mx-2"
										on:click|preventDefault={addLevel}
										disabled><Plus /></button
									>
								{/if}
								{#if levels.length > 2}
									<button
										class="btn-icon btn-sm variant-ghost-secondary mx-2"
										on:click|preventDefault={removeLevel}><Minus /></button
									>
								{:else}
									<button
										class="btn-icon btn-sm variant-ghost-secondary mx-2"
										on:click|preventDefault={removeLevel}
										disabled><Minus /></button
									>
								{/if}
							</div>
							{#each range(1, levels.length) as l, i}
								<p class="font-semibold mt-4">Level {l}</p>
								<div class="flex items-center mt-2 gap-4 sm:gap-8">
									<div class="flex flex-col basis-1/2">
										<label class="label" for="levels[{i}].name">Name</label>
										<input
											class="input"
											id="levels[{i}].name"
											name="levels[{i}].name"
											type="text"
											bind:value={levels[i].name}
										/>
									</div>
									<div class="flex flex-col basis-1/4">
										<label class="label" for="levels[{i}].min_marks"
											>Min <span class="hidden sm:inline"> marks</span></label
										>
										<input
											class="input"
											id="levels[{i}].min_marks"
											name="levels[{i}].min_marks"
											type="number"
											bind:value={levels[i].min_marks}
										/>
									</div>
									<div class="flex flex-col basis-1/4">
										<label class="label" for="levels[{i}].max_marks"
											>Max <span class="hidden sm:inline"> marks</span></label
										>
										<input
											class="input"
											id="levels[{i}].max_marks"
											name="levels[{i}].max_marks"
											type="number"
											bind:value={levels[i].max_marks}
										/>
									</div>
								</div>
							{/each}
							<div>
								<label class="label mt-4" for="show_levels_marks"
									><input
										class="checkbox mr-1"
										id="show_levels_marks"
										name="show_levels_marks"
										type="checkbox"
										bind:checked={show_levels_marks}
									/> Show the mark range for each level</label
								>
							</div>
						</fieldset>
					</div>
					<div class="grow md:ml-4 pt-4 md:pt-16 lg:pt-[58px]">
						<fieldset
							class="border border-solid border-surface-400 dark:border-surface-500 rounded-lg px-4 py-4"
						>
							<legend class="font-semibold">Areas</legend>
							<div class="flex items-center">
								Number of areas: <span class="font-bold text-lg pl-2">{areas.length}</span>
								&nbsp;&nbsp;&nbsp;
								{#if areas.length < 7}
									<button
										class="btn-icon btn-sm variant-ghost-secondary mx-2"
										on:click|preventDefault={addArea}><Plus /></button
									>
								{:else}
									<button
										class="btn-icon btn-sm variant-ghost-secondary mx-2"
										on:click|preventDefault={addArea}
										disabled><Plus /></button
									>
								{/if}
								{#if areas.length > 1}
									<button
										class="btn-icon btn-sm variant-ghost-secondary mx-2"
										on:click|preventDefault={removeArea}><Minus /></button
									>
								{:else}
									<button
										class="btn-icon btn-sm variant-ghost-secondary mx-2"
										on:click|preventDefault={removeArea}
										disabled><Minus /></button
									>
								{/if}
							</div>
							{#each range(1, areas.length) as a, i}
								<p class="font-semibold mt-4">Area {a}</p>
								<div class="flex items-center mt-2 gap-4 sm:gap-8">
									<div class="flex flex-col basis-3/4">
										<label class="label" for="areas[{i}].name">Name</label>
										<input
											class="input"
											id="areas[{i}].name"
											name="areas[{i}].name"
											type="text"
											bind:value={areas[i].name}
										/>
									</div>
									<div>
										<label class="label" for="areas[{i}].marks">Marks allowed</label>
										<input
											class="input"
											id="areas[{i}].marks"
											name="areas[{i}].marks"
											type="number"
											bind:value={areas[i].marks}
										/>
									</div>
								</div>
								{#each range(1, levels.length) as l, j}
									<div>
										<label class="label mt-4" for="areas[{i}].descriptors[{j}]"
											>Descriptors for {#if levels[j].name}<strong>{levels[j].name}</strong> (Level {l}){:else}Level
												{l}{/if}</label
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
					</div>
				</div>
			</form>
		</div>
	</section>
</main>
