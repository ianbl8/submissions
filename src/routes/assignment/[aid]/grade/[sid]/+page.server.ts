import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

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
  if (loggedInUser?.role == 'Student') {
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

  // get submission from database
  const { data: submission } = await supabase
    .from('submissions')
    .select()
    .eq('number', params.sid)
    .single()

  // redirect if not a valid submission  
  if (!submission) {
    const assignment_url: string = "/assignment/" + params.aid + "/grade";
    throw redirect(303, assignment_url);
  }

  // get student
  const { data: student } = await supabase
    .from('users')
    .select()
    .eq('id', submission.student_id)
    .single()

  // get grade from database if it exists
  const { data: grading } = await supabase
    .from('grades')
    .select()
    .eq('submission_id', submission.id)
    .single()
  
  return { session, assignment, submission, student, grading, loggedInUser }
}

export const actions = {
  default: async ({ request, locals: { supabase, getSession } }) => {
    const session = await getSession();

    // get form data
    const formData = await request.formData();
    const grader_id = formData.get('grader_id');
    const submission_id = formData.get('submission_id');
    const areas: { level: number, grade: number, comment: string }[] = JSON.parse(formData.get('areas') as string);
    const feedback = formData.get('feedback');
    const grade = Number(formData.get('grade'));
    const complete = (formData.get('complete') == 'on');

    const { data: existingGrading } = await supabase
    .from('grades')
    .select()
    .eq('submission_id', submission_id)
    .eq('grader_id', grader_id)
    .single()
    
    let grading;
    let error;

    if (existingGrading) {
      const { data: updateGrading, error: updateError } = await supabase
        .from('grades')
        .update({
          data: {
            areas,
            feedback,
            grade
          },
          complete,
          updated_at: new Date(),
          })
        .eq('id', existingGrading.id)
        .select()
        .single()

      grading = updateGrading;
      error = updateError;
    } else {
      const { data: newGrading, error: newError } = await supabase
      .from('grades')
      .upsert({
        grader_id,
        submission_id,
        data: {
          areas,
          feedback,
          grade
        },
        complete,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select()
      .single()

      grading = newGrading;
      error = newError;
    }

    if (error) {
      return fail(500, {
        areas, complete, feedback, grade
      })
    }

    const { data: submission } = await supabase
    .from('submissions')
    .select('assignment_id')
    .eq('id', submission_id)
    .single()

    const { data: assignment } = await supabase
    .from('assignments')
    .select()
    .eq('id', submission?.assignment_id)
    .single()

    // redirect to assignment grading page
    const grading_url: string = "/assignment/" + assignment.number + "/grade";
    return redirect(303, grading_url);

  }
} satisfies Actions;