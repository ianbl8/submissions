<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { goto } from '$app/navigation';
	import Quill from 'quill';
	import { onMount } from 'svelte';

	export let data: PageData;
	export let form: ActionData;

	let { session, supabase, loggedInUser } = data;
	$: ({ session, supabase, loggedInUser } = data);

	let newCourseForm: HTMLFormElement;
	let loading = false;
	let name: string = '';
	let code: string = '';
	let description: string = '';
	let start_date: string = '';
	let end_date: string = '';

	// set up Quill input
	let quill: Quill;

	onMount(() => {
		let descriptionInput: HTMLElement = document.getElementById("description")!;
		quill = new Quill(descriptionInput, {
			modules: {
				toolbar: [
					['bold', 'italic'],
					['link', 'blockquote', 'code-block'],
					[{ list: 'ordered' }, { list: 'bullet' }],
				],
			},
			theme: 'snow',
			placeholder: description,
		});

		// update description using Quill input
		newCourseForm = document.querySelector('form')!
		newCourseForm.addEventListener('formdata', (event: FormDataEvent) => {
			description = quill.getSemanticHTML(0);
			event.formData.set('description', description);
		});
	});

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({result}) => {
			loading = false;

			// redirect to course page
			if (result.type === 'redirect') {
				goto(result.location);
			}
		}
	};
</script>

<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.3/dist/quill.snow.css" rel="stylesheet" />
</svelte:head>

<PageTitle title="New course" />

<div class="container h-full mx-auto">
	<div class="pt-8 pb-4">
		<h1 class="text-4xl font-bold">New Course</h1>
		<h3 class="h3 py-1 mt-4">Please enter the course details</h3>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- New course form -->
		<div class="form">
			<form method="POST" use:enhance={handleSubmit} bind:this={newCourseForm}>
				<div>
					<label class="label mt-4" for="name">Course name</label>
					<input class="input" id="name" name="name" type="text" value={form?.name ?? name} required />
				</div>
				<div>
					<label class="label mt-4" for="code">Course code</label>
					<input class="input" id="code" name="code" type="text" value={form?.code ?? code} required/>
				</div>
				<div>
					<label class="label mt-4" for="description">Description</label>
					<div id="description" /><!-- Quill input -->
				</div>
				<div>
					<label class="label mt-4" for="start_date">Start date</label>
					<input class="input" id="start_date" name="start_date" type="date" value={form?.start_date ?? start_date} required />
				</div>
				<div>
					<label class="label mt-4" for="end_date">End date</label>
					<input class="input" id="end_date" name="end_date" type="date" value={form?.end_date ?? end_date} required />
				</div>
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
