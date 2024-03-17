import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const load = async ({ params, locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get course from database
  const { data: course } = await supabase
    .from('courses')
    .select('id, number, name, code, description, start_date, end_date')
    .eq('number', params.cid)
    .single()

  // redirect if not a valid course  
  if (!course) {
    throw redirect(303, "/");
  }

  // get logged in user from database
  const { data: loggedInUser } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
    .eq('id', session.user.id)
    .single()

  // check for Admin or Tutor user role
  const authorisedUser = (loggedInUser?.role == 'Admin' || loggedInUser?.role == 'Tutor');
  if (!authorisedUser) {
    throw redirect(303, "/");
  }

  return { session, course, loggedInUser }
}

export const actions = {
  default: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const description = formData.get('description') as string;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;

    // update data in courses table
    const { error } = await supabase
      .from('courses')
      .update({
        name,
        code,
        description,
        start_date,
        end_date,
        updated_at: new Date(),
      })
      .eq('id', id)

    if (error) {
      return fail(500, {
        name, code, description, start_date, end_date,
      })
    }

    return { name, code, description, start_date, end_date, }
  }
} satisfies Actions;