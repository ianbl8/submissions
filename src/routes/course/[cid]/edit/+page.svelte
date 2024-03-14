<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { PageData, ActionData } from './$types';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData;

	let { session, supabase, course, loggedInUser } = data;
	$: ({ session, supabase, course, loggedInUser } = data);

	let editCourseForm: HTMLFormElement;
	let loading = false;
	let id: string = course.id;
	let name = course.name;
	let code = course.code;
	let start_date = course.start_date;
	let end_date = course.end_date;

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

<PageTitle title="Edit: {course.name} ({course.code})" />

<div class="container h-full mx-auto">
	<!-- Page name and route -->
	<div class="pt-8 pb-4">
		<h1 class="text-4xl font-semibold">Edit course: {course.name} ({course.code})</h1>
		<h3 class="h3 py-1 mt-4">Please update the course details</h3>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- Course details form -->
		<div class="form">
			<form method="POST" use:enhance={handleSubmit} bind:this={editCourseForm}>
				<input id="id" name="id" type="hidden" value={id} />
				<div>
					<label class="label mt-4" for="name">Course name</label>
					<input class="input" id="name" name="name" type="text" value={form?.name ?? name} required />
				</div>
				<div>
					<label class="label mt-4" for="code">Course code</label>
					<input class="input" id="code" name="code" type="text" value={form?.code ?? code} required/>
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
