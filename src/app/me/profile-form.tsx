"use client";

import { useActionState, useState } from "react";
import { updateProfile, type ProfileFormState } from "./actions";
import { Field, FormMessage, SubmitButton, TextAreaField } from "@/components/form-ui";
import { ImagePicker } from "@/components/image-picker";
import { RegionSelect } from "@/components/region-select";
import { BUCKETS } from "@/lib/images";
import type { Profile } from "@/lib/auth";
import { parseRegion } from "@/lib/regions";

// 내 정보 수정 폼: 프로필 사진, 닉네임, 동네, 자기소개
export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(updateProfile, {});
  const values = state.fields ?? { nickname: profile.nickname, bio: profile.bio, ...parseRegion(profile.neighborhood) };
  const [bioLength, setBioLength] = useState(values.bio.length);

  return (
    <form action={formAction} className="space-y-4">
      <ImagePicker
        bucket={BUCKETS.avatar}
        name="avatar"
        max={1}
        label="프로필 사진"
        hint="없으면 고구마 얼굴로 보여요 · 5MB 이하"
        defaultImages={profile.avatar_path ? [profile.avatar_path] : []}
      />
      <Field
        label="닉네임"
        name="nickname"
        minLength={2}
        maxLength={12}
        defaultValue={values.nickname}
        hint="2~12자"
        required
      />
      {/* GPS 인증으로 동네가 바뀌면 다시 그려지도록 key 를 동네로 */}
      <RegionSelect key={profile.neighborhood} defaultValue={values} />
      <TextAreaField
        label="자기소개"
        name="bio"
        rows={4}
        maxLength={300}
        placeholder={"어떤 이웃인지 소개해 주세요.\n예: 수표동 10년 차 군고구마 장인이에요 🍠"}
        defaultValue={values.bio}
        onChange={(e) => setBioLength(e.target.value.length)}
        hint={`${bioLength} / 300자`}
      />

      <FormMessage error={state.error} message={state.message} />
      <SubmitButton pending={pending}>내 정보 저장 🍠</SubmitButton>
    </form>
  );
}
