"use server";

import { isMyImagePath } from "@/lib/images";
import { REPORT_REASONS, type ReportReason } from "@/lib/reports";
import { createClient } from "@/lib/supabase/server";

export type ReportState = { error?: string; done?: boolean; fields?: Record<string, string> };

// 비매너 신고 — reportedId, productId 는 .bind 로 미리 넣어 둔다
export async function createReport(
  reportedId: string,
  productId: number | null,
  _prev: ReportState,
  formData: FormData,
): Promise<ReportState> {
  const reason = String(formData.get("reason") ?? "");
  const detail = String(formData.get("detail") ?? "").trim();
  const evidence = formData.getAll("evidence").map(String);
  const fields = { reason, detail };

  if (!REPORT_REASONS.includes(reason as ReportReason)) {
    return { error: "신고 사유를 골라 주세요.", fields };
  }
  if (detail.length < 10 || detail.length > 1000) {
    return { error: "어떤 일이 있었는지 10~1000자로 적어 주세요.", fields };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return { error: "로그인이 풀렸어요. 다시 로그인해 주세요.", fields };
  if (userId === reportedId) return { error: "나 자신은 신고할 수 없어요. 🍠", fields };
  if (evidence.length > 5 || evidence.some((path) => !isMyImagePath(path, userId))) {
    return { error: "증거 사진 정보가 이상해요. 다시 올려 주세요.", fields };
  }

  const { error } = await supabase
    .from("goguma_reports")
    .insert({ reported_id: reportedId, product_id: productId, reason, detail, evidence });
  if (error) return { error: `신고를 접수하다 문제가 생겼어요: ${error.message}`, fields };

  return { done: true };
}
