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

  // get all other modules (to allow adding to this course)
  // https://stackoverflow.com/questions/21987909/how-to-get-the-difference-between-two-arrays-of-objects-in-javascript
  const { data: all_modules } = await supabase
    .from('modules')
    .select('id, number, name, code')
  const filter_out_modules = course_modules![0].modules;
  const other_modules = all_modules?.filter(({ id: id_all }) => !filter_out_modules.some(({ id: id_out }) => id_out === id_all));

  // get logged in user from database
  const { data: loggedInUser } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
    .eq('id', session.user.id)
    .single()

  return { session, course, course_modules, other_modules, loggedInUser }
}

export const actions = {
  addModule: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data
    const formData = await request.formData();
    const course_id = formData.get('course_id');
    const course_number = formData.get('course_number');
    const module_id = formData.get('module_id');
    const module_level = formData.get('module_level');
    const module_credits = formData.get('module_credits');

    // update data in courses_modules table
    const { data: course, error } = await supabase
      .from('courses_modules')
      .upsert({
        course_id,
        module_id,
        module_level,
        module_credits,
        created_at: new Date(),
        updated_at: new Date(),
      }).select().single()

    if (error) {
      return fail(500, {
        module_id, module_level, module_credits
      })
    }

    // redirect to reload course page
    const course_url: string = "/course/" + course_number;
    return redirect(303, course_url);
  },

  removeModule: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data
    const formData = await request.formData();
    const course_id = formData.get('course_id');
    const course_number = formData.get('course_number');
    const module_id = formData.get('module_id');

    // delete entry in courses_modules table
    const { data: course, error } = await supabase
      .from('courses_modules')
      .delete()
      .eq('course_id', course_id)
      .eq('module_id', module_id)

    // redirect to reload course page
    const course_url: string = "/course/" + course_number;
    return redirect(303, course_url);
  }

} satisfies Actions;