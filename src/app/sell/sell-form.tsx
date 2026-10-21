"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createProduct, type SellState } from "./actions";
import { Field, FormMessage, SelectField, SubmitButton, TextAreaField } from "@/components/form-ui";
import { CATEGORIES, DESCRIPTION_MAX, PRICE_MAX, TITLE_MAX } from "@/lib/products";

export function SellForm() {
  const [state, formAction, pending] = useActionState<SellState, FormData>(createProduct, {});

  // 등록에 성공하면 폼 대신 완료 안내만 보여 준다
  if (state.done) {
    const { title, price } = state.done;
    return (
      <div className="space-y-4 text-center">
        <p className="text-6xl">🎉🍠</p>
        <FormMessage
          message={`'${title}' (${price === 0 ? "나눔" : `${price.toLocaleString()}원`}) 판매글이 올라갔어요!`}
        />
        <Link
          href="/"
          className="inline-block font-display text-goguma-700 underline decoration-flesh-400 decoration-4 underline-offset-4"
        >
          홈으로 가기
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Field
        label="제목"
        name="title"
        placeholder="예: 해남 꿀고구마 1박스 (3kg)"
        minLength={2}
        maxLength={TITLE_MAX}
        defaultValue={state.fields?.title}
        hint={`2~${TITLE_MAX}자`}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="카테고리" name="category" defaultValue={state.fields?.category ?? ""} required>
          <option value="" disabled>
            골라 주세요
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
        <Field
          label="가격 (원)"
          name="price"
          type="number"
          inputMode="numeric"
          min={0}
          max={PRICE_MAX}
          step={1}
          placeholder="15000"
          defaultValue={state.fields?.price}
          hint="0원으로 적으면 '나눔'이에요 🎁"
          required
        />
      </div>
      <TextAreaField
        label="자세한 설명"
        name="description"
        rows={7}
        placeholder={"상품 상태, 구매 시기, 거래 장소 등을 적어 주세요.\n달콤하게 적을수록 잘 팔려요 🍯"}
        minLength={10}
        maxLength={DESCRIPTION_MAX}
        defaultValue={state.fields?.description}
        hint={`10~${DESCRIPTION_MAX}자`}
        required
      />

      <FormMessage error={state.error} />

      <SubmitButton pending={pending}>판매글 올리기 🍠</SubmitButton>
    </form>
  );
}
