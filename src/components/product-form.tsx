"use client";

import { useActionState } from "react";
import type { ProductFormState } from "@/app/products/actions";
import { Field, FormMessage, SelectField, SubmitButton, TextAreaField } from "@/components/form-ui";
import { CATEGORIES, DESCRIPTION_MAX, PRICE_MAX, TITLE_MAX, type Product } from "@/lib/products";

type ProductAction = (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;

// 글쓰기·수정에서 같이 쓰는 판매글 폼. 저장에 성공하면 서버가 상세 페이지로 보내 준다.
export function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: ProductAction;
  product?: Pick<Product, "title" | "category" | "price" | "description">;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, {});
  // 에러로 돌아왔으면 방금 적은 값, 아니면 원래 글 내용
  const values = state.fields ?? {
    title: product?.title ?? "",
    category: product?.category ?? "",
    price: product ? String(product.price) : "",
    description: product?.description ?? "",
  };

  return (
    <form action={formAction} className="space-y-4">
      <Field
        label="제목"
        name="title"
        placeholder="예: 해남 꿀고구마 1박스 (3kg)"
        minLength={2}
        maxLength={TITLE_MAX}
        defaultValue={values.title}
        hint={`2~${TITLE_MAX}자`}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="카테고리" name="category" defaultValue={values.category} required>
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
          defaultValue={values.price}
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
        defaultValue={values.description}
        hint={`10~${DESCRIPTION_MAX}자`}
        required
      />

      <FormMessage error={state.error} />

      <SubmitButton pending={pending}>{submitLabel}</SubmitButton>
    </form>
  );
}
