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

	// set up Quill input
	onMount(async () => {
		const { default: Quill } = await import('quill');
		let descriptionInput: HTMLElement = document.getElementById("description")!;
		let quill = new Quill(descriptionInput, {
			modules: {
				toolbar: [
					['bold', 'italic'],
					['link', 'blockquote', 'code-block'],
					[{ list: 'ordered' }, { list: 'bullet' }],
				],
			},
			theme: 'snow',
		});

		// update description using Quill input
		newAssignmentForm = document.querySelector('form')!
		newAssignmentForm.addEventListener('formdata', (event: FormDataEvent) => {
			let html = quill.getSemanticHTML(0);
			description = sanitizeHtml(html, {
				allowedTags: [ 'p', 'br', 'strong', 'em', 'b', 'i', 'a', 'blockquote', 'pre', 'ol', 'ul', 'li' ],
			})
			event.formData.set('description', description);
		});
	});

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({result}) => {
			loading = false;

			// redirect to assignment page
			if (result.type === 'redirect') {
				goto(result.location);
			}
		}
	};
</script>

<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.3/dist/quill.snow.css" rel="stylesheet" />
</svelte:head>

<PageTitle title="New assignment" />

<div class="container h-full mx-auto">
	<!-- Page name and route -->
	<div class="pt-8 pb-4">
		<h1 class="text-4xl font-bold">New Assignment</h1>
		<h3 class="h3 py-1 mt-4">Please enter the assignment details</h3>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- New assignment form -->
		<div class="form">
			<form method="POST" use:enhance={handleSubmit} bind:this={newAssignmentForm}>
				<div>
					<label class="label mt-4" for="name">Assignment name</label>
					<input class="input" id="name" name="name" type="text" value={form?.name ?? name} required />
				</div>
				<div>
					<label class="label mt-4" for="code">Assignment code</label>
					<input class="input" id="code" name="code" type="text" value={form?.code ?? code} required/>
				</div>
				<div>
					<label class="label mt-4" for="description">Description</label>
					<div id="description" /><!-- Quill input -->
				</div>
				<div>
					<label class="label mt-4" for="link">Link to assignment</label>
					<input class="input" id="link" name="link" type="text" value={form?.link ?? link} required/>
				</div>
				<div>
					<label class="label mt-4" for="release_at">Release date/time</label>
					<input class="input" id="release_at" name="release_at" type="datetime-local" value={form?.release_at ?? release_at} required />
				</div>
				<div>
					<label class="label mt-4" for="due_at">Due date/time</label>
					<input class="input" id="due_at" name="due_at" type="datetime-local" value={form?.due_at ?? due_at} required />
				</div>
				<div>
					<label class="label mt-4" for="late_at">Open until date/time</label>
					<input class="input" id="late_at" name="late_at" type="datetime-local" value={form?.late_at ?? late_at} required />
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
