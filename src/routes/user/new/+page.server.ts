import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const load = async ({ locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get user from database
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

    // get form data, only accept student_id for students
    const formData = await request.formData();
    const forename = formData.get('forename');
    const surname = formData.get('surname');
    const email = formData.get('email');
    let role = formData.get('role');
    let status = formData.get('status');
    let student_id = formData.get('student_id');
    if (role != 'Student') {
      student_id = null;
    }

    // if no existing users, make the first user's role 'Admin' and status 'Active' by default
    const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (!count) {
      role = 'Admin';
      status = 'Active';
    }

    // upsert data to users table
    const { data: user, error } = await supabase.from('users').upsert({
      id: session?.user.id,
      forename,
      surname,
      email,
      role,
      status,
      student_id,
      created_at: new Date(),
      updated_at: new Date(),
    }).select().single()

    if (error) {
      return fail(500, {
        forename, surname, email, role, status, student_id,
      })
    }

    // redirect to user page
    const user_url: string = "/user/" + user.number;
    return redirect(303, user_url);

  }
} satisfies Actions;