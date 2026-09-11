/// <reference path="../deno.d.ts" />

import {
  createSupabaseAdminClient,
  getAuthenticatedUserId,
  getVerifiedChild,
  jsonResponse,
  optionsResponse,
  sendChildPush,
} from "../_shared/notifications.ts";

type NotifyChildPetGrownPayload = {
  childId?: string;
  loginCode?: string;
  nextLevel?: number;
  nextStage?: string;
  previousLevel?: number;
  previousStage?: string;
};

const getStageLabel = (stage?: string) => {
  switch (stage) {
    case "hatching":
      return "started hatching";
    case "baby":
      return "hatched into a baby pet";
    case "child":
      return "grew into a little guardian";
    case "teen":
      return "grew into a teen pet";
    case "adult":
      return "became an adult guardian";
    default:
      return "grew";
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return optionsResponse();
  }

  try {
    const { childId, loginCode, nextLevel, nextStage, previousLevel, previousStage } =
      (await req.json()) as NotifyChildPetGrownPayload;

    if (!childId) {
      return jsonResponse({ error: "Missing childId" }, 400);
    }

    if (previousStage && nextStage && previousStage === nextStage) {
      return jsonResponse({
        sent: false,
        reason: "Pet stage did not change",
      });
    }

    const supabase = createSupabaseAdminClient();
    const authenticatedParentId = loginCode ? null : await getAuthenticatedUserId(supabase, req);
    let verifiedChildFamilyId: string | null = null;

    if (loginCode) {
      const verifiedChild = await getVerifiedChild(supabase, { childId, loginCode });

      if (!verifiedChild) {
        return jsonResponse({ error: "Child not found" }, 404);
      }

      verifiedChildFamilyId = verifiedChild.family_id;
    }

    const { data: child, error: childError } = await supabase
      .from("children")
      .select("id, name, family_id, expo_push_token, notifications_permission_status")
      .eq("id", childId)
      .maybeSingle();

    if (childError) throw childError;

    if (!child?.family_id) {
      return jsonResponse({ error: "Child not found" }, 404);
    }

    if (verifiedChildFamilyId && verifiedChildFamilyId !== child.family_id) {
      return jsonResponse({ error: "Child not found" }, 404);
    }

    if (!verifiedChildFamilyId) {
      if (!authenticatedParentId) {
        return jsonResponse({ error: "Unauthorized" }, 401);
      }

      const { data: family, error: familyError } = await supabase
        .from("families")
        .select("parent_id")
        .eq("id", child.family_id)
        .maybeSingle();

      if (familyError) throw familyError;

      if (family?.parent_id !== authenticatedParentId) {
        return jsonResponse({ error: "Child not found" }, 404);
      }
    }

    if (
      child.notifications_permission_status &&
      child.notifications_permission_status !== "granted"
    ) {
      return jsonResponse({
        sent: false,
        reason: "Child notifications are not granted",
      });
    }

    const result = await sendChildPush({
      token: child.expo_push_token,
      title: "Your pet grew!",
      body: `${child.name ?? "Your pet"} ${getStageLabel(nextStage)}${
        nextLevel ? ` at level ${nextLevel}` : ""
      }. Tap to visit your pet.`,
      data: {
        childId: child.id,
        nextLevel,
        nextStage,
        previousLevel,
        previousStage,
        type: "pet_grown",
        url: "/(role-kid)/(settings)",
      },
    });

    return jsonResponse(result);
  } catch (error) {
    console.log("Notify child pet grown error:", error);

    return jsonResponse({ error: "Notification could not be sent" }, 500);
  }
});
