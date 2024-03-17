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

	let { session, supabase, module, loggedInUser } = data;
	$: ({ session, supabase, module, loggedInUser } = data);

	let editModuleForm: HTMLFormElement;
	let loading = false;
	let id: string = module.id;
	let name = module.name;
	let code = module.code;
	let description = module.description;
	let start_date = module.start_date;
	let end_date = module.end_date;

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

		if (module.description) {
			quill.clipboard.dangerouslyPasteHTML(module.description, 'user');
		}

		 // update description using Quill input
		editModuleForm = document.querySelector('form')!
		editModuleForm.addEventListener('formdata', (event: FormDataEvent) => {
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

			// redirect to module page
			if (result.type === 'redirect') {
				goto(result.location);
			}
		}
	};
</script>

<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.3/dist/quill.snow.css" rel="stylesheet" />
</svelte:head>

<PageTitle title="Edit: {module.name} ({module.code})" />

<div class="container h-full mx-auto">
	<div class="pt-8 pb-4">
		<h1 class="text-4xl font-semibold">Edit module: {module.name} ({module.code})</h1>
		<h3 class="h3 py-1 mt-4">Please update the module details</h3>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- Module details form -->
		<div class="form">
			<form method="POST" use:enhance={handleSubmit} bind:this={editModuleForm}>
				<input id="id" name="id" type="hidden" value={id} />
				<div>
					<label class="label mt-4" for="name">Module name</label>
					<input class="input" id="name" name="name" type="text" value={form?.name ?? name} required />
				</div>
				<div>
					<label class="label mt-4" for="code">Module code</label>
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
