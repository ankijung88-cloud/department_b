import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    ko: {
        translation: {
            "floor_guide": "층별 안내",
            "floor_guide_subtitle": "Floor Guide",
            "nav": {
                "trend": "트렌드 / 팝업",
                "tickets": "공연 / 전시",
                "art": "아트 / 공예",
                "style": "한복 / 스타일",
                "food": "한식 / 다과",
                "travel": "로컬 / 여행",
                "magazine": "매거진",
                "community": "커뮤니티"
            },
            "category": {
                "trend": {
                    "title": "트렌드 / 팝업",
                    "description": "가장 빠르고 핫한 K-컬처 트렌드"
                },
                "tickets": {
                    "title": "공연 / 전시",
                    "description": "감동과 전율이 있는 무대, 예술을 만나는 시간"
                },
                "art": {
                    "title": "아트 / 공예",
                    "description": "장인의 숨결과 현대적 감각의 조화"
                },
                "style": {
                    "title": "한복 / 스타일",
                    "description": "전통의 멋과 현대적 감각의 만남"
                },
                "food": {
                    "title": "한식 / 다과",
                    "description": "한국의 맛과 멋을 즐기는 미식 여행"
                },
                "travel": {
                    "title": "로컬 / 여행",
                    "description": "대한민국 구석구석, 숨겨진 아름다움을 찾아서"
                },
                "magazine": {
                    "title": "매거진",
                    "description": "깊이 있는 시선으로 바라본 K-컬처 이야기"
                },
                "community": {
                    "title": "커뮤니티",
                    "description": "취향을 나누고 함께 즐기는 공간"
                }
            },
            "hero": {
                "title": "한국의 미, 현대적 감각으로 만나다",
                "subtitle": "전통과 현대가 공존하는 복합문화공간, Culture Dept.",
                "cta": "층별 안내 보기"
            },
            "featured": {
                "title": "추천 & 이벤트",
                "subtitle": "Culture Dept.에서 만나는 특별한 경험"
            },
            "auth": {
                "login": "로그인",
                "register": "회원가입",
                "email": "이메일",
                "password": "비밀번호",
                "name": "이름",
                "logout": "로그아웃",
                "welcome": "환영합니다",
                "login_title": "로그인",
                "register_title": "회원가입",
                "no_account": "계정이 없으신가요?",
                "have_account": "이미 계정이 있으신가요?",
                "signup": "가입하기",
                "submit": "확인",
                "loading": "처리 중...",
                "error_generic": "오류가 발생했습니다.",
                "forgot_password": "비밀번호 찾기",
                "find_id": "이메일 찾기",
                "reset_password_sent": "비밀번호 재설정 이메일이 발송되었습니다.",
                "find_email_success": "사용자님의 이메일은 {{email}} 입니다.",
                "find_email_not_found": "해당 정보로 등록된 계정을 찾을 수 없습니다.",
                "social_login": "간편 로그인",
                "google_login": "Google로 계속하기"
            },
            "footer": {
                "address": "서울특별시 중구 소공로 123",
                "copyright": "© 2026 Culture Dept. Store. All rights reserved.",
                "privacy": "개인정보처리방침",
                "terms": "이용약관",
                "shop": "SHOP",
                "support": "지원",
                "contact": "문의",
                "description": "대한민국의 아름다운 문화와 예술을 세계에 알리는 프리미엄 문화 플랫폼입니다.",
                "notice": "공지사항",
                "faq": "자주 묻는 질문",
                "inquiry": "1:1 문의",
                "weekdays": "평일 10:00 - 18:00 (주말/공휴일 휴무)"
            },
            "common": {
                "view_all": "전체 보기",
                "view_details": "자세히 보기",
                "date": "기간",
                "location": "장소",
                "price": "가격",
                "loading": "로드 중...",
                "error": "오류가 발생했습니다.",
                "no_content": "콘텐츠가 없습니다.",
                "back_home": "홈으로 가기",
                "back": "돌아가기",
                "booking": "예매하기",
                "share": "공유하기",
                "duration": "소요 시간",
                "duration_value": "약 90분",
                "detail_intro": "상세 소개",
                "share_modal": {
                    "title": "공유하기",
                    "copy_link": "링크 복사",
                    "copied": "링크가 복사되었습니다.",
                    "sns": {
                        "kakao": "카카오톡",
                        "facebook": "페이스북",
                        "twitter": "트위터",
                        "more": "더보기"
                    }
                },
                "payment": {
                    "method": "결제 방식 선택",
                    "bank_transfer": "계좌이체",
                    "on_site": "현장결제",
                    "confirm": "결제하기",
                    "success": "예매가 완료되었습니다.",
                    "info": "예매 정보",
                    "bank_info": "입금 계좌: 신한은행 123-456-789012 (예금주: Culture Dept)",
                    "close": "닫기"
                }
            },
            "search": {
                "placeholder": "검색어를 입력하세요...",
                "no_results": "검색 결과가 없습니다.",
                "results_for": "'{{query}}'에 대한 검색 결과",
                "close": "닫기"
            }
        }
    },
    en: {
        translation: {
            "floor_guide": "Floor Guide",
            "floor_guide_subtitle": "Floor Guide",
            "nav": {
                "trend": "K-Trend / Pop-up",
                "tickets": "Tickets",
                "art": "Art / Craft",
                "style": "K-Style / Hanbok",
                "food": "K-Food / Dining",
                "travel": "Local / Travel",
                "magazine": "Magazine",
                "community": "Community"
            },
            "category": {
                "trend": {
                    "title": "K-Trend / Pop-up",
                    "description": "The fastest and hottest K-Culture trends"
                },
                "tickets": {
                    "title": "Performance / Exhibition",
                    "description": "A stage with emotion and thrill, time to meet art"
                },
                "art": {
                    "title": "Art / Craft",
                    "description": "Harmony of artisan's breath and modern sense"
                },
                "style": {
                    "title": "K-Style / Hanbok",
                    "description": "Meeting of traditional beauty and modern sense"
                },
                "food": {
                    "title": "K-Food / Dining",
                    "description": "Gourmet trip enjoying the taste and style of Korea"
                },
                "travel": {
                    "title": "Local / Travel",
                    "description": "Finding hidden beauty in every corner of Korea"
                },
                "magazine": {
                    "title": "Magazine",
                    "description": "K-Culture stories viewed with deep insight"
                },
                "community": {
                    "title": "Community",
                    "description": "Space to share tastes and enjoy together"
                }
            },
            "hero": {
                "title": "Discover the Beauty of Korea",
                "subtitle": "Where Tradition Meets Modernity, Culture Dept.",
                "cta": "Explore Floors"
            },
            "featured": {
                "title": "Featured & Events",
                "subtitle": "Special Experiences at Culture Dept."
            },
            "auth": {
                "login": "Login",
                "register": "Sign Up",
                "email": "Email",
                "password": "Password",
                "name": "Name",
                "logout": "Logout",
                "welcome": "Welcome",
                "login_title": "Login",
                "register_title": "Sign Up",
                "no_account": "Don't have an account?",
                "have_account": "Already have an account?",
                "signup": "Sign Up",
                "submit": "Submit",
                "loading": "Processing...",
                "error_generic": "An error occurred.",
                "forgot_password": "Forgot Password",
                "find_id": "Find ID",
                "reset_password_sent": "Password reset email has been sent.",
                "find_email_success": "Your email is {{email}}.",
                "find_email_not_found": "No account found with this information.",
                "social_login": "Social Login",
                "google_login": "Continue with Google"
            },
            "footer": {
                "address": "123 Sogong-ro, Jung-gu, Seoul",
                "copyright": "© 2026 Culture Dept. Store. All rights reserved.",
                "privacy": "Privacy Policy",
                "terms": "Terms of Service",
                "shop": "SHOP",
                "support": "SUPPORT",
                "contact": "CONTACT",
                "description": "A premium cultural platform promoting Korea's beautiful culture and arts to the world.",
                "notice": "Notice",
                "faq": "FAQ",
                "inquiry": "1:1 Inquiry",
                "weekdays": "Weekdays 10:00 - 18:00 (Closed on weekends/holidays)"
            },
            "common": {
                "view_all": "View All",
                "view_details": "View Details",
                "date": "Date",
                "location": "Location",
                "price": "Price",
                "loading": "Loading...",
                "error": "An error occurred.",
                "no_content": "No content available.",
                "back_home": "Go Home",
                "back": "Back",
                "booking": "Book Now",
                "share": "Share",
                "duration": "Duration",
                "duration_value": "Approx. 90 mins",
                "detail_intro": "Details",
                "share_modal": {
                    "title": "Share",
                    "copy_link": "Copy Link",
                    "copied": "Link Copied!",
                    "sns": {
                        "kakao": "KakaoTalk",
                        "facebook": "Facebook",
                        "twitter": "Twitter",
                        "more": "More"
                    }
                },
                "payment": {
                    "method": "Select Payment Method",
                    "bank_transfer": "Bank Transfer",
                    "on_site": "On-site Payment",
                    "confirm": "Confirm Payment",
                    "success": "Booking Completed",
                    "info": "Booking Info",
                    "bank_info": "Account: Shinhan Bank 123-456-789012 (Holder: Culture Dept)",
                    "close": "Close"
                }
            },
            "search": {
                "placeholder": "Enter search term...",
                "no_results": "No results found.",
                "results_for": "Search results for '{{query}}'",
                "close": "Close"
            }
        }
    },
    ja: {
        translation: {
            "floor_guide": "フロアガイド",
            "floor_guide_subtitle": "Floor Guide",
            "nav": {
                "trend": "トレンド / ポップアップ",
                "tickets": "公演 / 展示",
                "art": "アート / 工芸",
                "style": "韓服 / スタイル",
                "food": "韓国料理 / 茶菓",
                "travel": "ローカル / 旅行",
                "magazine": "マガジン",
                "community": "コミュニティ"
            },
            "category": {
                "trend": {
                    "title": "トレンド / ポップアップ",
                    "description": "最速でホットなK-カルトレンド"
                },
                "tickets": {
                    "title": "公演 / 展示",
                    "description": "感動と戦慄のある舞台、芸術に出会う時間"
                },
                "art": {
                    "title": "アート / 工芸",
                    "description": "職人の息吹と現代的感覚の調和"
                },
                "style": {
                    "title": "韓服 / スタイル",
                    "description": "伝統の粋と現代的感覚の出会い"
                },
                "food": {
                    "title": "韓国料理 / 茶菓",
                    "description": "韓国の味と粋を楽しむ美食旅行"
                },
                "travel": {
                    "title": "ローカル / 旅行",
                    "description": "大韓民国の隅々、隠された美しさを探して"
                },
                "magazine": {
                    "title": "マガジン",
                    "description": "深い視線で見つめたK-カルストーリー"
                },
                "community": {
                    "title": "コミュニティ",
                    "description": "好みを分かち合い、一緒に楽しむ空間"
                }
            },
            "hero": {
                "title": "韓国の美、現代的な感覚で出会う",
                "subtitle": "伝統と現代が共存する複合文化空間, Culture Dept.",
                "cta": "フロアガイドを見る"
            },
            "featured": {
                "title": "おすすめ & イベント",
                "subtitle": "Culture Dept.で出会う特別な体験"
            },
            "auth": {
                "login": "ログイン",
                "register": "新規登録",
                "email": "メールアドレス",
                "password": "パスワード",
                "name": "名前",
                "logout": "ログアウト",
                "welcome": "ようこそ",
                "login_title": "ログイン",
                "register_title": "新規登録",
                "no_account": "アカウントをお持ちでないですか？",
                "have_account": "すでにアカウントをお持ちですか？",
                "signup": "登録する",
                "submit": "確認",
                "loading": "処理中...",
                "error_generic": "エラーが発生しました。",
                "social_login": "簡単ログイン",
                "google_login": "Googleで続行"
            },
            "footer": {
                "address": "ソウル特別市中区小公路123",
                "copyright": "© 2026 Culture Dept. Store. All rights reserved.",
                "privacy": "プライバシーポリシー",
                "terms": "利用規約",
                "shop": "SHOP",
                "support": "SUPPORT",
                "contact": "CONTACT",
                "description": "大韓民国の美しい文化と芸術を世界に知らせるプレミアム文化プラットフォームです。",
                "notice": "お知らせ",
                "faq": "よくある質問",
                "inquiry": "1:1 お問い合わせ",
                "weekdays": "平日 10:00 - 18:00 (週末/祝日休み)"
            },
            "common": {
                "view_all": "すべて見る",
                "view_details": "詳細を見る",
                "date": "期間",
                "location": "場所",
                "price": "価格",
                "loading": "読み込み中...",
                "error": "エラーが発生しました。",
                "no_content": "コンテンツがありません。",
                "back_home": "ホームへ",
                "back": "戻る",
                "booking": "予約する",
                "share": "共有する",
                "duration": "所要時間",
                "duration_value": "約90分",
                "detail_intro": "詳細紹介"
            },
            "search": {
                "placeholder": "検索語を入力してください...",
                "no_results": "検索結果がありません。",
                "results_for": "'{{query}}'の検索結果",
                "close": "閉じる"
            }
        }
    },
    zh: {
        translation: {
            "floor_guide": "楼层指南",
            "floor_guide_subtitle": "Floor Guide",
            "nav": {
                "trend": "流行趋势 / 快闪店",
                "tickets": "演出 / 展览",
                "art": "艺术 / 工艺",
                "style": "韩服 / 时尚",
                "food": "韩食 / 茶点",
                "travel": "本地 / 旅游",
                "magazine": "杂志",
                "community": "社区"
            },
            "category": {
                "trend": {
                    "title": "流行趋势 / 快闪店",
                    "description": "最快最热的K-Culture趋势"
                },
                "tickets": {
                    "title": "演出 / 展览",
                    "description": "充满感动和战栗的舞台，与艺术相遇的时间"
                },
                "art": {
                    "title": "艺术 / 工艺",
                    "description": "工匠气息与现代感的和谐"
                },
                "style": {
                    "title": "韩服 / 时尚",
                    "description": "传统之美与现代感的相遇"
                },
                "food": {
                    "title": "韩食 / 茶点",
                    "description": "享受韩国味道和风韵的美食旅行"
                },
                "travel": {
                    "title": "本地 / 旅游",
                    "description": "寻找韩国各个角落隐藏的美丽"
                },
                "magazine": {
                    "title": "杂志",
                    "description": "以深刻的视线看待的K-Culture故事"
                },
                "community": {
                    "title": "社区",
                    "description": "分享喜好并一起享受的空间"
                }
            },
            "hero": {
                "title": "以现代感邂逅韩国之美",
                "subtitle": "传统与现代共存的综合文化空间, Culture Dept.",
                "cta": "查看楼层指南"
            },
            "featured": {
                "title": "推荐 & 活动",
                "subtitle": "在 Culture Dept. 遇见的特别体验"
            },
            "auth": {
                "login": "登录",
                "register": "注册",
                "email": "电子邮箱",
                "password": "密码",
                "name": "姓名",
                "logout": "登出",
                "welcome": "欢迎",
                "login_title": "登录",
                "register_title": "注册",
                "no_account": "没有账号？",
                "have_account": "已有账号？",
                "signup": "注册",
                "submit": "确认",
                "loading": "处理中...",
                "error_generic": "发生错误。",
                "social_login": "快捷登录",
                "google_login": "使用 Google 继续"
            },
            "footer": {
                "address": "首尔特别市中区小公路123",
                "copyright": "© 2026 Culture Dept. Store. All rights reserved.",
                "privacy": "隐私政策",
                "terms": "使用条款",
                "shop": "SHOP",
                "support": "SUPPORT",
                "contact": "CONTACT",
                "description": "向世界传播韩国美丽文化和艺术的高级文化平台。",
                "notice": "公告",
                "faq": "常见问题",
                "inquiry": "1:1 咨询",
                "weekdays": "平日 10:00 - 18:00 (周末/节假日休息)"
            },
            "common": {
                "view_all": "查看全部",
                "view_details": "查看详情",
                "date": "日期",
                "location": "地点",
                "price": "价格",
                "loading": "加载中...",
                "error": "发生错误。",
                "no_content": "没有内容。",
                "back_home": "返回首页",
                "back": "返回",
                "booking": "预订",
                "share": "分享",
                "duration": "所需时间",
                "duration_value": "约90分钟",
                "detail_intro": "详细介绍"
            },
            "search": {
                "placeholder": "请输入搜索词...",
                "no_results": "没有找到搜索结果。",
                "results_for": "'{{query}}'的搜索结果",
                "close": "关闭"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ko', // Default language
        fallbackLng: 'ko',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
