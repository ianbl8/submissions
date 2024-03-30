import { redirect } from "@sveltejs/kit";

export const load = async ({ params, locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get assignment from database
  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, number, name, code, description, link, rubric, release_at, due_at, late_at')
    .eq('number', params.aid)
    .single()

  // redirect if not a valid assignment  
  if (!assignment) {
    throw redirect(303, "/");
  }
    
  // get logged in user from database
  const { data: loggedInUser } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
    .eq('id', session.user.id)
    .single()

  return { session, assignment, loggedInUser }
}