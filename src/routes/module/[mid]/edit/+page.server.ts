import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const load = async ({ params, locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get module from database
  const { data: module } = await supabase
    .from('modules')
    .select('id, number, name, code, description, link, start_date, end_date')
    .eq('number', params.mid)
    .single()

  // redirect if not a valid module  
  if (!module) {
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

  return { session, module, loggedInUser }
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
    const link = formData.get('link') as string;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;

    // update data in modules table
    const { data: module, error } = await supabase
      .from('modules')
      .update({
        name,
        code,
        description,
        link,
        start_date,
        end_date,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return fail(500, {
        name, code, description, link, start_date, end_date,
      })
    }

    // redirect to module page
    const module_url: string = "/module/" + module.number;
    return redirect(303, module_url);
  }
} satisfies Actions;