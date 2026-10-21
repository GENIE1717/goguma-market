"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createReport, type ReportState } from "./actions";
import { FormMessage, SelectField, SubmitButton, TextAreaField } from "@/components/form-ui";
import { ImagePicker } from "@/components/image-picker";
import { BUCKETS } from "@/lib/images";
import { REPORT_REASONS } from "@/lib/reports";

export function ReportForm({ reportedId, productId }: { reportedId: string; productId: number | null }) {
  const [state, formAction, pending] = useActionState<ReportState, FormData>(
    createReport.bind(null, reportedId, productId),
    {},
  );

  if (state.done) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-6xl">🚨🍠</p>
        <FormMessage message="신고가 접수됐어요. 알려 주셔서 고마워요! 고구마 경비대가 살펴볼게요." />
        <Link href="/" className="inline-block font-display text-goguma-700 underline decoration-flesh-400 decoration-4 underline-offset-4">
          홈으로 가기
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <SelectField label="신고 사유" name="reason" defaultValue={state.fields?.reason ?? ""} required>
        <option value="" disabled>
          골라 주세요
        </option>
        {REPORT_REASONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </SelectField>
      <TextAreaField
        label="어떤 일이 있었나요?"
        name="detail"
        rows={6}
        minLength={10}
        maxLength={1000}
        placeholder={"언제, 어떤 일이 있었는지 자세히 적어 주세요.\n예: 약속 장소에 30분 기다렸는데 연락 없이 안 나왔어요."}
        defaultValue={state.fields?.detail}
        hint="10~1000자"
        required
      />
      <ImagePicker
        bucket={BUCKETS.evidence}
        name="evidence"
        max={5}
        label="증거 사진"
        hint="채팅 캡처, 물건 사진 등 · 신고한 나만 볼 수 있어요 · 한 장 5MB 이하"
      />

      <FormMessage error={state.error} />
      <SubmitButton pending={pending}>🚨 신고하기</SubmitButton>
    </form>
  );
}
