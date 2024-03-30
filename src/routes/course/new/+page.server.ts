import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const load = async ({ locals: { supabase, getSession } }) => {

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

  return { session, loggedInUser }
}

export const actions = {
  default: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data
    const formData = await request.formData();
    const name = formData.get('name');
    const code = formData.get('code');
    const description = formData.get('description');
    const link = formData.get('link');
    const start_date = formData.get('start_date');
    const end_date = formData.get('end_date');

    // upsert data to courses table
    const { data: course, error } = await supabase.from('courses').upsert({
      name,
      code,
      description,
      link,
      start_date,
      end_date,
      created_at: new Date(),
      updated_at: new Date(),
    }).select().single()

    if (error) {
      return fail(500, {
        name, code, description, link, start_date, end_date,
      })
    }
    
    // redirect to course page
    const course_url: string = "/course/" + course.number;
    return redirect(303, course_url);

  }
} satisfies Actions;