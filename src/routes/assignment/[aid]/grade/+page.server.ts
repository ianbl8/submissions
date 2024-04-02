import { redirect } from "@sveltejs/kit";

export const load = async ({ params, locals: { supabase, getSession } }) => {

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

  // get submission form database if it exists
  const { data: assignment_submissions } = await supabase
    .from('submissions')
    .select()
    .eq('assignment_id', assignment.id)

  // get all student users
  // TODO: update to users_assignments to get registered students only
  const { data: students } = await supabase
    .from('users')
    .select()
    .eq('role', 'Student')
  
  return { session, assignment, assignment_submissions, students, loggedInUser }
}
