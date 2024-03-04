import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const load = async ({ locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get user from database
  const { data: user } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
    .eq('id', session.user.id)
    .single()

  // redirect if not a valid user  
  if (!user) {
    throw redirect(303, "/");
  }
    
  // get logged in user from database
  const { data: loggedInUser } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
    .eq('id', session.user.id)
    .single()

  // check for current user, or for Admin or Tutor user role
  const currentUser = (user?.id == loggedInUser?.id);
  const authorisedUser = (loggedInUser?.role == 'Admin');
  if (!currentUser && !authorisedUser) {
    throw redirect(303, "/");
  }

  return { session, user, loggedInUser }
}

export const actions = {
  default: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data, only accept student_id for students
    const formData = await request.formData();
    const forename = formData.get('forename');
    const surname = formData.get('surname');
    const email = formData.get('email');
    const role = formData.get('role');
    const status = formData.get('status');
    let student_id = formData.get('student_id');
    if (role != 'Student') {
      student_id = null;
    }

    // upsert data to users table
    const { error } = await supabase.from('users').upsert({
      id: session?.user.id,
      forename,
      surname,
      email,
      role,
      status,
      student_id,
      updated_at: new Date(),
    })

    if (error) {
      return fail(500, {
        forename, surname, email, role, status, student_id,
      })
    }

    return { forename, surname, email, role, status, student_id, }
  }
} satisfies Actions;