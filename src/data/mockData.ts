import { FloorCategory } from '../types';

export const FLOOR_CATEGORIES: FloorCategory[] = [
    {
        id: 'trend',
        floor: '1F',
        title: {
            ko: '트렌드 / 팝업',
            en: 'K-Trend / Pop-up',
            ja: 'トレンド / ポップアップ',
            zh: '流行趋势 / 快闪店'
        },
        description: {
            ko: 'HOT한 컬처 트렌드를 만나보세요.',
            en: 'Discover the hottest K-Culture trends and goods.',
            ja: '最もホットなK-カルトレンドに出会ってください。',
            zh: '探索最热门的 K-Culture 趋势。'
        },
        bgImage: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2560&auto=format&fit=crop',
        content: [
            {
                type: 'text',
                value: {
                    ko: '1층은 가장 최신의 K-트렌드를 경험할 수 있는 역동적인 공간입니다. 매달 새로운 주제로 열리는 팝업 스토어와 트렌디한 브랜드들을 만나보세요. 단순한 쇼핑을 넘어 문화를 소비하고 체험하는 공간을 지향합니다.',
                    en: 'The 1st floor is a dynamic space where you can experience the latest K-trends. Meet pop-up stores and trendy brands with new themes every month. We aim for a space where you consume and experience culture beyond simple shopping.',
                    ja: '1階は最新のK-トレンドを体験できるダイナミックな空間です。毎月新しいテーマで開かれるポップアップストアとトレンディなブランドに出会ってください。単なるショッピングを超えて文化を消費し体験する空間を目指します。',
                    zh: '1楼是可以体验最新K-Trend的充满活力的空间。请通过每月以新主题开设的快闪店，接触时尚品牌。超越单纯的购物，旨在打造消费和体验文化的空间。'
                }
            },
            {
                type: 'image',
                value: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=2560&auto=format&fit=crop',
                caption: {
                    ko: '매달 새로운 테마로 변신하는 중앙 팝업 존',
                    en: 'Central pop-up zone transforming with new themes every month',
                    ja: '毎月新しいテーマに変身する中央ポップアップゾーン',
                    zh: '每月以新主题变身的中央快闪区'
                }
            },
            {
                type: 'text',
                value: {
                    ko: 'MZ세대가 열광하는 다양한 브랜드와의 콜라보레이션 굿즈, 그리고 한정판 아이템들을 가장 먼저 만나볼 수 있는 곳입니다. 트렌드세터라면 놓칠 수 없는 핫플레이스입니다.',
                    en: 'This is the first place to find collaboration goods with various brands that the MZ generation is enthusiastic about, as well as limited edition items. It is a hot place that trendsetters cannot miss.',
                    ja: 'MZ世代が熱狂する様々なブランドとのコラボレーショングッズ、そして限定版アイテムを一番早く会える場所です。トレンドセッターなら見逃せないホットプレイスです。',
                    zh: '这是最先能见到MZ一代狂热的各种品牌合作商品和限量版商品的地方。如果是潮流引导者，这是不可错过的热门场所。'
                }
            }
        ]
    },
    {
        id: 'tickets',
        floor: '2F',
        title: {
            ko: '공연 / 전시',
            en: 'Performance / Exhibition',
            ja: '公演 / 展示',
            zh: '演出 / 展览'
        },
        description: {
            ko: '다채로운 예술의 향연.',
            en: 'A feast of colorful arts and performances.',
            ja: '多彩な芸術の饗宴。',
            zh: '丰富多彩的艺术盛宴。'
        },
        bgImage: 'https://images.unsplash.com/photo-1543431690-3b6be2c3cb19?q=80&w=2560&auto=format&fit=crop',
        content: [
            {
                type: 'text',
                value: {
                    ko: '2층은 예술과 관객이 만나는 소통의 장입니다. K-POP 홀로그램 콘서트부터 전통 공연, 그리고 현대 미술 전시까지 폭넓은 스펙트럼의 문화 예술을 선보입니다.',
                    en: 'The 2nd floor is a place of communication where art meets the audience. We present a wide spectrum of culture and arts, from K-POP hologram concerts to traditional performances and contemporary art exhibitions.',
                    ja: '2階は芸術と観客が出会うコミュニケーションの場です。K-POPホログラムコンサートから伝統公演、そして現代美術展示まで幅広いスペクトラムの文化芸術を披露します。',
                    zh: '2楼是艺术与观众见面的沟通场所。从K-POP全息图演唱会到传统演出，再到现代美术展览，展示了广泛的文化艺术。'
                }
            },
            {
                type: 'image',
                value: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2560&auto=format&fit=crop',
                caption: {
                    ko: '몰입형 미디어 아트 전시관',
                    en: 'Immersive Media Art Exhibition Hall',
                    ja: '没入型メディアアート展示館',
                    zh: '沉浸式媒体艺术展馆'
                }
            },
            {
                type: 'text',
                value: {
                    ko: '365일 언제나 새로운 감동을 선사하는 공연장과 갤러리에서 일상의 휴식을 찾아보세요. 티켓 부스에서는 현재 진행 중인 모든 공연과 전시의 예매가 가능합니다.',
                    en: 'Find daily relaxation in the concert hall and gallery that always offer new impressions 365 days a year. At the ticket booth, you can book all ongoing performances and exhibitions.',
                    ja: '365日いつでも新しい感動をプレゼントする公演会場とギャラリーで日常の休息を探してみてください。チケットブースでは現在進行中のすべての公演と展示の予約が可能です。',
                    zh: '请在365天随时通过带来新感动的演出场和画廊寻找日常的休息。在售票处可以预订正在进行的所有演出和展览。'
                }
            }
        ]
    },
    {
        id: 'art',
        floor: '3F',
        title: {
            ko: '활동 / 스타일',
            en: 'Activity / Style',
            ja: 'アクティビティ / スタイル',
            zh: '活动 / 风格'
        },
        description: {
            ko: '활동과 스타일의 조화.',
            en: 'Harmony of Activity and Style.',
            ja: 'アクティビティとスタイルの調和。',
            zh: '活动与风格的和谐。'
        },
        bgImage: 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?q=80&w=2560&auto=format&fit=crop',
        content: [
            {
                type: 'text',
                value: {
                    ko: '3층은 한국 전통 공예의 아름다움을 현대적으로 재해석한 공간입니다. 무형문화재 장인들의 명품부터 신진 작가들의 감각적인 공예품까지 다양한 작품을 감상하고 소장할 수 있습니다.',
                    en: 'The 3rd floor is a space that reinterprets the beauty of Korean traditional crafts in a modern way. You can appreciate and possess various works, from masterpieces by intangible cultural property artisans to sensuous crafts by new artists.',
                    ja: '3階は韓国伝統工芸の美しさを現代的に再解釈した空間です。無形文化財の職人たちの名品から新人作家たちの感覚的な工芸品まで、様々な作品を鑑賞して所蔵することができます。',
                    zh: '3楼是以现代方式重新诠释韩国传统工艺之美的空间。从无形文化遗产工匠的名品到新晋作家的感性工艺品，可以欣赏并收藏各种作品。'
                }
            },
            {
                type: 'image',
                value: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2560&auto=format&fit=crop',
                caption: {
                    ko: '장인의 손길로 빚어낸 도자기 컬렉션',
                    en: 'Pottery collection created by artisans',
                    ja: '職人の手で作り出した陶磁器コレクション',
                    zh: '工匠亲手制作的陶瓷系列'
                }
            },
            {
                type: 'text',
                value: {
                    ko: '직접 도자기를 빚거나 자개를 붙여보는 원데이 클래스도 운영됩니다. 손끝으로 전해지는 흙과 재료의 물성을 느끼며 나만의 작품을 만들어보세요.',
                    en: 'One-day classes where you can make pottery or attach mother-of-pearl are also available. Create your own work while feeling the physical properties of soil and materials transmitted to your fingertips.',
                    ja: '直接陶磁器を作ったり、真珠層を付けたりするワンデークラスも運営されます。指先に伝わる土と材料の物性を感じながら、自分だけの作品を作ってみてください。',
                    zh: '还通过制作陶瓷或贴螺钿的一日课程。请感受指尖传来的泥土和材料的物性，制作属于自己的作品。'
                }
            }
        ]
    },
    {
        id: 'style',
        floor: '4F',
        title: {
            ko: '사진 / 영상',
            en: 'Photo / Video',
            ja: '写真 / 映像',
            zh: '照片 / 视频'
        },
        description: {
            ko: '창의적인 시각 예술과 미디어.',
            en: 'Creative visual arts and media.',
            ja: '創造的な視覚芸術とメディア。',
            zh: '创意视觉艺术和媒体。'
        },
        bgImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2560&auto=format&fit=crop',
        content: [
            {
                type: 'text',
                value: {
                    ko: '4층은 한국적인 아름다움을 패션과 뷰티로 제안하는 스타일 존입니다. 일상에서 편하게 입을 수 있는 모던 한복과 글로벌 뷰티 트렌드를 선도하는 K-뷰티 브랜드를 한자리에 모았습니다.',
                    en: 'The 4th floor is a style zone that proposes Korean beauty through fashion and beauty. We have gathered modern Hanbok that can be worn comfortably in everyday life and K-beauty brands leading global beauty trends in one place.',
                    ja: '4階は韓国的な美しさをファッションとビューティーで提案するスタイルゾーンです。日常で楽に着られるモダン韓服とグローバルビューティートレンドをリードするK-ビューティーブランドを一堂に集めました。',
                    zh: '4楼是通过时尚和美容展现韩国之美的风格区。汇集了日常生活中可以舒适穿着的现代韩服和引领全球美容趋势的K-Beauty品牌。'
                }
            },
            {
                type: 'image',
                value: 'https://images.unsplash.com/photo-1558232777-74313d467af6?q=80&w=2560&auto=format&fit=crop',
                caption: {
                    ko: '전통과 현대가 어우러진 모던 한복 스타일링',
                    en: 'Modern Hanbok styling combining tradition and modernity',
                    ja: '伝統と現代が調和したモダン韓服スタイリング',
                    zh: '传统与现代相融合的现代韩服造型'
                }
            },
            {
                type: 'text',
                value: {
                    ko: '퍼스널 컬러 진단과 메이크업 시연 등 다채로운 체험 프로그램이 준비되어 있습니다. 당신만의 고유한 아름다움을 발견하는 시간을 가져보세요.',
                    en: 'Various experience programs such as personal color diagnosis and makeup demonstrations are available. Take time to discover your own unique beauty.',
                    ja: 'パーソナルカラー診断やメイクアップ試演など、多彩な体験プログラムが用意されています。あなただけの固有の美しさを発見する時間を持ってみてください。',
                    zh: '准备了个人色彩诊断和化妆演示等丰富多彩的体验项目。请花点时间发现属于自己的独特之美。'
                }
            }
        ]
    },
    {
        id: 'travel',
        floor: '5F',
        title: {
            ko: '로컬 / 여행',
            en: 'Local / Travel',
            ja: 'ローカル / 旅行',
            zh: '本地 / 旅游'
        },
        description: {
            ko: '엄선된 로컬 굿즈와 여행 큐레이션.',
            en: 'Curated local goods and travel information.',
            ja: '厳選されたローカルグッズと旅行キュレーション。',
            zh: '精选本地商品和旅游策展。'
        },
        bgImage: 'https://images.unsplash.com/photo-1596120364993-90dcc247f07e?q=80&w=2560&auto=format&fit=crop',
        content: [
            {
                type: 'text',
                value: {
                    ko: '6층은 대한민국 곳곳의 숨겨진 매력을 발굴하는 여행 큐레이션 라운지입니다. 지역 명소와 특산품, 그리고 그곳에 사는 사람들의 이야기를 소개합니다.',
                    en: 'The 6th floor is a travel curation lounge that discovers hidden charms all over Korea. We introduce local attractions, specialties, and the stories of the people living there.',
                    ja: '6階は大韓民国の至る所の隠された魅力を発掘する旅行キュレーションラウンジです。地域の名所と特産品、そしてそこに住む人々の話を紹介します。',
                    zh: '6楼是发掘韩国各地隐藏魅力的旅游策展休息室。介绍地区名胜和特产，以及住在那里的人们的故事。'
                }
            },
            {
                type: 'image',
                value: 'https://images.unsplash.com/photo-1583248369069-9d91f1640fe6?q=80&w=2560&auto=format&fit=crop',
                caption: {
                    ko: '한옥의 정취를 느낄 수 있는 로컬 스테이 정보',
                    en: 'Local stay information where you can feel the mood of Hanok',
                    ja: '韓屋の趣を感じることができるローカルステイ情報',
                    zh: '可以感受韩屋情趣的当地住宿信息'
                }
            },
            {
                type: 'text',
                value: {
                    ko: '나만의 맞춤형 여행 코스를 설계해주는 컨시어지 서비스와 함께 잊지 못할 추억을 계획해보세요. 로컬 크리에이터들이 만든 유니크한 굿즈들도 만나볼 수 있습니다.',
                    en: 'Plan unforgettable memories with a concierge service that designs your own customized travel course. You can also meet unique goods made by local creators.',
                    ja: '自分だけのカスタマイズ旅行コースを設計してくれるコンシェルジュサービスと一緒に忘れられない思い出を計画してみてください。ローカルクリエイターが作ったユニークなグッズにも出会えます。',
                    zh: '请与为您设计量身定做旅游路线的礼宾服务一起计划难忘的回忆。还可以见到当地创作者制作的独特商品。'
                }
            }
        ]
    }
];
