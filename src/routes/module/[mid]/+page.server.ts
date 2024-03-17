import { redirect } from "@sveltejs/kit";

export const load = async ({ params, locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get module from database
  const { data: module } = await supabase
    .from('modules')
    .select('id, number, name, code, description, start_date, end_date')
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

  return { session, module, loggedInUser }
}