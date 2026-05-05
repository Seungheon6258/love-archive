-- ============================================================
-- 500일 기념 앱 Supabase 스키마 설정
-- Supabase Dashboard > SQL Editor 에서 실행하세요
-- ============================================================

-- 1. 사진 테이블
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  category integer not null check (category between 1 and 6),
  url text not null,
  caption text,
  taken_at timestamptz,
  uploaded_at timestamptz default now()
);

-- 2. 편지 테이블 (단일 편지, upsert 방식)
create table if not exists letters (
  id text primary key default 'letter-500',
  title text not null default '나에게 온 편지',
  content text not null default '',
  author text not null default '당신의 소중한 사람',
  written_at timestamptz default now()
);

-- 3. 기본 편지 데이터 삽입
insert into letters (id, title, content, author)
values (
  'letter-500',
  '나에게 온 편지',
  '사랑하는 당신에게,

우리가 처음 만났던 그 날을 기억하나요?
설레는 마음으로 손을 잡던 그 순간이
아직도 생생하게 남아있어요.

500일이라는 시간 동안
기쁠 때도, 힘들 때도
항상 곁에 있어줘서 고마워요.

당신과 함께라면
앞으로의 500일도,
그 이후의 시간도
모두 아름다울 것 같아요.

오늘 이 특별한 날,
진심을 담아 전해요.

사랑해요. 💕

– 당신의 소중한 사람이',
  '당신의 소중한 사람'
)
on conflict (id) do nothing;

-- 4. RLS 활성화 (공개 읽기/쓰기 허용 — 커플 전용 비공개 배포 용도)
alter table photos enable row level security;
alter table letters enable row level security;

create policy "공개 읽기" on photos for select using (true);
create policy "공개 삽입" on photos for insert with check (true);
create policy "공개 삭제" on photos for delete using (true);

create policy "공개 읽기" on letters for select using (true);
create policy "공개 수정" on letters for update using (true);
create policy "공개 삽입" on letters for insert with check (true);

-- 5. Storage 버킷 생성 (SQL Editor에서는 아래처럼, 또는 Dashboard Storage 탭에서 직접 생성)
insert into storage.buckets (id, name, public)
values ('love-photos', 'love-photos', true)
on conflict (id) do nothing;

-- Storage 정책: 공개 읽기/업로드/삭제
create policy "공개 읽기" on storage.objects for select using (bucket_id = 'love-photos');
create policy "공개 업로드" on storage.objects for insert with check (bucket_id = 'love-photos');
create policy "공개 삭제" on storage.objects for delete using (bucket_id = 'love-photos');
