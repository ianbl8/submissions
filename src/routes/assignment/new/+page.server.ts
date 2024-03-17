import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const load = async ({ locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get logged in user from database
  const { data: loggedInUser } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
    .eq('id', session.user.id)
    .single()

  return { session, loggedInUser }
}

export const actions = {
  default: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data
    const formData = await request.formData();
    const name = formData.get('name');
    const code = formData.get('code');
    const description = formData.get('description');
    const link = formData.get('link');
    const release_at = formData.get('release_at');
    const due_at = formData.get('due_at');
    const late_at = formData.get('late_at');

    // upsert data to assignments table
    const { data: assignment, error } = await supabase.from('assignments').upsert({
      name,
      code,
      description,
      link,
      release_at,
      due_at,
      late_at,
      created_at: new Date(),
      updated_at: new Date(),
    }).select().single()

    if (error) {
      return fail(500, {
        name, code, description, link, release_at, due_at, late_at,
      })
    }
    
    // redirect to assignment page
    const assignment_url: string = "/assignment/" + assignment.number;
    return redirect(303, assignment_url);

  }
} satisfies Actions;