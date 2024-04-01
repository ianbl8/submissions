import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";


export const load = async ({ params, locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get module from database
  const { data: module } = await supabase
    .from('modules')
    .select('id, number, name, code, description, link, start_date, end_date')
    .eq('number', params.mid)
    .single()

  // redirect if not a valid module  
  if (!module) {
    throw redirect(303, "/");
  }

  // get assignments for this module
  const { data: module_assignments } = await supabase
    .from('modules')
    .select(`
      assignments (
        id,
        name,
        code,
        number
      ), 
      modules_assignments (
        assignment_weighting
      ) 
    `)
    .eq('id', module.id)

  // get all other assignments (to allow adding to this module)
  // https://stackoverflow.com/questions/21987909/how-to-get-the-difference-between-two-arrays-of-objects-in-javascript
  const { data: all_assignments } = await supabase
    .from('assignments')
    .select('id, number, name, code')
  const filter_out_assignments = module_assignments![0].assignments;
  const other_assignments = all_assignments?.filter(({ id: id_all }) => !filter_out_assignments.some(({ id: id_out }) => id_out === id_all));

  // get logged in user from database
  const { data: loggedInUser } = await supabase
    .from('users')
    .select('id, number, forename, surname, email, role, status, student_id')
    .eq('id', session.user.id)
    .single()

  return { session, module, module_assignments, other_assignments, loggedInUser }
}

export const actions = {
  addAssignment: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data
    const formData = await request.formData();
    const module_id = formData.get('module_id');
    const module_number = formData.get('module_number');
    const assignment_id = formData.get('assignment_id');
    const assignment_weighting = formData.get('assignment_weighting');

    // add entry in modules_assignments table
    const { data: module, error } = await supabase
      .from('modules_assignments')
      .upsert({
        module_id,
        assignment_id,
        assignment_weighting,
        created_at: new Date(),
        updated_at: new Date(),
      }).select().single()

    if (error) {
      return fail(500, {
        assignment_id, assignment_weighting
      })
    }

    // redirect to reload course page
    const course_url: string = "/module/" + module_number;
    return redirect(303, course_url);
  },

  removeAssignment: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data
    const formData = await request.formData();
    const module_id = formData.get('module_id');
    const module_number = formData.get('module_number');
    const assignment_id = formData.get('assignment_id');

    // delete entry in modules_assignments table
    const { data: module, error } = await supabase
      .from('modules_assignments')
      .delete()
      .eq('module_id', module_id)
      .eq('assignment_id', assignment_id)

    // redirect to reload module page
    const module_url: string = "/module/" + module_number;
    return redirect(303, module_url);
  }

} satisfies Actions;