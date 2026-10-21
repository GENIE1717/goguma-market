-- 고구마마켓 4단계: 판매글 사진
-- 사진 파일은 Storage 버킷에, 판매글에는 파일 경로("<글쓴이 id>/<파일이름>")만 최대 5개 저장한다.

alter table public.goguma_products
  add column images text[] not null default '{}'
    check (cardinality(images) <= 5);

-- 누구나 볼 수 있는(public) 사진 버킷. 한 장 5MB, 이미지 파일만.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('goguma-product-images', 'goguma-product-images', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- 올리기·지우기는 로그인한 사람이 "내 id" 폴더 안에서만
create policy "goguma-product-images: 내 폴더에만 올리기"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'goguma-product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "goguma-product-images: 내 사진만 지우기"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'goguma-product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
