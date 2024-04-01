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
  const { data: submission } = await supabase
    .from('submissions')
    .select()
    .eq('assignment_id', assignment.id)
    .eq('student_id', loggedInUser.id)
    .single()

  return { session, assignment, submission, loggedInUser }
}

export const actions = {
  default: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data
    const formData = await request.formData();
    const student_id = formData.get('student_id');
    const assignment_id = formData.get('assignment_id');
    const repo = formData.get('repo');
    const url = formData.get('url');
    const audio = formData.get('audio');
    const video = formData.get('video');
    const areas: { level: number, comment: string }[] = JSON.parse(formData.get('areas') as string);
    const complete = (formData.get('complete') == 'on');

    const { data: existingSubmission } = await supabase
    .from('submissions')
    .select()
    .eq('assignment_id', assignment_id)
    .eq('student_id', student_id)
    .single()
    let submission;
    let error;
    if (existingSubmission) {
      const { data: updateSubmission, updateError } = await supabase
        .from('submissions')
        .update({
          data: {
            repo,
            url,
            audio,
            video,
            areas
          },
          complete,
          updated_at: new Date(),
          })
        .eq('id', existingSubmission.id)
        .select()
        .single()
      submission = updateSubmission;
      error = updateError;
    } else {
      const { data: newSubmission, newError } = await supabase
      .from('submissions')
      .upsert({
        student_id,
        assignment_id,
        data: {
          repo,
          url,
          audio,
          video,
          areas
        },
        complete,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select()
      .single()
      submission = newSubmission;
      error = newError;
    }

    if (error) {
      return fail(500, {
        repo, url, audio, video, areas, complete
      })
    }

    console.log(submission);
    return submission;
  }
}