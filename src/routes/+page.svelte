<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import PageTitle from '$lib/components/PageTitle.svelte';

	export let data;

	let { supabase } = data;
	$: ({ supabase } = data);

	// redirect to dashboard when signed in with email
	supabase.auth.onAuthStateChange((event, session) => {
		if (event === 'SIGNED_IN') {
			window.location.href = '/dashboard';
		}
	});
</script>

<PageTitle title="Submissions" />

<main class="container h-full mx-auto relative pb-4">
	<header class="pt-4 md:pt-6 pb-4 sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
		<p class="px-4 pb-1">
			<span class="text-2xl md:text-3xl font-semibold">Welcome to</span>
		</p>
		<h1
			class="h1 font-bold px-4 py-1 bg-surface-50 dark:bg-surface-900 text-primary-600 dark:text-primary-400"
		>
			Submissions
		</h1>
	</header>
	<section class="flex flex-col px-4">
		<!-- Supabase Auth -->
		<div class="form w-full lg:w-2/3 mx-auto">
			<div class="flex flex-col sm:flex-row sm:pt-8 md:pt-16">
				<div class="sm:mr-4 sm:w-1/2">
					<p class="text-lg md:text-2xl pb-3 md:pb-4">
						<span class="font-bold text-primary-600 dark:text-primary-400">Submissions</span> is the
						online assignment submission and grading service for your course.
					</p>
					<p class="text-lg md:text-2xl pb-3 md:pb-4">
						Please sign in to <span class="font-bold text-primary-600 dark:text-primary-400"
							>Submissions</span
						> with your GitHub account.
					</p>
					<p class="text-lg md:text-2xl pb-3 md:pb-4">
						If you do not have a GitHub account, you can sign in or sign up with your email address.
					</p>
					<p class="text-lg md:text-2xl pb-3 md:pb-4">
						If this is your first visit to <span
							class="font-bold text-primary-600 dark:text-primary-400">Submissions</span
						>, you will need to enter your user details to create your account.
					</p>
				</div>
				<div
					class="sm:ml-4 w-full sm:w-1/2 rounded-lg border border-solid border-surface-400 dark:border-surface-500 px-2 divide-y divide-surface-400 dark:divide-surface-500"
				>
				<div id="auth-github">
					<Auth
						supabaseClient={data.supabase}
						redirectTo={`${data.url}/auth/callback`}
						appearance={{ theme: ThemeSupa }}
						theme="dark"
						providers={['github']}
						onlyThirdPartyProviders
						localization={{
							variables: {
								sign_in: {
									social_provider_text: 'Sign in with GitHub',
								}
							}
						}}
					/>
				</div>
				<div id="auth-email">
					<Auth
						supabaseClient={data.supabase}
						appearance={{ theme: ThemeSupa }}
						localization={{
							variables: {
								sign_in: {
									password_label: 'Password',
								},
								sign_up: {
									password_label: 'Create a password'
								}
							}
						}}
					/>
				</div>
				</div>
			</div>
		</div>
	</section>
</main>
