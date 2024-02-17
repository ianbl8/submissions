<div class="container h-full mx-auto">
	<!-- Page name and route -->
	<div class="pt-8 pb-4">
		<h1 class="text-4xl font-bold">Dashboard</h1>
		<h2 class="text-2xl font-semibold">
			<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
				/dashboard
			</span>
		</h2>
	</div>

	<!-- Page content -->
	<div class="flex flex-col">

		<!-- Section -->
		<div class="py-3">
			<h3 class="h3 py-1">User</h3>
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T S R
				</span>
			</p>
			<p class="py-1">User details</p>
			<p class="py-1">
				Link to view/edit user details:
				<a
					href="/user/uid"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/user/[uid]
				</a>
			</p>
			<!-- Sub section -->
			<hr />
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A
				</span>
			</p>
			<p class="py-1">
				Link to user admin:
				<a
					href="/user/admin"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/user/admin
				</a>
			</p>
		</div>

		<!-- Section -->
		<div class="py-3">
			<h3 class="h3 py-1">Courses</h3>
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T S R
				</span>
			</p>
			<p class="py-1">List of courses</p>
			<p class="py-1">(probably one for a student, and multiple for others)</p>
			<p class="py-1">
				Link to each course:
				<a
					href="/course/cid"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/course/[cid]
				</a>
			</p>
			<!-- Sub section -->
			<hr />
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T
				</span>
			</p>
			<p class="py-1">
				Link to create new course:
				<a
					href="/course/new"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/course/new
				</a>
			</p>
		</div>

		<!-- Section -->
		<div class="py-3">
			<h3 class="h3 py-1">Assignments</h3>
			<p class="py-1">
				<span class="font-mono text-stone-700 dark:text-stone-300 bg-stone-300 dark:bg-stone-700">
					Roles: A T S R
				</span>
			</p>
			<p class="py-1">List of upcoming assignments</p>
			<p class="py-1">(text list in date order, or calendar)</p>
			<p class="py-1">
				Link to each assignment:
				<a
					href="/assignment/aid"
					class="font-mono text-tertiary-800 dark:text-tertiary-200 bg-tertiary-200 dark:bg-tertiary-800"
				>
					/assignment/[aid]
				</a>
			</p>
		</div>
		
	</div>
	
</div>
