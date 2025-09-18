import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Definir las traducciones directamente para evitar problemas de importación
const resources = {
  en: {
    common: {
      "navigation": {
        "home": "Home",
        "compare": "Compare",
        "demo": "Demo",
        "debug": "Debug",
        "producerAccess": "Access your channel",
        "toggleMenu": "Toggle mobile menu"
      },
      "tabs": {
        "all": "All",
        "popular": "Popular",
        "recent": "Recent"
      },
      "search": {
        "placeholder": "Search channels...",
        "liveChannels": "live channels",
        "tryDifferent": "Try different search terms"
      },
      "channels": {
        "live": "LIVE",
        "loading": "Loading channels...",
        "error": "Error loading channels",
        "notFound": "No channels found",
        "retry": "Retry"
      },
      "footer": {
        "privacyPolicy": "Privacy Policy",
        "termsOfService": "Terms of Service",
        "support": "Support",
        "copyright": "© 2024 danraf77 LLC - USA. All rights reserved.",
        "poweredBy": "Powered by"
      },
      "pagination": {
        "previous": "Previous",
        "next": "Next",
        "pageOf": "Page {{current}} of {{total}}"
      },
      "hero": {
        "title": "The World, One Screen.",
        "description": "Stories that connect. News as it happens. Music that moves. Sports that unite. Culture that travels with you.",
        "subtitle": "It all happens here, live.",
        "createChannel": "Create your channel"
      }
    },
  },
  es: {
    common: {
      "navigation": {
        "home": "Inicio",
        "compare": "Comparar",
        "demo": "Demo",
        "debug": "Depurar",
        "producerAccess": "Acceso a tu canal",
        "toggleMenu": "Alternar menú móvil"
      },
      "tabs": {
        "all": "Todos",
        "popular": "Popular",
        "recent": "Reciente"
      },
      "search": {
        "placeholder": "Buscar canales...",
        "liveChannels": "canales en vivo",
        "tryDifferent": "Intenta con términos de búsqueda diferentes"
      },
      "channels": {
        "live": "EN VIVO",
        "loading": "Cargando canales...",
        "error": "Error al cargar canales",
        "notFound": "No se encontraron canales",
        "retry": "Reintentar"
      },
      "footer": {
        "privacyPolicy": "Política de Privacidad",
        "termsOfService": "Términos de Servicio",
        "support": "Soporte",
        "copyright": "© 2024 danraf77 LLC - USA. Todos los derechos reservados.",
        "poweredBy": "Desarrollado por"
      },
      "pagination": {
        "previous": "Anterior",
        "next": "Siguiente",
        "pageOf": "Página {{current}} de {{total}}"
      },
      "hero": {
        "title": "El Mundo, una Pantalla.",
        "description": "Contenido que conecta. Noticias que informan. Música que inspira. Deportes que unen. Cine, podcasts y radios que acompañan.",
        "subtitle": "Todo sucede aquí, en vivo.",
        "createChannel": "Crea tu canal"
      }
    },
  },
  zh: {
    common: {
      "navigation": {
        "home": "首页",
        "compare": "比较",
        "demo": "演示",
        "debug": "调试",
        "producerAccess": "访问您的频道",
        "toggleMenu": "切换移动菜单"
      },
      "tabs": {
        "all": "全部",
        "popular": "热门",
        "recent": "最近"
      },
      "search": {
        "placeholder": "搜索频道...",
        "liveChannels": "个直播频道",
        "tryDifferent": "尝试不同的搜索词"
      },
      "channels": {
        "live": "直播",
        "loading": "正在加载频道...",
        "error": "加载频道时出错",
        "notFound": "未找到频道",
        "retry": "重试"
      },
      "footer": {
        "privacyPolicy": "隐私政策",
        "termsOfService": "服务条款",
        "support": "支持",
        "copyright": "© 2024 danraf77 LLC - USA. 版权所有。",
        "poweredBy": "技术支持"
      },
      "pagination": {
        "previous": "上一页",
        "next": "下一页",
        "pageOf": "第 {{current}} 页，共 {{total}} 页"
      },
      "hero": {
        "title": "世界，尽在一屏。",
        "description": "内容连接彼此。新闻洞悉万象。音乐启迪心灵。体育凝聚人心。文化陪伴同行。",
        "subtitle": "一切尽在现场直播。",
        "createChannel": "创建您的频道"
      }
    },
  },
  de: {
    common: {
      "navigation": {
        "home": "Startseite",
        "compare": "Vergleichen",
        "demo": "Demo",
        "debug": "Debuggen",
        "producerAccess": "Zugang zu deinem Kanal",
        "toggleMenu": "Mobilmenü umschalten"
      },
      "tabs": {
        "all": "Alle",
        "popular": "Beliebt",
        "recent": "Kürzlich"
      },
      "search": {
        "placeholder": "Kanäle suchen...",
        "liveChannels": "Live-Kanäle",
        "tryDifferent": "Versuchen Sie andere Suchbegriffe"
      },
      "channels": {
        "live": "LIVE",
        "loading": "Kanäle werden geladen...",
        "error": "Fehler beim Laden der Kanäle",
        "notFound": "Keine Kanäle gefunden",
        "retry": "Wiederholen"
      },
      "footer": {
        "privacyPolicy": "Datenschutzrichtlinie",
        "termsOfService": "Nutzungsbedingungen",
        "support": "Support",
        "copyright": "© 2024 danraf77 LLC - USA. Alle Rechte vorbehalten.",
        "poweredBy": "Unterstützt von"
      },
      "pagination": {
        "previous": "Zurück",
        "next": "Weiter",
        "pageOf": "Seite {{current}} von {{total}}"
      },
      "hero": {
        "title": "Die Welt, ein Bildschirm.",
        "description": "Inhalte, die verbinden. Nachrichten, die aufklären. Musik, die inspiriert. Sport, der vereint. Unterhaltung, die Sie begleitet.",
        "subtitle": "Alles passiert hier. Live.",
        "createChannel": "Erstellen Sie Ihren Kanal"
      }
    },
  },
  ja: {
    common: {
      "navigation": {
        "home": "ホーム",
        "compare": "比較",
        "demo": "デモ",
        "debug": "デバッグ",
        "producerAccess": "チャンネルアクセス",
        "toggleMenu": "モバイルメニューを切り替え"
      },
      "tabs": {
        "all": "すべて",
        "popular": "人気",
        "recent": "最近"
      },
      "search": {
        "placeholder": "チャンネルを検索...",
        "liveChannels": "ライブチャンネル",
        "tryDifferent": "別の検索語を試してください"
      },
      "channels": {
        "live": "ライブ",
        "loading": "チャンネルを読み込み中...",
        "error": "チャンネルの読み込みエラー",
        "notFound": "チャンネルが見つかりません",
        "retry": "再試行"
      },
      "footer": {
        "privacyPolicy": "プライバシーポリシー",
        "termsOfService": "利用規約",
        "support": "サポート",
        "copyright": "© 2024 danraf77 LLC - USA. 全著作権所有。",
        "poweredBy": "提供"
      },
      "pagination": {
        "previous": "前へ",
        "next": "次へ",
        "pageOf": "{{current}} / {{total}} ページ"
      },
      "hero": {
        "title": "世界を、一つのスクリーンに。",
        "description": "つながるコンテンツ。世界を知るニュース。心に響く音楽。一つになるスポーツ。毎日に寄り添うエンタメ。",
        "subtitle": "すべてが、ここでライブに。",
        "createChannel": "チャンネルを作成"
      }
    },
  },
  fr: {
    common: {
      "navigation": {
        "home": "Accueil",
        "compare": "Comparer",
        "demo": "Démo",
        "debug": "Déboguer",
        "producerAccess": "Accès à votre chaîne",
        "toggleMenu": "Basculer le menu mobile"
      },
      "tabs": {
        "all": "Tous",
        "popular": "Populaire",
        "recent": "Récent"
      },
      "search": {
        "placeholder": "Rechercher des chaînes...",
        "liveChannels": "chaînes en direct",
        "tryDifferent": "Essayez d'autres termes de recherche"
      },
      "channels": {
        "live": "EN DIRECT",
        "loading": "Chargement des chaînes...",
        "error": "Erreur lors du chargement des chaînes",
        "notFound": "Aucune chaîne trouvée",
        "retry": "Réessayer"
      },
      "footer": {
        "privacyPolicy": "Politique de confidentialité",
        "termsOfService": "Conditions d'utilisation",
        "support": "Support",
        "copyright": "© 2024 danraf77 LLC - USA. Tous droits réservés.",
        "poweredBy": "Propulsé par"
      },
      "pagination": {
        "previous": "Précédent",
        "next": "Suivant",
        "pageOf": "Page {{current}} sur {{total}}"
      },
      "hero": {
        "title": "Le Monde, un seul écran.",
        "description": "Des histoires qui nous relient. L'actualité qui éclaire. La musique qui fait vibrer. Le sport qui rassemble. La culture qui vous accompagne.",
        "subtitle": "Tout se passe ici, en direct.",
        "createChannel": "Créez votre chaîne"
      }
    },
  },
  ar: {
    common: {
      "navigation": {
        "home": "الرئيسية",
        "compare": "مقارنة",
        "demo": "عرض توضيحي",
        "debug": "تصحيح",
        "producerAccess": "الوصول إلى قناتك",
        "toggleMenu": "تبديل القائمة المحمولة"
      },
      "tabs": {
        "all": "الكل",
        "popular": "شائع",
        "recent": "حديث"
      },
      "search": {
        "placeholder": "البحث عن القنوات...",
        "liveChannels": "قناة مباشرة",
        "tryDifferent": "جرب مصطلحات بحث مختلفة"
      },
      "channels": {
        "live": "مباشر",
        "loading": "جاري تحميل القنوات...",
        "error": "خطأ في تحميل القنوات",
        "notFound": "لم يتم العثور على قنوات",
        "retry": "إعادة المحاولة"
      },
      "footer": {
        "privacyPolicy": "سياسة الخصوصية",
        "termsOfService": "شروط الخدمة",
        "support": "الدعم",
        "copyright": "© 2024 danraf77 LLC - USA. جميع الحقوق محفوظة.",
        "poweredBy": "مدعوم من"
      },
      "pagination": {
        "previous": "السابق",
        "next": "التالي",
        "pageOf": "صفحة {{current}} من {{total}}"
      },
      "hero": {
        "title": "العالم في شاشة واحدة.",
        "description": "محتوى يجمعنا. أخبار تنيرنا. موسيقى تلهمنا. رياضة توحدنا. ثقافة ترافقنا.",
        "subtitle": "كل شيء يحدث هنا، على الهواء مباشرة.",
        "createChannel": "أنشئ قناتك"
      }
    },
  },
  pt: {
    common: {
      "navigation": {
        "home": "Início",
        "compare": "Comparar",
        "demo": "Demo",
        "debug": "Depurar",
        "producerAccess": "Acesso ao seu canal",
        "toggleMenu": "Alternar menu móvel"
      },
      "tabs": {
        "all": "Todos",
        "popular": "Popular",
        "recent": "Recente"
      },
      "search": {
        "placeholder": "Buscar canais...",
        "liveChannels": "canais ao vivo",
        "tryDifferent": "Tente termos de busca diferentes"
      },
      "channels": {
        "live": "AO VIVO",
        "loading": "Carregando canais...",
        "error": "Erro ao carregar canais",
        "notFound": "Nenhum canal encontrado",
        "retry": "Tentar novamente"
      },
      "footer": {
        "privacyPolicy": "Política de Privacidade",
        "termsOfService": "Termos de Serviço",
        "support": "Suporte",
        "copyright": "© 2024 danraf77 LLC - USA. Todos os direitos reservados.",
        "poweredBy": "Desenvolvido por"
      },
      "pagination": {
        "previous": "Anterior",
        "next": "Próximo",
        "pageOf": "Página {{current}} de {{total}}"
      },
      "hero": {
        "title": "O Mundo, uma só Tela.",
        "description": "Conteúdo que conecta. Notícias que revelam. Música que inspira. Esportes que unem. Cultura que te acompanha.",
        "subtitle": "Tudo acontece aqui. Ao vivo.",
        "createChannel": "Crie seu canal"
      }
    },
  },
  it: {
    common: {
      "navigation": {
        "home": "Home",
        "compare": "Confronta",
        "demo": "Demo",
        "debug": "Debug",
        "producerAccess": "Accesso produttore",
        "toggleMenu": "Attiva/disattiva menu mobile"
      },
      "tabs": {
        "all": "Tutti",
        "popular": "Popolari",
        "recent": "Recenti"
      },
      "search": {
        "placeholder": "Cerca canali...",
        "liveChannels": "canali live",
        "tryDifferent": "Prova termini di ricerca diversi"
      },
      "channels": {
        "live": "LIVE",
        "loading": "Caricamento canali...",
        "error": "Errore nel caricamento dei canali",
        "notFound": "Nessun canale trovato",
        "retry": "Riprova"
      },
      "footer": {
        "privacyPolicy": "Politica sulla Privacy",
        "termsOfService": "Termini di Servizio",
        "support": "Supporto",
        "copyright": "© 2024 danraf77 LLC - USA. Tutti i diritti riservati.",
        "poweredBy": "Powered by"
      },
      "pagination": {
        "previous": "Precedente",
        "next": "Successivo",
        "pageOf": "Pagina {{current}} di {{total}}"
      },
      "hero": {
        "title": "Il Mondo, un unico Schermo.",
        "description": "Storie che uniscono. Notizie che rivelano. Musica che emoziona. Sport che appassiona. Cultura per ogni momento.",
        "subtitle": "Tutto accade qui. Dal vivo.",
        "createChannel": "Crea il tuo canale"
      }
    },
  },
  ko: {
    common: {
      "navigation": {
        "home": "홈",
        "compare": "비교",
        "demo": "데모",
        "debug": "디버그",
        "producerAccess": "제작자 접근",
        "toggleMenu": "모바일 메뉴 토글"
      },
      "tabs": {
        "all": "전체",
        "popular": "인기",
        "recent": "최신"
      },
      "search": {
        "placeholder": "채널 검색...",
        "liveChannels": "라이브 채널",
        "tryDifferent": "다른 검색어를 시도해보세요"
      },
      "channels": {
        "live": "라이브",
        "loading": "채널 로딩 중...",
        "error": "채널 로딩 오류",
        "notFound": "채널을 찾을 수 없습니다",
        "retry": "다시 시도"
      },
      "footer": {
        "privacyPolicy": "개인정보 보호정책",
        "termsOfService": "서비스 약관",
        "support": "지원",
        "copyright": "© 2024 danraf77 LLC - USA. 모든 권리 보유.",
        "poweredBy": "Powered by"
      },
      "pagination": {
        "previous": "이전",
        "next": "다음",
        "pageOf": "{{current}} / {{total}} 페이지"
      },
      "hero": {
        "title": "세상을 하나의 스크린에.",
        "description": "연결하는 콘텐츠. 세상을 보는 뉴스. 영감을 주는 음악. 우리를 하나로 만드는 스포츠. 일상에 활력을 더하는 엔터테인먼트.",
        "subtitle": "모든 순간, 바로 여기에서 라이브로.",
        "createChannel": "채널 만들기"
      }
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'querystring', 'cookie'],
      caches: ['localStorage'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
      excludeCacheFor: ['cimode'],
      convertDetectedLanguage: (lng) => {
        // Mapear códigos de idioma del navegador a nuestros códigos soportados
        const languageMap: { [key: string]: string } = {
          'en-US': 'en',
          'en-GB': 'en',
          'en-CA': 'en',
          'en-AU': 'en',
          'es-ES': 'es',
          'es-MX': 'es',
          'es-AR': 'es',
          'es-CO': 'es',
          'es-PE': 'es',
          'es-VE': 'es',
          'zh-CN': 'zh',
          'zh-TW': 'zh',
          'zh-HK': 'zh',
          'de-DE': 'de',
          'de-AT': 'de',
          'de-CH': 'de',
          'ja-JP': 'ja',
          'fr-FR': 'fr',
          'fr-CA': 'fr',
          'fr-BE': 'fr',
          'fr-CH': 'fr',
          'ar-SA': 'ar',
          'ar-EG': 'ar',
          'ar-AE': 'ar',
          'pt-BR': 'pt',
          'pt-PT': 'pt',
          'it-IT': 'it',
          'it-CH': 'it',
          'ko-KR': 'ko',
        };
        
        // Si el idioma está en el mapa, usarlo; si no, usar solo el código base
        const mappedLang = languageMap[lng] || lng.split('-')[0];
        
        // Verificar si el idioma está soportado, si no, usar inglés
        const supportedLngs = ['en', 'es', 'zh', 'de', 'ja', 'fr', 'ar', 'pt', 'it', 'ko'];
        return supportedLngs.includes(mappedLang) ? mappedLang : 'en';
      },
    },

    interpolation: {
      escapeValue: false, // React ya escapa los valores
    },

    supportedLngs: ['en', 'es', 'zh', 'de', 'ja', 'fr', 'ar', 'pt', 'it', 'ko'],
    
    // Configuración de namespaces
    defaultNS: 'common',
    ns: ['common'],
    
    // Configuración para react-i18next
    react: {
      useSuspense: false,
    },
  });

export default i18n;
