-- 동네를 "시도 시군구 읍면동" 전체로 저장하므로 길이 제한을 20 → 40자로 늘린다
-- 예: "충청북도 청주시 상당구 용담·명암·산성동" (22자)

alter table public.goguma_profiles drop constraint goguma_profiles_neighborhood_check;
alter table public.goguma_profiles
  add constraint goguma_profiles_neighborhood_check check (char_length(neighborhood) between 1 and 40);
