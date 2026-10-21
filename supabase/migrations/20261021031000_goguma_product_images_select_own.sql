-- Storage 의 remove() 는 지우기 전에 파일을 조회하므로 내 폴더 조회 권한도 필요하다
-- (사진 보기는 공개 주소로 하므로 이 규칙과 상관없다)
create policy "goguma-product-images: 내 사진 조회"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'goguma-product-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
