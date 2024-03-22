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
    const release_at = formData.get('release_at');
    const due_at = formData.get('due_at');
    const late_at = formData.get('late_at');

    // rubric object
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

    // upsert data to assignments table
    const { data: assignment, error } = await supabase.from('assignments').upsert({
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
      created_at: new Date(),
      updated_at: new Date(),
    }).select().single()

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