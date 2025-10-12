#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Traducciones del dashboard en todos los idiomas
const dashboardTranslations = {
  en: {
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome, {username}!",
      description: "Here you can manage your profile and see the channels you follow.",
      loading: "Loading statistics...",
      stats: {
        following: "Following",
        recentActivity: "Recent Activity", 
        memberSince: "Member since"
      },
      quickActions: {
        title: "Quick Actions",
        editProfile: "Edit Profile",
        editProfileDesc: "Update your personal information",
        viewFollowing: "View Following",
        viewFollowingDesc: "Manage your favorite channels"
      },
      sidebar: {
        home: "Home",
        profile: "My Profile",
        following: "Following",
        sessions: "Sessions",
        email: "Email",
        logout: "Log out",
        backToHome: "← Back to home"
      },
      loadingDashboard: "Loading dashboard..."
    }
  },
  es: {
    dashboard: {
      title: "Panel de Control",
      welcome: "¡Bienvenido, {username}!",
      description: "Aquí puedes gestionar tu perfil y ver los canales que sigues.",
      loading: "Cargando estadísticas...",
      stats: {
        following: "Canales Seguidos",
        recentActivity: "Actividad Reciente",
        memberSince: "Miembro desde"
      },
      quickActions: {
        title: "Acciones Rápidas",
        editProfile: "Editar Perfil",
        editProfileDesc: "Actualiza tu información personal",
        viewFollowing: "Ver Canales Seguidos",
        viewFollowingDesc: "Gestiona tus canales favoritos"
      },
      sidebar: {
        home: "Inicio",
        profile: "Mi Perfil",
        following: "Canales Seguidos",
        sessions: "Sesiones",
        email: "Email",
        logout: "Cerrar sesión",
        backToHome: "← Volver al inicio"
      },
      loadingDashboard: "Cargando dashboard..."
    }
  },
  zh: {
    dashboard: {
      title: "仪表板",
      welcome: "欢迎，{username}！",
      description: "在这里您可以管理您的个人资料并查看您关注的频道。",
      loading: "加载统计信息...",
      stats: {
        following: "关注中",
        recentActivity: "最近活动",
        memberSince: "会员自"
      },
      quickActions: {
        title: "快速操作",
        editProfile: "编辑个人资料",
        editProfileDesc: "更新您的个人信息",
        viewFollowing: "查看关注",
        viewFollowingDesc: "管理您喜爱的频道"
      },
      sidebar: {
        home: "首页",
        profile: "我的个人资料",
        following: "关注中",
        sessions: "会话",
        email: "电子邮件",
        logout: "退出登录",
        backToHome: "← 返回首页"
      },
      loadingDashboard: "加载仪表板..."
    }
  },
  de: {
    dashboard: {
      title: "Dashboard",
      welcome: "Willkommen, {username}!",
      description: "Hier können Sie Ihr Profil verwalten und die Kanäle anzeigen, denen Sie folgen.",
      loading: "Statistiken werden geladen...",
      stats: {
        following: "Folgen",
        recentActivity: "Letzte Aktivität",
        memberSince: "Mitglied seit"
      },
      quickActions: {
        title: "Schnellaktionen",
        editProfile: "Profil bearbeiten",
        editProfileDesc: "Aktualisieren Sie Ihre persönlichen Informationen",
        viewFollowing: "Folgen anzeigen",
        viewFollowingDesc: "Verwalten Sie Ihre Lieblingskanäle"
      },
      sidebar: {
        home: "Startseite",
        profile: "Mein Profil",
        following: "Folgen",
        sessions: "Sitzungen",
        email: "E-Mail",
        logout: "Abmelden",
        backToHome: "← Zurück zur Startseite"
      },
      loadingDashboard: "Dashboard wird geladen..."
    }
  },
  ja: {
    dashboard: {
      title: "ダッシュボード",
      welcome: "ようこそ、{username}さん！",
      description: "ここでプロフィールを管理し、フォローしているチャンネルを確認できます。",
      loading: "統計情報を読み込み中...",
      stats: {
        following: "フォロー中",
        recentActivity: "最近のアクティビティ",
        memberSince: "メンバー登録日"
      },
      quickActions: {
        title: "クイックアクション",
        editProfile: "プロフィール編集",
        editProfileDesc: "個人情報を更新する",
        viewFollowing: "フォロー中を表示",
        viewFollowingDesc: "お気に入りのチャンネルを管理する"
      },
      sidebar: {
        home: "ホーム",
        profile: "マイプロフィール",
        following: "フォロー中",
        sessions: "セッション",
        email: "メール",
        logout: "ログアウト",
        backToHome: "← ホームに戻る"
      },
      loadingDashboard: "ダッシュボードを読み込み中..."
    }
  },
  fr: {
    dashboard: {
      title: "Tableau de bord",
      welcome: "Bienvenue, {username} !",
      description: "Ici vous pouvez gérer votre profil et voir les chaînes que vous suivez.",
      loading: "Chargement des statistiques...",
      stats: {
        following: "Abonnements",
        recentActivity: "Activité récente",
        memberSince: "Membre depuis"
      },
      quickActions: {
        title: "Actions rapides",
        editProfile: "Modifier le profil",
        editProfileDesc: "Mettre à jour vos informations personnelles",
        viewFollowing: "Voir les abonnements",
        viewFollowingDesc: "Gérer vos chaînes favorites"
      },
      sidebar: {
        home: "Accueil",
        profile: "Mon profil",
        following: "Abonnements",
        sessions: "Sessions",
        email: "E-mail",
        logout: "Se déconnecter",
        backToHome: "← Retour à l'accueil"
      },
      loadingDashboard: "Chargement du tableau de bord..."
    }
  },
  ar: {
    dashboard: {
      title: "لوحة التحكم",
      welcome: "مرحباً، {username}!",
      description: "هنا يمكنك إدارة ملفك الشخصي ومشاهدة القنوات التي تتابعها.",
      loading: "جاري تحميل الإحصائيات...",
      stats: {
        following: "المتابعة",
        recentActivity: "النشاط الأخير",
        memberSince: "عضو منذ"
      },
      quickActions: {
        title: "إجراءات سريعة",
        editProfile: "تعديل الملف الشخصي",
        editProfileDesc: "تحديث معلوماتك الشخصية",
        viewFollowing: "عرض المتابعة",
        viewFollowingDesc: "إدارة قنواتك المفضلة"
      },
      sidebar: {
        home: "الرئيسية",
        profile: "ملفي الشخصي",
        following: "المتابعة",
        sessions: "الجلسات",
        email: "البريد الإلكتروني",
        logout: "تسجيل الخروج",
        backToHome: "← العودة للرئيسية"
      },
      loadingDashboard: "جاري تحميل لوحة التحكم..."
    }
  },
  pt: {
    dashboard: {
      title: "Painel",
      welcome: "Bem-vindo, {username}!",
      description: "Aqui você pode gerenciar seu perfil e ver os canais que você segue.",
      loading: "Carregando estatísticas...",
      stats: {
        following: "Seguindo",
        recentActivity: "Atividade Recente",
        memberSince: "Membro desde"
      },
      quickActions: {
        title: "Ações Rápidas",
        editProfile: "Editar Perfil",
        editProfileDesc: "Atualize suas informações pessoais",
        viewFollowing: "Ver Seguindo",
        viewFollowingDesc: "Gerencie seus canais favoritos"
      },
      sidebar: {
        home: "Início",
        profile: "Meu Perfil",
        following: "Seguindo",
        sessions: "Sessões",
        email: "E-mail",
        logout: "Sair",
        backToHome: "← Voltar ao início"
      },
      loadingDashboard: "Carregando painel..."
    }
  },
  it: {
    dashboard: {
      title: "Dashboard",
      welcome: "Benvenuto, {username}!",
      description: "Qui puoi gestire il tuo profilo e vedere i canali che segui.",
      loading: "Caricamento statistiche...",
      stats: {
        following: "Seguiti",
        recentActivity: "Attività Recente",
        memberSince: "Membro dal"
      },
      quickActions: {
        title: "Azioni Rapide",
        editProfile: "Modifica Profilo",
        editProfileDesc: "Aggiorna le tue informazioni personali",
        viewFollowing: "Visualizza Seguiti",
        viewFollowingDesc: "Gestisci i tuoi canali preferiti"
      },
      sidebar: {
        home: "Home",
        profile: "Il Mio Profilo",
        following: "Seguiti",
        sessions: "Sessioni",
        email: "Email",
        logout: "Esci",
        backToHome: "← Torna alla home"
      },
      loadingDashboard: "Caricamento dashboard..."
    }
  },
  ko: {
    dashboard: {
      title: "대시보드",
      welcome: "환영합니다, {username}님!",
      description: "여기서 프로필을 관리하고 팔로우하는 채널을 볼 수 있습니다.",
      loading: "통계 로딩 중...",
      stats: {
        following: "팔로우 중",
        recentActivity: "최근 활동",
        memberSince: "가입일"
      },
      quickActions: {
        title: "빠른 작업",
        editProfile: "프로필 편집",
        editProfileDesc: "개인 정보 업데이트",
        viewFollowing: "팔로우 보기",
        viewFollowingDesc: "즐겨찾는 채널 관리"
      },
      sidebar: {
        home: "홈",
        profile: "내 프로필",
        following: "팔로우 중",
        sessions: "세션",
        email: "이메일",
        logout: "로그아웃",
        backToHome: "← 홈으로 돌아가기"
      },
      loadingDashboard: "대시보드 로딩 중..."
    }
  },
  hi: {
    dashboard: {
      title: "डैशबोर्ड",
      welcome: "स्वागत है, {username}!",
      description: "यहाँ आप अपना प्रोफ़ाइल प्रबंधित कर सकते हैं और जिन चैनलों को आप फॉलो करते हैं उन्हें देख सकते हैं।",
      loading: "आंकड़े लोड हो रहे हैं...",
      stats: {
        following: "फॉलो कर रहे हैं",
        recentActivity: "हाल की गतिविधि",
        memberSince: "सदस्यता से"
      },
      quickActions: {
        title: "त्वरित कार्य",
        editProfile: "प्रोफ़ाइल संपादित करें",
        editProfileDesc: "अपनी व्यक्तिगत जानकारी अपडेट करें",
        viewFollowing: "फॉलो करने वाले देखें",
        viewFollowingDesc: "अपने पसंदीदा चैनल प्रबंधित करें"
      },
      sidebar: {
        home: "होम",
        profile: "मेरा प्रोफ़ाइल",
        following: "फॉलो कर रहे हैं",
        sessions: "सत्र",
        email: "ईमेल",
        logout: "लॉग आउट",
        backToHome: "← होम पर वापस जाएं"
      },
      loadingDashboard: "डैशबोर्ड लोड हो रहा है..."
    }
  },
  pl: {
    dashboard: {
      title: "Panel",
      welcome: "Witaj, {username}!",
      description: "Tutaj możesz zarządzać swoim profilem i zobaczyć kanały, które obserwujesz.",
      loading: "Ładowanie statystyk...",
      stats: {
        following: "Obserwowane",
        recentActivity: "Ostatnia aktywność",
        memberSince: "Członek od"
      },
      quickActions: {
        title: "Szybkie akcje",
        editProfile: "Edytuj profil",
        editProfileDesc: "Zaktualizuj swoje dane osobowe",
        viewFollowing: "Zobacz obserwowane",
        viewFollowingDesc: "Zarządzaj ulubionymi kanałami"
      },
      sidebar: {
        home: "Strona główna",
        profile: "Mój profil",
        following: "Obserwowane",
        sessions: "Sesje",
        email: "E-mail",
        logout: "Wyloguj",
        backToHome: "← Powrót do strony głównej"
      },
      loadingDashboard: "Ładowanie panelu..."
    }
  },
  ru: {
    dashboard: {
      title: "Панель управления",
      welcome: "Добро пожаловать, {username}!",
      description: "Здесь вы можете управлять своим профилем и просматривать каналы, на которые подписаны.",
      loading: "Загрузка статистики...",
      stats: {
        following: "Подписки",
        recentActivity: "Недавняя активность",
        memberSince: "Участник с"
      },
      quickActions: {
        title: "Быстрые действия",
        editProfile: "Редактировать профиль",
        editProfileDesc: "Обновите свою личную информацию",
        viewFollowing: "Просмотр подписок",
        viewFollowingDesc: "Управляйте любимыми каналами"
      },
      sidebar: {
        home: "Главная",
        profile: "Мой профиль",
        following: "Подписки",
        sessions: "Сессии",
        email: "Электронная почта",
        logout: "Выйти",
        backToHome: "← Вернуться на главную"
      },
      loadingDashboard: "Загрузка панели управления..."
    }
  },
  tr: {
    dashboard: {
      title: "Kontrol Paneli",
      welcome: "Hoş geldin, {username}!",
      description: "Burada profilinizi yönetebilir ve takip ettiğiniz kanalları görüntüleyebilirsiniz.",
      loading: "İstatistikler yükleniyor...",
      stats: {
        following: "Takip Edilenler",
        recentActivity: "Son Aktiviteler",
        memberSince: "Üye olma tarihi"
      },
      quickActions: {
        title: "Hızlı İşlemler",
        editProfile: "Profili Düzenle",
        editProfileDesc: "Kişisel bilgilerinizi güncelleyin",
        viewFollowing: "Takip Edilenleri Görüntüle",
        viewFollowingDesc: "Favori kanallarınızı yönetin"
      },
      sidebar: {
        home: "Ana Sayfa",
        profile: "Profilim",
        following: "Takip Edilenler",
        sessions: "Oturumlar",
        email: "E-posta",
        logout: "Çıkış Yap",
        backToHome: "← Ana sayfaya dön"
      },
      loadingDashboard: "Kontrol paneli yükleniyor..."
    }
  }
};

// Función para actualizar un archivo de traducción
function updateTranslationFile(language, translations) {
  const filePath = path.join(__dirname, 'public', 'locales', language, 'common.json');
  
  try {
    // Leer archivo existente
    let existingData = {};
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
    }
    
    // Agregar traducciones del dashboard
    existingData.dashboard = translations.dashboard;
    
    // Escribir archivo actualizado
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');
    console.log(`✅ Actualizado: ${language}/common.json`);
  } catch (error) {
    console.error(`❌ Error actualizando ${language}:`, error.message);
  }
}

// Actualizar todos los idiomas
console.log('🔄 Agregando traducciones del dashboard...');

Object.keys(dashboardTranslations).forEach(language => {
  updateTranslationFile(language, dashboardTranslations[language]);
});

console.log('✅ Traducciones del dashboard agregadas a todos los idiomas');
