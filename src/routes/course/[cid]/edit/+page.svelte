<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import sanitizeHtml from 'sanitize-html';

	export let data: PageData;
	export let form: ActionData;

	let { session, supabase, course, loggedInUser } = data;
	$: ({ session, supabase, course, loggedInUser } = data);

	let editCourseForm: HTMLFormElement;
	let loading = false;
	let id: string = course.id;
	let { name, code, description, link, start_date, end_date } = course;

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

		if (course.description) {
			quill.clipboard.dangerouslyPasteHTML(course.description, 'user');
		}

		// update description using Quill input
		editCourseForm = document.querySelector('form')!;
		editCourseForm.addEventListener('formdata', (event: FormDataEvent) => {
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

			// redirect to course page
			if (result.type === 'redirect') {
				goto(result.location);
			}
		};
	};
</script>

<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.3/dist/quill.snow.css" rel="stylesheet" />
</svelte:head>

<PageTitle title="Edit: {name} ({code})" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400"
				>Course
			</span><span class="text-2xl md:text-3xl">&nbsp;{code} </span>
		</p>
		<h1 class="h1 font-semibold px-4 py-1 bg-surface-50 dark:bg-surface-900">
			Edit: {name}
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
		<!-- Course details form -->
		<div class="form w-full mx-auto">
			<form id="form" method="POST" use:enhance={handleSubmit} bind:this={editCourseForm}>
				<input id="id" name="id" type="hidden" value={id} />
				<div class="flex flex-col md:flex-row">
					<div class="grow md:basis-2/3 md:mr-4">
						<label class="label mt-4" for="name">Course name</label>
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
						<label class="label mt-4" for="code">Course code</label>
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
					<label class="label mt-4" for="description">Description</label>
					<div id="description" />
					<!-- Quill input -->
				</div>
				<div>
					<label class="label mt-4" for="link">Link to course website</label>
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
					<div class="grow md:basis-1/2 md:mr-4">
						<label class="label mt-4" for="start_date">Start date</label>
						<input
							class="input"
							id="start_date"
							name="start_date"
							type="date"
							value={form?.start_date ?? start_date}
							required
						/>
					</div>
					<div class="grow md:basis-1/2 md:ml-4">
						<label class="label mt-4" for="end_date">End date</label>
						<input
							class="input"
							id="end_date"
							name="end_date"
							type="date"
							value={form?.end_date ?? end_date}
							required
						/>
					</div>
				</div>
			</form>
		</div>
	</section>
</main>
