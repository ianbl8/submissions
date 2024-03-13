import { redirect } from "@sveltejs/kit";

export const load = async ({ locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get user from database
  const { data: users } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
  if (!users) {
    throw redirect(303, "/");
  }

  // get logged in user from database
  const { data: loggedInUser } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
    .eq('id', session.user.id)
    .single()

  // check for current user, or for Admin or Tutor user role
  const authorisedUser = (loggedInUser?.role == 'Admin');
  if (!authorisedUser) {
    throw redirect(303, "/");
  }

  return { session, users, loggedInUser }
}