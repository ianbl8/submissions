import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const load = async ({ params, locals: { supabase, getSession } }) => {

  // if not logged in, redirect to landing page
  const session = await getSession();
  if (!session) {
    throw redirect(303, "/");
  }

  // get assignment from database
  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, number, name, code, description, rubric, link, release_at, due_at, late_at')
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

  // check for Admin or Tutor user role
  const authorisedUser = (loggedInUser?.role == 'Admin' || loggedInUser?.role == 'Tutor');
  if (!authorisedUser) {
    throw redirect(303, "/");
  }

  return { session, assignment, loggedInUser }
}

export const actions = {
  default: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;
    const release_at = formData.get('release_at') as string;
    const due_at = formData.get('due_at') as string;
    const late_at = formData.get('late_at') as string;

    const total_marks = Number(formData.get('total_marks'));
    const levels: { name: string, min_marks: number, max_marks: number }[] = JSON.parse(formData.get('levels') as string);
    const show_levels_marks = (formData.get('show_levels_marks') == 'on');
    const areas: { name: string, marks: number, descriptors: Array<string> }[] = JSON.parse(formData.get('areas') as string);
    const require_self_assessment = (formData.get('require_self_assessment') == 'on');
    const require_files = (formData.get('require_files') == 'on');
    const require_repo = (formData.get('require_repo') == 'on');
    const require_url = (formData.get('require_url') == 'on');
    const require_audio = (formData.get('require_audio') == 'on');
    const require_video = (formData.get('require_video') == 'on');

    // update data in assignments table
    const { data: assignment, error } = await supabase
      .from('assignments')
      .update({
        name,
        code,
        description,
        link,
        rubric: {
          total_marks,
          levels,
          show_levels_marks,
          areas,
          require_self_assessment,
          require_files,
          require_repo,
          require_url,
          require_audio,
          require_video
        },
          release_at,
        due_at,
        late_at,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return fail(500, {
        name, code, description, link, release_at, due_at, late_at, total_marks, show_levels_marks
      })
    }

    // redirect to assignment page
    const assignment_url: string = "/assignment/" + assignment.number;
    return redirect(303, assignment_url);
  }
} satisfies Actions;