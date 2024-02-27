import { redirect } from "@sveltejs/kit";

export const load = async ({ locals: { supabase, getSession } }) => {

  const session = await getSession();

  // if not logged in, redirect to landing page
  if (!session) {
    throw redirect(303, "/");
  }

  // get user from database
  const { data: user } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
    .eq('id', session.user.id)
    .single()

  // if user not in database, redirect to new user page
  if (!user) {
    throw redirect(303, "/user/new");
  }
  
  return { session, user }
}
