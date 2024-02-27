<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data;
</script>

<div class="container h-full mx-auto">
	<!-- Page name -->
	<div class="pt-8 pb-4">
		<h1 class="text-4xl font-semibold">
			Welcome to <span class="font-bold text-primary-600 dark:text-primary-400">Submissions</span>
		</h1>
		<h3 class="h3 py-1 mt-4">Please log in or sign up</h3>
	</div>

	<!-- Page content -->
	<!-- Supabase Auth -->
	<div class="flex flex-col">
		<div class="py-3">
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
