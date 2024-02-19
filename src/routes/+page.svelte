<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;
</script>

<div class="container h-full mx-auto">
	<!-- Page name and route -->
	<div class="pt-8 pb-4">
		<h1 class="text-4xl font-bold">Log in page</h1>
		<h2 class="text-2xl font-semibold">
			<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
				/
			</span>
		</h2>
	</div>

	<!-- Page content -->
	<!-- Supabase Auth -->
	<div class="flex flex-col">
		<div class="py-3 ">
			<Auth
				supabaseClient={data.supabase}
				redirectTo={`${data.url}/auth/callback`}
				appearance={{ theme: ThemeSupa }}
				theme="dark"
				providers={['github']}
			/>
		</div>
	</div>

</div>
