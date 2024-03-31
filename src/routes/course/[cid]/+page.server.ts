import { redirect } from "@sveltejs/kit";

export const load = async ({ params, locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get course from database
  const { data: course } = await supabase
    .from('courses')
    .select('id, number, name, code, description, link, start_date, end_date')
    .eq('number', params.cid)
    .single()

  // redirect if not a valid course  
  if (!course) {
    throw redirect(303, "/");
  }

  // get modules for this course
  const { data: course_modules } = await supabase
    .from('courses')
    .select(`
      modules (
        id,
        name,
        code,
        number
      ), 
      courses_modules (
        module_level,
        module_credits
      ) 
    `)
    .eq('id', course.id)

  // get logged in user from database
  const { data: loggedInUser } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
    .eq('id', session.user.id)
    .single()

  return { session, course, course_modules, loggedInUser }
}