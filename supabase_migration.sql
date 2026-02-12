-- Create the products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title jsonb not null,
  description jsonb not null,
  category text not null,
  image_url text not null,
  date jsonb not null,
  location jsonb not null,
  price jsonb not null
);

-- Turn on Row Level Security
alter table public.products enable row level security;

-- Create a policy that allows anyone to read products
create policy "Allow public read access"
  on public.products
  for select
  to public
  using (true);

-- Create a policy that allows authenticated users to insert/update/delete (for future admin use)
create policy "Allow authenticated insert"
  on public.products
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated update"
  on public.products
  for update
  to authenticated
  using (true);

create policy "Allow authenticated delete"
  on public.products
  for delete
  to authenticated
  using (true);

-- Insert Mock Data
INSERT INTO public.products (title, category, description, image_url, date, location, price)
VALUES
  (
    '{"ko": "경복궁 야간 개장 투어", "en": "Gyeongbokgung Night Tour", "ja": "景福宮夜間特別観覧", "zh": "景福宫夜间开放游览"}',
    'Travel',
    '{"ko": "달빛 아래 고궁을 거니는 특별한 경험. 전문 해설사와 함께하는 프라이빗 야간 투어입니다.", "en": "A special experience walking through the ancient palace under the moonlight. A private night tour with a professional guide.", "ja": "月明かりの下、古宮を歩く特別な体験。専門解説士と共にするプライベート夜間ツアーです。", "zh": "月光下漫步古宫的特别体验。与专业讲解员一起进行的私人夜间游览。"}',
    'https://images.unsplash.com/photo-1590635327202-b53050a49826?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "2023.10.01 - 2023.10.31", "en": "Oct 01 - Oct 31, 2023", "ja": "2023.10.01 - 2023.10.31", "zh": "2023.10.01 - 2023.10.31"}',
    '{"ko": "서울 종로구 사직로 161", "en": "161 Sajik-ro, Jongno-gu, Seoul", "ja": "ソウル鍾路区社稷路161", "zh": "首尔钟路区社稷路161"}',
    '{"ko": "30,000원", "en": "30,000 KRW", "ja": "30,000ウォン", "zh": "30,000韩元"}'
  ),
  (
    '{"ko": "전주 한옥마을 스테이", "en": "Jeonju Hanok Village Stay", "ja": "全州韓屋村ステイ", "zh": "全州韩屋村住宿"}',
    'Travel',
    '{"ko": "고즈넉한 한옥에서의 하룻밤. 전통 다도 체험과 비빔밥 만들기 클래스가 포함되어 있습니다.", "en": "A night in a quiet Hanok. Includes traditional tea ceremony experience and Bibimbap making class.", "ja": "静かな韓屋での一夜。伝統茶道体験とビビンバ作りクラスが含まれています。", "zh": "在宁静的韩屋过夜。包括传统茶道体验和制作拌饭课程。"}',
    'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "상시 운영", "en": "Always Open", "ja": "常時運営", "zh": "常年运营"}',
    '{"ko": "전북 전주시 완산구 기린대로 99", "en": "99 Girin-daero, Wansan-gu, Jeonju", "ja": "全北全州市完山区麒麟大路99", "zh": "全北全州市完山区麒麟大路99"}',
    '{"ko": "150,000원~", "en": "From 150,000 KRW", "ja": "150,000ウォン~", "zh": "150,000韩元起"}'
  ),
  (
    '{"ko": "K-POP 히스토리 전시", "en": "K-POP History Exhibition", "ja": "K-POPヒストリー展示", "zh": "K-POP历史展览"}',
    'Exhibition',
    '{"ko": "대한민국 대중음악의 역사를 한눈에 볼 수 있는 특별 기획전.", "en": "A special exhibition where you can see the history of Korean popular music at a glance.", "ja": "韓国大衆音楽の歴史を一目で見ることができる特別企画展。", "zh": "可以一目了然地看到韩国大众音乐历史的特别企划展。"}',
    'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "2023.11.01 - 2024.02.28", "en": "Nov 01, 2023 - Feb 28, 2024", "ja": "2023.11.01 - 2024.02.28", "zh": "2023.11.01 - 2024.02.28"}',
    '{"ko": "DDP 배움터 2층", "en": "DDP, 2nd Floor", "ja": "DDP学び場2階", "zh": "DDP学习中心2楼"}',
    '{"ko": "20,000원", "en": "20,000 KRW", "ja": "20,000ウォン", "zh": "20,000韩元"}'
  ),
  (
    '{"ko": "현대적으로 재해석한 판소리: 춘향", "en": "Modernized Pansori: Chunhyang", "ja": "現代的に再解釈したパンソリ：春香", "zh": "现代再诠释的板索里: 春香"}',
    'Performance',
    '{"ko": "전통 판소리에 미디어아트를 결합한 퓨전 국악 공연. 춘향전을 새로운 시각으로 풀어냅니다.", "en": "Fusion Korean traditional music performance combining traditional Pansori with media art. Retells Chunhyangjeon from a new perspective.", "ja": "伝統パンソリにメディアアートを融合させたフュージョン国楽公演。春香伝を新しい視点で解き明かします。", "zh": "结合传统板索里和媒体艺术的融合国乐演出。以新的视角诠释春香传。"}',
    'https://images.unsplash.com/photo-1514533248912-c96053de8a94?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "2023.10.15 - 2023.10.20", "en": "Oct 15 - Oct 20, 2023", "ja": "2023.10.15 - 2023.10.20", "zh": "2023.10.15 - 2023.10.20"}',
    '{"ko": "국립극장 해오름", "en": "National Theater of Korea", "ja": "国立劇場ヘオルム", "zh": "国立剧场"}',
    '{"ko": "50,000원", "en": "50,000 KRW", "ja": "50,000ウォン", "zh": "50,000韩元"}'
  ),
  (
    '{"ko": "청자 만들기 원데이 클래스", "en": "Celadon Making One-day Class", "ja": "青磁作りワンデークラス", "zh": "制作青瓷一日课程"}',
    'Art',
    '{"ko": "나만의 고려청자를 만들어보는 이색 체험. 물레 성형부터 조각까지 직접 경험해보세요.", "en": "A unique experience of making your own Goryeo Celadon. Experience everything from wheel throwing to carving.", "ja": "自分だけの高麗青磁を作ってみる異色の体験。ろくろ成形から彫刻まで直接体験してみてください。", "zh": "制作专属于自己的高丽青瓷的特色体验。请亲自体验从拉坯成型到雕刻。"}',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "매주 토요일", "en": "Every Saturday", "ja": "毎週土曜日", "zh": "每周六"}',
    '{"ko": "이천 도자기 마을", "en": "Icheon Ceramics Village", "ja": "利川陶磁器村", "zh": "利川陶瓷村"}',
    '{"ko": "80,000원", "en": "80,000 KRW", "ja": "80,000ウォン", "zh": "80,000韩元"}'
  ),
   (
    '{"ko": "달항아리 특별전: 비움의 미학", "en": "Moon Jar Exhibition: Aesthetics of Emptiness", "ja": "月壺特別展：空の美学", "zh": "月亮罐特别展: 空的各种美学"}',
    'Art',
    '{"ko": "조선 백자의 정수, 달항아리 30여 점을 한자리에서 만나는 전시.", "en": "An exhibition where you can meet about 30 Moon Jars, the essence of Joseon white porcelain, in one place.", "ja": "朝鮮白磁の精髄、月壺30点余りを一堂に会する展示。", "zh": "在一处欣赏朝鲜白瓷的精髓——30多件月亮罐的展览。"}',
    'https://images.unsplash.com/photo-1579402507856-3bb912df0f63?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "2023.09.01 - 2023.12.31", "en": "Sep 01 - Dec 31, 2023", "ja": "2023.09.01 - 2023.12.31", "zh": "2023.09.01 - 2023.12.31"}',
    '{"ko": "리움 미술관", "en": "Leeum Museum of Art", "ja": "リウム美術館", "zh": "Leeum美术馆"}',
    '{"ko": "15,000원", "en": "15,000 KRW", "ja": "15,000ウォン", "zh": "15,000韩元"}'
  ),
  (
    '{"ko": "뉴진스(NewJeans) 팝업스토어", "en": "NewJeans Pop-up Store", "ja": "NewJeansポップアップストア", "zh": "NewJeans快闪店"}',
    'Trend',
    '{"ko": "글로벌 대세 뉴진스의 공식 굿즈와 한정판 아이템을 만날 수 있는 팝업스토어.", "en": "A pop-up store where you can find official goods and limited edition items of the global trend NewJeans.", "ja": "グローバル大勢NewJeansの公式グッズと限定版アイテムに出会えるポップアップストア。", "zh": "可以见到全球大势NewJeans的官方周边商品和限量版商品的快闪店。"}',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "2023.10.20 - 2023.11.05", "en": "Oct 20 - Nov 05, 2023", "ja": "2023.10.20 - 2023.11.05", "zh": "2023.10.20 - 2023.11.05"}',
    '{"ko": "1F 팝업존", "en": "1F Pop-up Zone", "ja": "1F ポップアップゾーン", "zh": "1F 快闪区"}',
    '{"ko": "무료 입장", "en": "Free Admission", "ja": "入場無料", "zh": "免费入场"}'
  ),
  (
    '{"ko": "Y2K 레트로 카메라 기획전", "en": "Y2K Retro Camera Exhibition", "ja": "Y2Kレトロカメラ企画展", "zh": "Y2K复古相机企划展"}',
    'Trend',
    '{"ko": "다시 유행하는 필름 카메라와 빈티지 디카를 직접 체험하고 구매하세요.", "en": "Experience and purchase film cameras and vintage digital cameras that are back in fashion.", "ja": "再び流行しているフィルムカメラとヴィンテージデジカメを直接体験して購入してください。", "zh": "请亲自体验并购买重新流行的胶卷相机和复古数码相机。"}',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "2023.10.01 - 2023.10.31", "en": "Oct 01 - Oct 31, 2023", "ja": "2023.10.01 - 2023.10.31", "zh": "2023.10.01 - 2023.10.31"}',
    '{"ko": "1F 트렌드홀", "en": "1F Trend Hall", "ja": "1F トレンドホール", "zh": "1F 潮流馆"}',
    '{"ko": "가격 문의", "en": "Inquire for Price", "ja": "価格問い合わせ", "zh": "价格咨询"}'
  ),
  (
    '{"ko": "생활한복 F/W 컬렉션", "en": "Modern Hanbok F/W Collection", "ja": "生活韓服 F/Wコレクション", "zh": "生活韩服 F/W 系列"}',
    'Style',
    '{"ko": "일상에서 편하게 입는 현대적인 감각의 생활한복 신상 컬렉션.", "en": "New collection of modern Hanbok with a modern sense that is comfortable to wear in everyday life.", "ja": "日常で楽に着る現代的な感覚の生活韓服新作コレクション。", "zh": "在日常生活中舒适穿着的具有现代感的生活韩服新产品系列。"}',
    'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "상시 운영", "en": "Always Open", "ja": "常時運営", "zh": "常年运营"}',
    '{"ko": "4F 스타일관", "en": "4F Style Hall", "ja": "4F スタイル館", "zh": "4F 时尚馆"}',
    '{"ko": "100,000원~", "en": "From 100,000 KRW", "ja": "100,000ウォン~", "zh": "100,000韩元起"}'
  ),
  (
    '{"ko": "퍼스널 컬러 & K-뷰티 컨설팅", "en": "Personal Color & K-Beauty Consulting", "ja": "パーソナルカラー & K-ビューティーコンサルティング", "zh": "个人色彩 & K-Beauty 咨询"}',
    'Style',
    '{"ko": "나에게 맞는 색과 메이크업을 찾아주는 1:1 뷰티 컨설팅 서비스.", "en": "1:1 beauty consulting service that finds the colors and makeup that suit you.", "ja": "自分に合う色とメイクを見つけてくれる1:1ビューティーコンサルティングサービス。", "zh": "寻找适合自己的颜色和化妆的1:1美容咨询服务。"}',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "예약제 운영", "en": "Reservation Only", "ja": "予約制運営", "zh": "预约制运营"}',
    '{"ko": "4F 뷰티 라운지", "en": "4F Beauty Lounge", "ja": "4F ビューティーラウンジ", "zh": "4F 美容休息室"}',
    '{"ko": "50,000원", "en": "50,000 KRW", "ja": "50,000ウォン", "zh": "50,000韩元"}'
  ),
  (
    '{"ko": "궁중 다과상 체험", "en": "Royal Refreshments Experience", "ja": "宮中茶菓膳体験", "zh": "宫廷茶点桌体验"}',
    'Food',
    '{"ko": "임금님이 즐기던 궁중 병과와 전통차를 맛볼 수 있는 프리미엄 다과상.", "en": "Premium refreshments where you can taste the royal cakes and traditional tea that the king enjoyed.", "ja": "王様が楽しんだ宮中餅菓子と伝統茶を味わうことができるプレミアム茶菓膳。", "zh": "可以品尝国王享用的宫廷糕点和传统茶的高级茶点桌。"}',
    'https://images.unsplash.com/photo-1606509036496-0399b1a597a1?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "매일 11:00 - 20:00", "en": "Daily 11:00 - 20:00", "ja": "毎日 11:00 - 20:00", "zh": "每天 11:00 - 20:00"}',
    '{"ko": "5F 다원", "en": "5F Tea House", "ja": "5F 茶院", "zh": "5F 茶院"}',
    '{"ko": "35,000원", "en": "35,000 KRW", "ja": "35,000ウォン", "zh": "35,000韩元"}'
  ),
  (
    '{"ko": "비건 김치 쿠킹 클래스", "en": "Vegan Kimchi Cooking Class", "ja": "ヴィーガンキムチクッキングクラス", "zh": "纯素辛奇烹饪课程"}',
    'Food',
    '{"ko": "외국인도 쉽게 즐길 수 있는 비건 김치 만들기 수업.", "en": "Vegan Kimchi making class that foreigners can easily enjoy.", "ja": "外国人も簡単に楽しめるヴィーガンキムチ作り授業。", "zh": "外国人也能轻松享受的制作纯素辛奇课程。"}',
    'https://images.unsplash.com/photo-1583160247711-2191776b4b91?q=80&w=2560&auto=format&fit=crop',
    '{"ko": "매주 수요일", "en": "Every Wednesday", "ja": "毎週水曜日", "zh": "每周三"}',
    '{"ko": "5F 쿠킹 스튜디오", "en": "5F Cooking Studio", "ja": "5F クッキングスタジオ", "zh": "5F 烹饪工作室"}',
    '{"ko": "40,000원", "en": "40,000 KRW", "ja": "40,000ウォン", "zh": "40,000韩元"}'
  );
-- Create the bookings table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  product_id uuid references public.products(id) not null,
  user_email text, -- Optional: link to user if logged in
  payment_method text not null, -- 'bank_transfer' or 'on_site'
  status text default 'pending' not null,
  total_price jsonb -- Snapshot of price at time of booking
);

-- Turn on Row Level Security for bookings
alter table public.bookings enable row level security;

-- Create a policy that allows anyone to insert (for public booking)
-- In a real app, you might want to restrict this to authenticated users or add more validation
create policy "Allow public insert bookings"
  on public.bookings
  for insert
  to public
  with check (true);

-- Create a policy that allows admin to view bookings
create policy "Allow authenticated read bookings"
  on public.bookings
  for select
  to authenticated
  using (true);


-- 1. 기존에 꼬여있을 수 있는 정책 삭제
drop policy if exists "Allow public insert bookings" on public.bookings;
drop policy if exists "Allow authenticated read bookings" on public.bookings;

-- 2. 권한(Grant) 직접 부여 (기본적인 접근 기능 활성화)
grant usage on schema public to anon, authenticated;
grant all on table public.bookings to anon, authenticated;

-- 3. INSERT 정책: 누구나 예약 데이터를 넣을 수 있도록 (비로그인/로그인 공통)
create policy "Enable insert for all users"
on public.bookings
for insert
to public
with check (true);

-- 4. SELECT 정책: 데이터를 넣은 후 결과를 읽어올 수 있도록 (중요)
create policy "Enable select for all users"
on public.bookings
for select
to public
using (true);