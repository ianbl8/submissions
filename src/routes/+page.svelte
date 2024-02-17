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

	<!-- Page content -->
	<div class="flex flex-col">
		<!-- Section -->
		<div class="py-3">
			<h3 class="h3 py-1">Log in by email</h3>
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T S R
				</span>
			</p>
			<p class="py-1">
				Log in links to:
				<a
					href="/dashboard"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/dashboard
				</a>
			</p>
			<!-- Sub section -->
			<hr />
			<p class="py-1">
				Sign up links to:
				<a
					href="/user/new"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/user/new
				</a>
			</p>
		</div>

		<!-- Section -->
		<div class="py-3">
			<h3 class="h3 py-1">Log in with GitHub</h3>
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T S R
				</span>
			</p>
			<p class="py-1">
				Log in links to:
				<a
					href="/dashboard"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/dashboard
				</a>
			</p>
			<!-- Sub section -->
			<hr />
			<p class="py-1">
				First log in links to:
				<a
					href="/user/new"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/user/new
				</a>
			</p>
		</div>
	</div>
</div>
