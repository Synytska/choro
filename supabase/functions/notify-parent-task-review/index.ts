/// <reference path="../deno.d.ts" />

import {
  createSupabaseAdminClient,
  getVerifiedChild,
  jsonResponse,
  optionsResponse,
  sendParentPush,
} from "../_shared/notifications.ts";

type NotifyTaskReviewPayload = {
  childId?: string;
  loginCode?: string;
  taskId?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return optionsResponse();
  }

  try {
    const { childId, loginCode, taskId } = (await req.json()) as NotifyTaskReviewPayload;

    if (!childId || !loginCode || !taskId) {
      return jsonResponse({ error: "Missing childId, loginCode or taskId" }, 400);
    }

    const supabase = createSupabaseAdminClient();
    const child = await getVerifiedChild(supabase, { childId, loginCode });

    if (!child) {
      return jsonResponse({ error: "Child not found" }, 404);
    }

    const { data: task, error: taskError } = await supabase
      .from("child_tasks")
      .select("id, child_id, title, status")
      .eq("id", taskId)
      .eq("child_id", childId)
      .maybeSingle();

    if (taskError) throw taskError;

    if (!task || task.status !== "review") {
      return jsonResponse({ error: "Task is not waiting for review" }, 409);
    }

    const result = await sendParentPush({
      supabase,
      child,
      title: "Task waiting for review",
      body: `${child.name ?? "Your child"} finished ${task.title ?? "a task"}.`,
      data: {
        childId,
        taskId,
        type: "task_review",
        url: `/approve-task-modal?childId=${childId}&taskId=${taskId}`,
      },
    });

    return jsonResponse(result);
  } catch (error) {
    console.log("Notify parent task review error:", error);

    return jsonResponse({ error: "Notification could not be sent" }, 500);
  }
});
