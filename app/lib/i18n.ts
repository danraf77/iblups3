import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Cargar traducciones desde archivos JSON
const resources = {
  "ar": {
    "common": {
      "navigation": {
        "home": "الرئيسية",
        "compare": "مقارنة",
        "demo": "تجريبي",
        "debug": "تصحيح",
        "producerAccess": "وصول المنتج",
        "viewerAccess": "تسجيل الدخول كمشاهد",
        "toggleMenu": "تبديل قائمة الجوال",
        "back": "رجوع"
      },
      "tabs": {
        "all": "الكل",
        "popular": "شائع",
        "recent": "الأخيرة"
      },
      "search": {
        "placeholder": "ابحث عن قنوات...",
        "liveChannels": "قنوات مباشرة"
      },
      "channels": {
        "live": "مباشر",
        "loading": "جاري تحميل القنوات...",
        "error": "خطأ في تحميل القنوات",
        "notFound": "لم يتم العثور على قنوات",
        "retry": "إعادة المحاولة",
        "follow": "متابعة القناة",
        "unfollow": "إلغاء المتابعة",
        "following": "تتابع"
      },
      "footer": {
        "privacyPolicy": "سياسة الخصوصية",
        "termsOfService": "شروط الخدمة",
        "support": "الدعم",
        "copyright": "© 2025 danraf77 LLC - USA. جميع الحقوق محفوظة.",
        "poweredBy": "مدعوم من"
      },
      "player": {
        "loading": "جاري التحميل...",
        "error": "خطأ في تحميل الفيديو",
        "play": "تشغيل",
        "pause": "إيقاف مؤقت",
        "mute": "كتم الصوت",
        "unmute": "إلغاء كتم الصوت",
        "fullscreen": "ملء الشاشة",
        "exitFullscreen": "الخروج من وضع ملء الشاشة"
      },
      "hero": {
        "title": "العالم، شاشة واحدة.",
        "description": "محتوى يربط. أخبار تُعلم. موسيقى تُلهم. رياضة توحد. سينما وبودكاست وراديو يرافقونك.",
        "subtitle": "كل شيء يحدث هنا، على الهواء مباشرة.",
        "createChannel": "أنشئ قناتك"
      },
      "pages": {
        "channel": {
          "title": "قناة",
          "loading": "جاري تحميل القناة...",
          "notFound": "القناة غير موجودة",
          "liveStream": "بث مباشر"
        },
        "embed": {
          "title": "بث مباشر",
          "description": "مشاهدة البث المباشر"
        }
      },
      "dashboard": {
        "title": "لوحة التحكم",
        "welcome": "مرحباً، {{username}}!",
        "description": "هنا يمكنك إدارة ملفك الشخصي ومشاهدة القنوات التي تتابعها.",
        "loading": "جاري تحميل الإحصائيات...",
        "stats": {
          "following": "المتابعة",
          "recentActivity": "النشاط الأخير",
          "memberSince": "عضو منذ"
        },
        "quickActions": {
          "title": "إجراءات سريعة",
          "editProfile": "تعديل الملف الشخصي",
          "editProfileDesc": "تحديث معلوماتك الشخصية",
          "viewFollowing": "عرض المتابعة",
          "viewFollowingDesc": "إدارة قنواتك المفضلة"
        },
        "sidebar": {
          "home": "الرئيسية",
          "profile": "ملفي الشخصي",
          "following": "المتابعة",
          "sessions": "الجلسات",
          "email": "البريد الإلكتروني",
          "logout": "تسجيل الخروج",
          "backToHome": "← العودة للرئيسية"
        },
        "loadingDashboard": "جاري تحميل لوحة التحكم..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "تسجيل الدخول إلى iblups",
            "verify": "التحقق من الرمز"
          },
          "buttons": {
            "viewerLogin": "تسجيل الدخول كمشاهد",
            "followChannel": "متابعة القناة",
            "unfollowChannel": "إلغاء متابعة القناة",
            "dashboard": "لوحة التحكم",
            "hello": "مرحباً"
          },
          "email": {
            "description": "أدخل بريدك الإلكتروني لتلقي رمز الدخول",
            "label": "البريد الإلكتروني",
            "placeholder": "your@email.com",
            "button": "إرسال الرمز",
            "sending": "جاري الإرسال..."
          },
          "otp": {
            "description": "أدخل الرمز المكون من 4 أرقام المرسل إلى",
            "label": "رمز التحقق",
            "placeholder": "0000",
            "button": "التحقق من الرمز",
            "verifying": "جاري التحقق...",
            "resend": "إعادة إرسال الرمز",
            "resending": "جاري إعادة الإرسال...",
            "changeEmail": "تغيير البريد الإلكتروني"
          },
          "errors": {
            "emailRequired": "البريد الإلكتروني مطلوب",
            "invalidEmail": "بريد إلكتروني غير صالح",
            "otpRequired": "الرمز مطلوب",
            "invalidOtp": "رمز غير صالح أو منتهي الصلاحية",
            "networkError": "خطأ في الشبكة. حاول مرة أخرى.",
            "serverError": "خطأ داخلي في الخادم"
          },
          "success": {
            "emailSent": "تم إرسال الرمز بنجاح",
            "loginSuccess": "تم تسجيل الدخول بنجاح"
          }
        }
      },
      "email": {
        "title": "تغيير البريد الإلكتروني",
        "description": "قم بتحديث عنوان بريدك الإلكتروني مع التحقق من OTP",
        "currentEmail": "البريد الإلكتروني الحالي",
        "currentEmailDescription": "البريد الإلكتروني الحالي لحسابك",
        "newEmail": "بريد إلكتروني جديد",
        "verifyCode": "التحقق من الرمز",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "رمز التحقق",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "أدخل الرمز المكون من 4 أرقام المرسل إلى {{email}}",
        "cancel": "إلغاء",
        "sendCode": "إرسال الرمز",
        "sending": "جاري الإرسال...",
        "changeEmail": "تغيير البريد الإلكتروني",
        "verifyAndChange": "التحقق والتغيير",
        "verifying": "جاري التحقق...",
        "securityInfo": "معلومات الأمان",
        "otpVerification": "التحقق من OTP",
        "otpVerificationDescription": "سيتم إرسال رمز مكون من 4 أرقام إلى البريد الإلكتروني الجديد للتحقق من الملكية",
        "security": "الأمان",
        "securityDescription": "تغيير البريد الإلكتروني يتطلب التحقق لحماية حسابك",
        "success": {
          "codeSent": "تم إرسال رمز التحقق إلى البريد الإلكتروني الجديد",
          "emailUpdated": "تم تحديث البريد الإلكتروني بنجاح"
        },
        "errors": {
          "sendCodeError": "خطأ في إرسال الرمز",
          "verificationError": "خطأ في التحقق من الرمز",
          "invalidCode": "رمز التحقق غير صالح"
        }
      },
      "messages": {
        "errors": {
          "networkError": "خطأ في الشبكة. حاول مرة أخرى.",
          "invalidOtp": "رمز OTP غير صالح أو منتهي الصلاحية.",
          "sendOtpError": "خطأ في إرسال رمز OTP.",
          "followError": "خطأ في متابعة القناة.",
          "unfollowError": "خطأ في إلغاء متابعة القناة.",
          "profileUpdateError": "خطأ في تحديث الملف الشخصي.",
          "emailUpdateError": "خطأ في تحديث البريد الإلكتروني.",
          "sessionError": "خطأ في الجلسة. يرجى تسجيل الدخول مرة أخرى.",
          "unauthorized": "غير مصرح به. يرجى تسجيل الدخول.",
          "serverError": "خطأ داخلي في الخادم."
        },
        "success": {
          "profileUpdated": "تم تحديث الملف الشخصي بنجاح",
          "emailUpdated": "تم تحديث البريد الإلكتروني بنجاح",
          "channelFollowed": "تمت متابعة القناة بنجاح",
          "channelUnfollowed": "لقد قمت بإلغاء متابعة القناة",
          "otpSent": "تم إرسال الرمز بنجاح",
          "loginSuccess": "تم تسجيل الدخول بنجاح"
        },
        "info": {
          "noChannels": "أنت لا تتابع أي قناة بعد",
          "visitChannels": "قم بزيارة القنوات وانقر على \"متابعة القناة\" لإضافتها هنا",
          "exploreChannels": "استكشاف القنوات",
          "loading": "جاري التحميل...",
          "redirecting": "جاري إعادة التوجيه...",
          "sessionExpired": "انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى."
        }
      },
      "pagination": {
        "previous": "السابق",
        "next": "التالي",
        "pageOf": "صفحة"
      },
      "sessions": {
        "title": "جلساتي",
        "description": "إدارة الجلسات النشطة ومراجعة تاريخ الوصول",
        "loading": "جاري تحميل الجلسات...",
        "activeSessions": "الجلسات النشطة",
        "totalSessions": "إجمالي الجلسات",
        "noSessions": "لا توجد جلسات",
        "noSessionsDescription": "لم يتم العثور على جلسات لحسابك.",
        "activeSession": "جلسة نشطة",
        "closedSession": "جلسة مغلقة",
        "unknown": "غير معروف",
        "mobile": "محمول",
        "tablet": "تابلت",
        "desktop": "سطح المكتب",
        "ipNotAvailable": "IP غير متاح",
        "created": "تم الإنشاء",
        "lastActivity": "آخر نشاط",
        "expires": "ينتهي"
      },
      "profile": {
        "title": "ملفي الشخصي",
        "loading": "جاري تحميل الملف الشخصي...",
        "personalInfo": "المعلومات الشخصية",
        "accountInfo": "معلومات الحساب",
        "firstName": "الاسم الأول",
        "lastName": "اسم العائلة",
        "displayName": "اسم العرض",
        "dateOfBirth": "تاريخ الميلاد",
        "city": "المدينة",
        "country": "البلد",
        "firstNamePlaceholder": "اسمك الأول",
        "lastNamePlaceholder": "اسم عائلتك",
        "displayNamePlaceholder": "اسمك العام",
        "cityPlaceholder": "مدينتك",
        "countryPlaceholder": "اختر البلد",
        "memberSince": "عضو منذ",
        "userId": "معرف المستخدم",
        "creationDate": "تاريخ الإنشاء",
        "lastUpdate": "آخر تحديث",
        "cancel": "إلغاء",
        "saveChanges": "حفظ التغييرات",
        "saving": "جاري الحفظ...",
        "success": "تم تحديث الملف الشخصي بنجاح",
        "error": "خطأ في تحديث الملف الشخصي"
      },
      "following": {
        "title": "القنوات المتابعة",
        "loading": "جاري تحميل القنوات المتابعة...",
        "channelsCount": "{{count}} قناة",
        "channelsCountPlural": "{{count}} قناة",
        "exploreChannels": "استكشاف القنوات",
        "noChannels": "لا تتابع أي قناة",
        "noChannelsDescription": "ابدأ بمتابعة القنوات لرؤيتها هنا والحصول على إشعارات عندما تكون مباشرة.",
        "followingSince": "متابعة منذ",
        "viewChannel": "عرض القناة →"
      },
      "viewerLogin": {
        "loading": "جاري التحميل...",
        "hello": "مرحبا",
        "viewer": "مشاهد",
        "dashboard": "لوحة التحكم",
        "logout": "تسجيل الخروج",
        "loginAsViewer": "تسجيل الدخول كمشاهد",
        "loginAsViewerAria": "تسجيل الدخول كمشاهد"
      },
      "navbar": {
        "searchPlaceholder": "البحث عن القنوات..."
      },
      "otpModal": {
        "loginTitle": "تسجيل الدخول",
        "verifyTitle": "التحقق من الرمز",
        "emailLabel": "عنوان البريد الإلكتروني",
        "emailPlaceholder": "your@email.com",
        "sendCodeButton": "إرسال الرمز",
        "sendingCode": "جاري الإرسال...",
        "codeSentSuccess": "تم إرسال الرمز إلى بريدك الإلكتروني",
        "otpLabel": "رمز التحقق",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "التحقق من الرمز",
        "verifyingCode": "جاري التحقق...",
        "loginSuccess": "تم تسجيل الدخول بنجاح",
        "resendCode": "إعادة إرسال الرمز",
        "resendIn": "إعادة الإرسال في",
        "resendCodeSuccess": "تم إعادة إرسال الرمز",
        "backToEmail": "العودة إلى البريد الإلكتروني",
        "invalidCode": "رمز غير صحيح",
        "connectionError": "خطأ في الاتصال",
        "sendCodeError": "خطأ في إرسال الرمز",
        "resendCodeError": "خطأ في إعادة إرسال الرمز",
        "codeSentTo": "أرسلنا رمز التحقق إلى:",
        "closeButton": "إغلاق",
        "termsText": "بالمتابعة، فإنك تقبل شروط الخدمة وسياسة الخصوصية الخاصة بنا.",
        "emailTemplate": {
          "verificationCode": "رمز التحقق الخاص بك",
          "hello": "مرحبا",
          "useThisCode": "استخدم هذا الرمز لتسجيل الدخول:",
          "codeExpires": "ينتهي هذا الرمز خلال 10 دقائق",
          "ignoreEmail": "إذا لم تطلب هذا الرمز، يمكنك تجاهل هذا البريد الإلكتروني.",
          "copyright": "© 2025 iblups. جميع الحقوق محفوظة."
        }
      }
    }
  },
  "de": {
    "common": {
      "navigation": {
        "home": "Startseite",
        "compare": "Vergleichen",
        "demo": "Demo",
        "debug": "Debuggen",
        "producerAccess": "Produzentenzugang",
        "viewerAccess": "Zuschauerzugang",
        "toggleMenu": "Mobiles Menü umschalten",
        "back": "Zurück"
      },
      "tabs": {
        "all": "Alle",
        "popular": "Beliebt",
        "recent": "Neueste"
      },
      "search": {
        "placeholder": "Kanäle suchen...",
        "liveChannels": "Live-Kanäle"
      },
      "channels": {
        "live": "LIVE",
        "loading": "Kanäle werden geladen...",
        "error": "Fehler beim Laden der Kanäle",
        "notFound": "Keine Kanäle gefunden",
        "retry": "Erneut versuchen",
        "follow": "Kanal folgen",
        "unfollow": "Nicht mehr folgen",
        "following": "Gefolgt"
      },
      "footer": {
        "privacyPolicy": "Datenschutzrichtlinie",
        "termsOfService": "Nutzungsbedingungen",
        "support": "Support",
        "copyright": "© 2025 danraf77 LLC - USA. Alle Rechte vorbehalten.",
        "poweredBy": "Unterstützt von"
      },
      "player": {
        "loading": "Wird geladen...",
        "error": "Fehler beim Laden des Videos",
        "play": "Wiedergabe",
        "pause": "Pause",
        "mute": "Stummschalten",
        "unmute": "Stummschaltung aufheben",
        "fullscreen": "Vollbild",
        "exitFullscreen": "Vollbild verlassen"
      },
      "hero": {
        "title": "Die Welt, ein Bildschirm.",
        "description": "Inhalte, die verbinden. Nachrichten, die informieren. Musik, die inspiriert. Sport, der vereint. Kino, Podcasts und Radios, die begleiten.",
        "subtitle": "Alles passiert hier, live.",
        "createChannel": "Erstelle deinen Kanal"
      },
      "pages": {
        "channel": {
          "title": "Kanal",
          "loading": "Kanal wird geladen...",
          "notFound": "Kanal nicht gefunden",
          "liveStream": "Live-Übertragung"
        },
        "embed": {
          "title": "Live-Übertragung",
          "description": "Live-Übertragung ansehen"
        }
      },
      "dashboard": {
        "title": "Dashboard",
        "welcome": "Willkommen, {{username}}!",
        "description": "Hier können Sie Ihr Profil verwalten und die Kanäle anzeigen, denen Sie folgen.",
        "loading": "Statistiken werden geladen...",
        "stats": {
          "following": "Folgen",
          "recentActivity": "Letzte Aktivität",
          "memberSince": "Mitglied seit"
        },
        "quickActions": {
          "title": "Schnellaktionen",
          "editProfile": "Profil bearbeiten",
          "editProfileDesc": "Aktualisieren Sie Ihre persönlichen Informationen",
          "viewFollowing": "Folgen anzeigen",
          "viewFollowingDesc": "Verwalten Sie Ihre Lieblingskanäle"
        },
        "sidebar": {
          "home": "Startseite",
          "profile": "Mein Profil",
          "following": "Folgen",
          "sessions": "Sitzungen",
          "email": "E-Mail",
          "logout": "Abmelden",
          "backToHome": "← Zurück zur Startseite"
        },
        "loadingDashboard": "Dashboard wird geladen..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "Bei iblups anmelden",
            "verify": "Code verifizieren"
          },
          "buttons": {
            "viewerLogin": "Zuschauer-Anmeldung",
            "followChannel": "Kanal folgen",
            "unfollowChannel": "Nicht mehr folgen",
            "dashboard": "Dashboard",
            "hello": "Hallo"
          },
          "email": {
            "description": "Geben Sie Ihre E-Mail ein, um einen Zugangscode zu erhalten",
            "label": "E-Mail",
            "placeholder": "ihre@email.com",
            "button": "Code senden",
            "sending": "Wird gesendet..."
          },
          "otp": {
            "description": "Geben Sie den 4-stelligen Code ein, der an gesendet wurde",
            "label": "Verifizierungscode",
            "placeholder": "0000",
            "button": "Code verifizieren",
            "verifying": "Wird verifiziert...",
            "resend": "Code erneut senden",
            "resending": "Wird erneut gesendet...",
            "changeEmail": "E-Mail ändern"
          }
        }
      },
      "email": {
        "title": "E-Mail ändern",
        "description": "Aktualisieren Sie Ihre E-Mail-Adresse mit OTP-Verifizierung",
        "currentEmail": "Aktuelle E-Mail",
        "currentEmailDescription": "Aktuelle E-Mail für Ihr Konto",
        "newEmail": "Neue E-Mail",
        "verifyCode": "Code verifizieren",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "Verifizierungscode",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "Geben Sie den 4-stelligen Code ein, der an {{email}} gesendet wurde",
        "cancel": "Abbrechen",
        "sendCode": "Code senden",
        "sending": "Senden...",
        "changeEmail": "E-Mail ändern",
        "verifyAndChange": "Verifizieren und ändern",
        "verifying": "Verifizieren...",
        "securityInfo": "Sicherheitsinformationen",
        "otpVerification": "OTP-Verifizierung",
        "otpVerificationDescription": "Ein 4-stelliger Code wird an die neue E-Mail gesendet, um das Eigentum zu verifizieren",
        "security": "Sicherheit",
        "securityDescription": "E-Mail-Änderung erfordert Verifizierung zum Schutz Ihres Kontos",
        "success": {
          "codeSent": "Verifizierungscode an neue E-Mail gesendet",
          "emailUpdated": "E-Mail erfolgreich aktualisiert"
        },
        "errors": {
          "sendCodeError": "Fehler beim Senden des Codes",
          "verificationError": "Fehler beim Verifizieren des Codes",
          "invalidCode": "Ungültiger Verifizierungscode"
        }
      },
      "messages": {
        "errors": {
          "networkError": "Netzwerkfehler. Bitte versuchen Sie es erneut.",
          "invalidOtp": "Ungültiger oder abgelaufener OTP-Code.",
          "sendOtpError": "Fehler beim Senden des OTP-Codes.",
          "followError": "Fehler beim Folgen des Kanals.",
          "unfollowError": "Fehler beim Entfolgen des Kanals.",
          "profileUpdateError": "Fehler beim Aktualisieren des Profils.",
          "emailUpdateError": "Fehler beim Aktualisieren der E-Mail.",
          "sessionError": "Sitzungsfehler. Bitte melden Sie sich erneut an.",
          "unauthorized": "Nicht autorisiert. Bitte melden Sie sich an.",
          "serverError": "Interner Serverfehler."
        },
        "success": {
          "profileUpdated": "Profil erfolgreich aktualisiert",
          "emailUpdated": "E-Mail erfolgreich aktualisiert",
          "channelFollowed": "Kanal erfolgreich gefolgt",
          "channelUnfollowed": "Kanal entfolgt",
          "otpSent": "Code erfolgreich gesendet",
          "loginSuccess": "Anmeldung erfolgreich"
        },
        "info": {
          "noChannels": "Sie folgen noch keinen Kanälen",
          "visitChannels": "Besuchen Sie Kanäle und klicken Sie auf \"Kanal folgen\", um sie hier hinzuzufügen",
          "exploreChannels": "Kanäle erkunden",
          "loading": "Wird geladen...",
          "redirecting": "Wird weitergeleitet...",
          "sessionExpired": "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an."
        }
      },
      "pagination": {
        "previous": "Zurück",
        "next": "Weiter",
        "pageOf": "Seite"
      },
      "sessions": {
        "title": "Meine Sitzungen",
        "description": "Verwalten Sie Ihre aktiven Sitzungen und überprüfen Sie den Zugriffsverlauf",
        "loading": "Sitzungen werden geladen...",
        "activeSessions": "Aktive Sitzungen",
        "totalSessions": "Sitzungen insgesamt",
        "noSessions": "Keine Sitzungen",
        "noSessionsDescription": "Keine Sitzungen für Ihr Konto gefunden.",
        "activeSession": "Aktive Sitzung",
        "closedSession": "Geschlossene Sitzung",
        "unknown": "Unbekannt",
        "mobile": "Mobil",
        "tablet": "Tablet",
        "desktop": "Desktop",
        "ipNotAvailable": "IP nicht verfügbar",
        "created": "Erstellt",
        "lastActivity": "Letzte Aktivität",
        "expires": "Läuft ab"
      },
      "profile": {
        "title": "Mein Profil",
        "loading": "Profil wird geladen...",
        "personalInfo": "Persönliche Informationen",
        "accountInfo": "Kontoinformationen",
        "firstName": "Vorname",
        "lastName": "Nachname",
        "displayName": "Anzeigename",
        "dateOfBirth": "Geburtsdatum",
        "city": "Stadt",
        "country": "Land",
        "firstNamePlaceholder": "Ihr Vorname",
        "lastNamePlaceholder": "Ihr Nachname",
        "displayNamePlaceholder": "Ihr öffentlicher Name",
        "cityPlaceholder": "Ihre Stadt",
        "countryPlaceholder": "Land auswählen",
        "memberSince": "Mitglied seit",
        "userId": "Benutzer-ID",
        "creationDate": "Erstellungsdatum",
        "lastUpdate": "Letzte Aktualisierung",
        "cancel": "Abbrechen",
        "saveChanges": "Änderungen speichern",
        "saving": "Speichern...",
        "success": "Profil erfolgreich aktualisiert",
        "error": "Fehler beim Aktualisieren des Profils"
      },
      "following": {
        "title": "Gefolgte Kanäle",
        "loading": "Gefolgte Kanäle werden geladen...",
        "channelsCount": "{{count}} Kanal",
        "channelsCountPlural": "{{count}} Kanäle",
        "exploreChannels": "Kanäle erkunden",
        "noChannels": "Sie folgen keinem Kanal",
        "noChannelsDescription": "Beginnen Sie, Kanälen zu folgen, um sie hier zu sehen und Benachrichtigungen zu erhalten, wenn sie live gehen.",
        "followingSince": "Folgen seit",
        "viewChannel": "Kanal anzeigen →"
      },
      "viewerLogin": {
        "loading": "Laden...",
        "hello": "Hallo",
        "viewer": "Zuschauer",
        "dashboard": "Dashboard",
        "logout": "Abmelden",
        "loginAsViewer": "Als Zuschauer anmelden",
        "loginAsViewerAria": "Als Zuschauer anmelden"
      },
      "navbar": {
        "searchPlaceholder": "Kanäle suchen..."
      },
      "otpModal": {
        "loginTitle": "Anmelden",
        "verifyTitle": "Code verifizieren",
        "emailLabel": "E-Mail-Adresse",
        "emailPlaceholder": "ihre@email.com",
        "sendCodeButton": "Code senden",
        "sendingCode": "Senden...",
        "codeSentSuccess": "Code an Ihre E-Mail gesendet",
        "otpLabel": "Bestätigungscode",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "Code verifizieren",
        "verifyingCode": "Verifizieren...",
        "loginSuccess": "Anmeldung erfolgreich",
        "resendCode": "Code erneut senden",
        "resendIn": "Erneut senden in",
        "resendCodeSuccess": "Code erneut gesendet",
        "backToEmail": "Zurück zur E-Mail",
        "invalidCode": "Ungültiger Code",
        "connectionError": "Verbindungsfehler",
        "sendCodeError": "Fehler beim Senden des Codes",
        "resendCodeError": "Fehler beim erneuten Senden des Codes",
        "codeSentTo": "Wir haben einen Bestätigungscode gesendet an:",
        "closeButton": "Schließen",
        "termsText": "Durch Fortfahren akzeptieren Sie unsere Nutzungsbedingungen und Datenschutzrichtlinie.",
        "emailTemplate": {
          "verificationCode": "Ihr Bestätigungscode",
          "hello": "Hallo",
          "useThisCode": "Verwenden Sie diesen Code zum Anmelden:",
          "codeExpires": "Dieser Code läuft in 10 Minuten ab",
          "ignoreEmail": "Wenn Sie diesen Code nicht angefordert haben, können Sie diese E-Mail ignorieren.",
          "copyright": "© 2025 iblups. Alle Rechte vorbehalten."
        }
      }
    }
  },
  "en": {
    "common": {
      "navigation": {
        "home": "Home",
        "compare": "Compare",
        "demo": "Demo",
        "debug": "Debug",
        "producerAccess": "Producer access",
        "viewerAccess": "Login as viewer",
        "toggleMenu": "Toggle mobile menu",
        "back": "Back"
      },
      "tabs": {
        "all": "All",
        "popular": "Popular",
        "recent": "Recent"
      },
      "search": {
        "placeholder": "Search channels...",
        "liveChannels": "live channels"
      },
      "pagination": {
        "previous": "Previous",
        "next": "Next",
        "pageOf": "Page"
      },
      "channels": {
        "live": "LIVE",
        "loading": "Loading channels...",
        "error": "Error loading channels",
        "notFound": "No channels found",
        "retry": "Retry",
        "follow": "Follow channel",
        "unfollow": "Unfollow",
        "following": "Following"
      },
      "footer": {
        "privacyPolicy": "Privacy Policy",
        "termsOfService": "Terms of Service",
        "support": "Support",
        "copyright": "© 2025 danraf77 LLC - USA. All rights reserved.",
        "poweredBy": "Powered by"
      },
      "player": {
        "loading": "Loading...",
        "error": "Error loading video",
        "play": "Play",
        "pause": "Pause",
        "mute": "Mute",
        "unmute": "Unmute",
        "fullscreen": "Fullscreen",
        "exitFullscreen": "Exit fullscreen"
      },
      "hero": {
        "title": "The World, One Screen.",
        "description": "Stories that connect. News as it happens. Music that moves. Sports that unite. Culture that travels with you.",
        "subtitle": "It all happens here, live.",
        "createChannel": "Create your channel"
      },
      "pages": {
        "channel": {
          "title": "Channel",
          "loading": "Loading channel...",
          "notFound": "Channel not found",
          "liveStream": "Live Stream"
        },
        "embed": {
          "title": "Live Stream",
          "description": "Watch live streaming"
        }
      },
      "dashboard": {
        "title": "Dashboard",
        "welcome": "Welcome, {{username}}!",
        "description": "Here you can manage your profile and see the channels you follow.",
        "loading": "Loading statistics...",
        "stats": {
          "following": "Following",
          "recentActivity": "Recent Activity",
          "memberSince": "Member since"
        },
        "quickActions": {
          "title": "Quick Actions",
          "editProfile": "Edit Profile",
          "editProfileDesc": "Update your personal information",
          "viewFollowing": "View Following",
          "viewFollowingDesc": "Manage your favorite channels"
        },
        "sidebar": {
          "home": "Home",
          "profile": "My Profile",
          "following": "Following",
          "sessions": "Sessions",
          "email": "Email",
          "logout": "Log out",
          "backToHome": "← Back to home"
        },
        "loadingDashboard": "Loading dashboard..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "Login to iblups",
            "verify": "Verify code"
          },
          "buttons": {
            "viewerLogin": "Viewer Login",
            "followChannel": "Follow Channel",
            "unfollowChannel": "Unfollow",
            "dashboard": "Dashboard",
            "hello": "Hello"
          },
          "email": {
            "description": "Enter your email to receive an access code",
            "label": "Email",
            "placeholder": "your@email.com",
            "button": "Send code",
            "sending": "Sending..."
          },
          "otp": {
            "description": "Enter the 4-digit code sent to",
            "label": "Verification code",
            "placeholder": "0000",
            "button": "Verify code",
            "verifying": "Verifying...",
            "resend": "Resend code",
            "resending": "Resending...",
            "changeEmail": "Change email"
          }
        }
      },
      "email": {
        "title": "Change Email",
        "description": "Update your email address with OTP verification",
        "currentEmail": "Current Email",
        "currentEmailDescription": "Current email for your account",
        "newEmail": "New Email",
        "verifyCode": "Verify Code",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "Verification Code",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "Enter the 4-digit code sent to {{email}}",
        "cancel": "Cancel",
        "sendCode": "Send Code",
        "sending": "Sending...",
        "changeEmail": "Change Email",
        "verifyAndChange": "Verify and Change",
        "verifying": "Verifying...",
        "securityInfo": "Security Information",
        "otpVerification": "OTP Verification",
        "otpVerificationDescription": "A 4-digit code will be sent to the new email to verify ownership",
        "security": "Security",
        "securityDescription": "Email change requires verification to protect your account",
        "success": {
          "codeSent": "Verification code sent to new email",
          "emailUpdated": "Email updated successfully"
        },
        "errors": {
          "sendCodeError": "Error sending code",
          "verificationError": "Error verifying code",
          "invalidCode": "Invalid verification code"
        }
      },
      "messages": {
        "errors": {
          "networkError": "Network error. Please try again.",
          "invalidOtp": "Invalid or expired OTP code.",
          "sendOtpError": "Error sending OTP code.",
          "followError": "Error following channel.",
          "unfollowError": "Error unfollowing channel.",
          "profileUpdateError": "Error updating profile.",
          "emailUpdateError": "Error updating email.",
          "sessionError": "Session error. Please log in again.",
          "unauthorized": "Unauthorized. Please log in.",
          "serverError": "Internal server error."
        },
        "success": {
          "profileUpdated": "Profile updated successfully",
          "emailUpdated": "Email updated successfully",
          "channelFollowed": "Channel followed successfully",
          "channelUnfollowed": "Channel unfollowed",
          "otpSent": "Code sent successfully",
          "loginSuccess": "Login successful"
        },
        "info": {
          "noChannels": "You don't follow any channels yet",
          "visitChannels": "Visit channels and click \"Follow Channel\" to add them here",
          "exploreChannels": "Explore Channels",
          "loading": "Loading...",
          "redirecting": "Redirecting...",
          "sessionExpired": "Your session has expired. Please log in again."
        }
      },
      "sessions": {
        "title": "My Sessions",
        "description": "Manage your active sessions and review access history",
        "loading": "Loading sessions...",
        "activeSessions": "Active Sessions",
        "totalSessions": "Total Sessions",
        "noSessions": "No sessions",
        "noSessionsDescription": "No sessions found for your account.",
        "activeSession": "Active Session",
        "closedSession": "Closed Session",
        "unknown": "Unknown",
        "mobile": "Mobile",
        "tablet": "Tablet",
        "desktop": "Desktop",
        "ipNotAvailable": "IP not available",
        "created": "Created",
        "lastActivity": "Last Activity",
        "expires": "Expires"
      },
      "profile": {
        "title": "My Profile",
        "loading": "Loading profile...",
        "personalInfo": "Personal Information",
        "accountInfo": "Account Information",
        "firstName": "First Name",
        "lastName": "Last Name",
        "displayName": "Display Name",
        "dateOfBirth": "Date of Birth",
        "city": "City",
        "country": "Country",
        "firstNamePlaceholder": "Your first name",
        "lastNamePlaceholder": "Your last name",
        "displayNamePlaceholder": "Your public name",
        "cityPlaceholder": "Your city",
        "countryPlaceholder": "Select country",
        "memberSince": "Member since",
        "userId": "User ID",
        "creationDate": "Creation Date",
        "lastUpdate": "Last Update",
        "cancel": "Cancel",
        "saveChanges": "Save Changes",
        "saving": "Saving...",
        "success": "Profile updated successfully",
        "error": "Error updating profile"
      },
      "following": {
        "title": "Following",
        "loading": "Loading followed channels...",
        "channelsCount": "{{count}} channel",
        "channelsCountPlural": "{{count}} channels",
        "exploreChannels": "Explore Channels",
        "noChannels": "You're not following any channels",
        "noChannelsDescription": "Start following channels to see them here and get notifications when they go live.",
        "followingSince": "Following since",
        "viewChannel": "View Channel →"
      },
      "viewerLogin": {
        "loading": "Loading...",
        "hello": "Hello",
        "viewer": "Viewer",
        "dashboard": "Dashboard",
        "logout": "Log out",
        "loginAsViewer": "Login as Viewer",
        "loginAsViewerAria": "Login as viewer"
      },
      "navbar": {
        "searchPlaceholder": "Search channels..."
      },
      "otpModal": {
        "loginTitle": "Login",
        "verifyTitle": "Verify Code",
        "emailLabel": "Email address",
        "emailPlaceholder": "your@email.com",
        "sendCodeButton": "Send Code",
        "sendingCode": "Sending...",
        "codeSentSuccess": "Code sent to your email",
        "otpLabel": "Verification code",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "Verify Code",
        "verifyingCode": "Verifying...",
        "loginSuccess": "Login successful",
        "resendCode": "Resend code",
        "resendIn": "Resend in",
        "resendCodeSuccess": "Code resent",
        "backToEmail": "Back to email",
        "invalidCode": "Invalid code",
        "connectionError": "Connection error",
        "sendCodeError": "Error sending code",
        "resendCodeError": "Error resending code",
        "codeSentTo": "We sent a verification code to:",
        "closeButton": "Close",
        "termsText": "By continuing, you accept our terms of service and privacy policy.",
        "emailTemplate": {
          "verificationCode": "Your verification code",
          "hello": "Hello",
          "useThisCode": "Use this code to log in:",
          "codeExpires": "This code expires in 10 minutes",
          "ignoreEmail": "If you didn't request this code, you can ignore this email.",
          "copyright": "© 2025 iblups. All rights reserved."
        }
      }
    }
  },
  "es": {
    "common": {
      "navigation": {
        "home": "Inicio",
        "compare": "Comparar",
        "demo": "Demo",
        "debug": "Depurar",
        "producerAccess": "Acceso de productor",
        "viewerAccess": "Ingreso como viewer",
        "toggleMenu": "Alternar menú móvil",
        "back": "Volver"
      },
      "tabs": {
        "all": "Todos",
        "popular": "Popular",
        "recent": "Reciente"
      },
      "search": {
        "placeholder": "Buscar canales...",
        "liveChannels": "canales en vivo"
      },
      "pagination": {
        "previous": "Anterior",
        "next": "Siguiente",
        "pageOf": "Página"
      },
      "channels": {
        "live": "EN VIVO",
        "loading": "Cargando canales...",
        "error": "Error al cargar canales",
        "notFound": "No se encontraron canales",
        "retry": "Reintentar",
        "follow": "Seguir canal",
        "unfollow": "Dejar de seguir",
        "following": "Siguiendo"
      },
      "footer": {
        "privacyPolicy": "Política de Privacidad",
        "termsOfService": "Términos de Servicio",
        "support": "Soporte",
        "copyright": "© 2025 danraf77 LLC - USA. Todos los derechos reservados.",
        "poweredBy": "Desarrollado por"
      },
      "player": {
        "loading": "Cargando...",
        "error": "Error al cargar video",
        "play": "Reproducir",
        "pause": "Pausar",
        "mute": "Silenciar",
        "unmute": "Activar sonido",
        "fullscreen": "Pantalla completa",
        "exitFullscreen": "Salir de pantalla completa"
      },
      "hero": {
        "title": "El Mundo, una Pantalla.",
        "description": "Contenido que conecta. Noticias que informan. Música que inspira. Deportes que unen. Cine, podcasts y radios que acompañan.",
        "subtitle": "Todo sucede aquí, en vivo.",
        "createChannel": "Crea tu canal"
      },
      "pages": {
        "channel": {
          "title": "Canal",
          "loading": "Cargando canal...",
          "notFound": "Canal no encontrado",
          "liveStream": "Transmisión en vivo"
        },
        "embed": {
          "title": "Transmisión en vivo",
          "description": "Ver transmisión en vivo"
        }
      },
      "dashboard": {
        "title": "Panel de Control",
        "welcome": "¡Bienvenido, {{username}}!",
        "description": "Aquí puedes gestionar tu perfil y ver los canales que sigues.",
        "loading": "Cargando estadísticas...",
        "stats": {
          "following": "Canales Seguidos",
          "recentActivity": "Actividad Reciente",
          "memberSince": "Miembro desde"
        },
        "quickActions": {
          "title": "Acciones Rápidas",
          "editProfile": "Editar Perfil",
          "editProfileDesc": "Actualiza tu información personal",
          "viewFollowing": "Ver Canales Seguidos",
          "viewFollowingDesc": "Gestiona tus canales favoritos"
        },
        "sidebar": {
          "home": "Inicio",
          "profile": "Mi Perfil",
          "following": "Canales Seguidos",
          "sessions": "Sesiones",
          "email": "Email",
          "logout": "Cerrar sesión",
          "backToHome": "← Volver al inicio"
        },
        "loadingDashboard": "Cargando dashboard..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "Ingresar a iblups",
            "verify": "Verificar código"
          },
          "buttons": {
            "viewerLogin": "Ingreso como viewer",
            "followChannel": "Seguir canal",
            "unfollowChannel": "Dejar de seguir",
            "dashboard": "Dashboard",
            "hello": "Hola"
          },
          "email": {
            "description": "Ingresa tu email para recibir un código de acceso",
            "label": "Email",
            "placeholder": "tu@email.com",
            "button": "Enviar código",
            "sending": "Enviando..."
          },
          "otp": {
            "description": "Ingresa el código de 4 dígitos enviado a",
            "label": "Código de verificación",
            "placeholder": "0000",
            "button": "Verificar código",
            "verifying": "Verificando...",
            "resend": "Reenviar código",
            "resending": "Reenviando...",
            "changeEmail": "Cambiar email"
          },
          "errors": {
            "emailRequired": "Email es requerido",
            "invalidEmail": "Email inválido",
            "otpRequired": "Código es requerido",
            "invalidOtp": "Código inválido o expirado",
            "networkError": "Error de red. Inténtalo de nuevo.",
            "serverError": "Error interno del servidor"
          },
          "success": {
            "emailSent": "Código enviado correctamente",
            "loginSuccess": "Inicio de sesión exitoso"
          }
        }
      },
      "email": {
        "title": "Cambiar Email",
        "description": "Actualiza tu dirección de email con verificación OTP",
        "currentEmail": "Email Actual",
        "currentEmailDescription": "Email actual de tu cuenta",
        "newEmail": "Nuevo Email",
        "verifyCode": "Verificar Código",
        "newEmailPlaceholder": "tu@nuevo-email.com",
        "verificationCode": "Código de Verificación",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "Ingresa el código de 4 dígitos enviado a {{email}}",
        "cancel": "Cancelar",
        "sendCode": "Enviar Código",
        "sending": "Enviando...",
        "changeEmail": "Cambiar Email",
        "verifyAndChange": "Verificar y Cambiar",
        "verifying": "Verificando...",
        "securityInfo": "Información de Seguridad",
        "otpVerification": "Verificación por OTP",
        "otpVerificationDescription": "Se enviará un código de 4 dígitos al nuevo email para verificar la propiedad",
        "security": "Seguridad",
        "securityDescription": "El cambio de email requiere verificación para proteger tu cuenta",
        "success": {
          "codeSent": "Código de verificación enviado al nuevo email",
          "emailUpdated": "Email actualizado correctamente"
        },
        "errors": {
          "sendCodeError": "Error al enviar el código",
          "verificationError": "Error al verificar el código",
          "invalidCode": "Código de verificación inválido"
        }
      },
      "messages": {
        "errors": {
          "networkError": "Error de red. Inténtalo de nuevo.",
          "invalidOtp": "Código OTP inválido o expirado.",
          "sendOtpError": "Error al enviar el código OTP.",
          "followError": "Error al seguir el canal.",
          "unfollowError": "Error al dejar de seguir el canal.",
          "profileUpdateError": "Error al actualizar el perfil.",
          "emailUpdateError": "Error al actualizar el email.",
          "sessionError": "Error de sesión. Por favor, inicia sesión nuevamente.",
          "unauthorized": "No autorizado. Por favor, inicia sesión.",
          "serverError": "Error interno del servidor."
        },
        "success": {
          "profileUpdated": "Perfil actualizado correctamente",
          "emailUpdated": "Email actualizado correctamente",
          "channelFollowed": "Canal seguido correctamente",
          "channelUnfollowed": "Dejaste de seguir el canal",
          "otpSent": "Código enviado correctamente",
          "loginSuccess": "Inicio de sesión exitoso"
        },
        "info": {
          "noChannels": "No sigues ningún canal aún",
          "visitChannels": "Visita los canales y haz clic en \"Seguir canal\" para agregarlos aquí",
          "exploreChannels": "Explorar Canales",
          "loading": "Cargando...",
          "redirecting": "Redirigiendo...",
          "sessionExpired": "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        }
      },
      "sessions": {
        "title": "Mis Sesiones",
        "description": "Gestiona tus sesiones activas y revisa el historial de acceso",
        "loading": "Cargando sesiones...",
        "activeSessions": "Sesiones Activas",
        "totalSessions": "Total de Sesiones",
        "noSessions": "No hay sesiones",
        "noSessionsDescription": "No se encontraron sesiones registradas para tu cuenta.",
        "activeSession": "Sesión Activa",
        "closedSession": "Sesión Cerrada",
        "unknown": "Desconocido",
        "mobile": "Móvil",
        "tablet": "Tablet",
        "desktop": "Escritorio",
        "ipNotAvailable": "IP no disponible",
        "created": "Creada",
        "lastActivity": "Última Actividad",
        "expires": "Expira"
      },
      "profile": {
        "title": "Mi Perfil",
        "loading": "Cargando perfil...",
        "personalInfo": "Información Personal",
        "accountInfo": "Información de la Cuenta",
        "firstName": "Nombre",
        "lastName": "Apellido",
        "displayName": "Nombre para mostrar",
        "dateOfBirth": "Fecha de nacimiento",
        "city": "Ciudad",
        "country": "País",
        "firstNamePlaceholder": "Tu nombre",
        "lastNamePlaceholder": "Tu apellido",
        "displayNamePlaceholder": "Tu nombre público",
        "cityPlaceholder": "Tu ciudad",
        "countryPlaceholder": "Seleccionar país",
        "memberSince": "Miembro desde",
        "userId": "ID de Usuario",
        "creationDate": "Fecha de Creación",
        "lastUpdate": "Última Actualización",
        "cancel": "Cancelar",
        "saveChanges": "Guardar Cambios",
        "saving": "Guardando...",
        "success": "Perfil actualizado correctamente",
        "error": "Error al actualizar el perfil"
      },
      "following": {
        "title": "Canales Seguidos",
        "loading": "Cargando canales seguidos...",
        "channelsCount": "{{count}} canal",
        "channelsCountPlural": "{{count}} canales",
        "exploreChannels": "Explorar Canales",
        "noChannels": "No sigues ningún canal",
        "noChannelsDescription": "Comienza a seguir canales para verlos aquí y recibir notificaciones cuando estén en vivo.",
        "followingSince": "Siguiendo desde",
        "viewChannel": "Ver Canal →"
      },
      "viewerLogin": {
        "loading": "Cargando...",
        "hello": "Hola",
        "viewer": "Viewer",
        "dashboard": "Dashboard",
        "logout": "Cerrar sesión",
        "loginAsViewer": "Iniciar como Viewer",
        "loginAsViewerAria": "Iniciar sesión como viewer"
      },
      "navbar": {
        "searchPlaceholder": "Buscar canales..."
      },
      "otpModal": {
        "loginTitle": "Iniciar Sesión",
        "verifyTitle": "Verificar Código",
        "emailLabel": "Dirección de email",
        "emailPlaceholder": "tu@email.com",
        "sendCodeButton": "Enviar Código",
        "sendingCode": "Enviando...",
        "codeSentSuccess": "Código enviado a tu email",
        "otpLabel": "Código de verificación",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "Verificar Código",
        "verifyingCode": "Verificando...",
        "loginSuccess": "Login exitoso",
        "resendCode": "Reenviar código",
        "resendIn": "Reenviar en",
        "resendCodeSuccess": "Código reenviado",
        "backToEmail": "Volver al email",
        "invalidCode": "Código inválido",
        "connectionError": "Error de conexión",
        "sendCodeError": "Error enviando código",
        "resendCodeError": "Error reenviando código",
        "codeSentTo": "Enviamos un código de verificación a:",
        "closeButton": "Cerrar",
        "termsText": "Al continuar, aceptas nuestros términos de servicio y política de privacidad.",
        "emailTemplate": {
          "verificationCode": "Tu código de verificación",
          "hello": "Hola",
          "useThisCode": "Usa este código para iniciar sesión:",
          "codeExpires": "Este código expira en 10 minutos",
          "ignoreEmail": "Si no solicitaste este código, puedes ignorar este email.",
          "copyright": "© 2025 iblups. Todos los derechos reservados."
        }
      }
    }
  },
  "fr": {
    "common": {
      "navigation": {
        "home": "Accueil",
        "compare": "Comparer",
        "demo": "Démo",
        "debug": "Déboguer",
        "producerAccess": "Accès producteur",
        "viewerAccess": "Accès spectateur",
        "toggleMenu": "Basculer le menu mobile",
        "back": "Retour"
      },
      "tabs": {
        "all": "Tous",
        "popular": "Populaire",
        "recent": "Récent"
      },
      "search": {
        "placeholder": "Rechercher des chaînes...",
        "liveChannels": "chaînes en direct"
      },
      "channels": {
        "live": "EN DIRECT",
        "loading": "Chargement des chaînes...",
        "error": "Erreur lors du chargement des chaînes",
        "notFound": "Aucune chaîne trouvée",
        "retry": "Réessayer",
        "follow": "Suivre la chaîne",
        "unfollow": "Ne plus suivre",
        "following": "Suivi"
      },
      "footer": {
        "privacyPolicy": "Politique de confidentialité",
        "termsOfService": "Conditions d'utilisation",
        "support": "Support",
        "copyright": "© 2025 danraf77 LLC - USA. Tous droits réservés.",
        "poweredBy": "Propulsé par"
      },
      "player": {
        "loading": "Chargement...",
        "error": "Erreur lors du chargement de la vidéo",
        "play": "Lire",
        "pause": "Pause",
        "mute": "Muet",
        "unmute": "Activer le son",
        "fullscreen": "Plein écran",
        "exitFullscreen": "Quitter le mode plein écran"
      },
      "hero": {
        "title": "Le Monde, un Écran.",
        "description": "Du contenu qui connecte. Des nouvelles qui informent. De la musique qui inspire. Des sports qui unissent. Du cinéma, des podcasts et des radios qui accompagnent.",
        "subtitle": "Tout se passe ici, en direct.",
        "createChannel": "Créez votre chaîne"
      },
      "pages": {
        "channel": {
          "title": "Chaîne",
          "loading": "Chargement de la chaîne...",
          "notFound": "Chaîne non trouvée",
          "liveStream": "Diffusion en direct"
        },
        "embed": {
          "title": "Diffusion en direct",
          "description": "Regarder la diffusion en direct"
        }
      },
      "dashboard": {
        "title": "Tableau de bord",
        "welcome": "Bienvenue, {{username}} !",
        "description": "Ici vous pouvez gérer votre profil et voir les chaînes que vous suivez.",
        "loading": "Chargement des statistiques...",
        "stats": {
          "following": "Abonnements",
          "recentActivity": "Activité récente",
          "memberSince": "Membre depuis"
        },
        "quickActions": {
          "title": "Actions rapides",
          "editProfile": "Modifier le profil",
          "editProfileDesc": "Mettre à jour vos informations personnelles",
          "viewFollowing": "Voir les abonnements",
          "viewFollowingDesc": "Gérer vos chaînes favorites"
        },
        "sidebar": {
          "home": "Accueil",
          "profile": "Mon profil",
          "following": "Abonnements",
          "sessions": "Sessions",
          "email": "E-mail",
          "logout": "Se déconnecter",
          "backToHome": "← Retour à l'accueil"
        },
        "loadingDashboard": "Chargement du tableau de bord..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "Se connecter à iblups",
            "verify": "Vérifier le code"
          },
          "buttons": {
            "viewerLogin": "Connexion spectateur",
            "followChannel": "Suivre la chaîne",
            "unfollowChannel": "Ne plus suivre",
            "dashboard": "Tableau de bord",
            "hello": "Bonjour"
          },
          "email": {
            "description": "Entrez votre email pour recevoir un code d'accès",
            "label": "Email",
            "placeholder": "votre@email.com",
            "button": "Envoyer le code",
            "sending": "Envoi en cours..."
          },
          "otp": {
            "description": "Entrez le code à 4 chiffres envoyé à",
            "label": "Code de vérification",
            "placeholder": "0000",
            "button": "Vérifier le code",
            "verifying": "Vérification...",
            "resend": "Renvoyer le code",
            "resending": "Renvoi en cours...",
            "changeEmail": "Changer l'email"
          },
          "errors": {
            "emailRequired": "L'email est requis",
            "invalidEmail": "Email invalide",
            "otpRequired": "Le code est requis",
            "invalidOtp": "Code invalide ou expiré",
            "networkError": "Erreur réseau. Veuillez réessayer.",
            "serverError": "Erreur interne du serveur"
          },
          "success": {
            "emailSent": "Code envoyé avec succès",
            "loginSuccess": "Connexion réussie"
          }
        }
      },
      "email": {
        "title": "Changer l'E-mail",
        "description": "Mettez à jour votre adresse e-mail avec vérification OTP",
        "currentEmail": "E-mail Actuel",
        "currentEmailDescription": "E-mail actuel de votre compte",
        "newEmail": "Nouvel E-mail",
        "verifyCode": "Vérifier le Code",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "Code de Vérification",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "Entrez le code à 4 chiffres envoyé à {{email}}",
        "cancel": "Annuler",
        "sendCode": "Envoyer le Code",
        "sending": "Envoi...",
        "changeEmail": "Changer l'E-mail",
        "verifyAndChange": "Vérifier et Changer",
        "verifying": "Vérification...",
        "securityInfo": "Informations de Sécurité",
        "otpVerification": "Vérification OTP",
        "otpVerificationDescription": "Un code à 4 chiffres sera envoyé au nouvel e-mail pour vérifier la propriété",
        "security": "Sécurité",
        "securityDescription": "Le changement d'e-mail nécessite une vérification pour protéger votre compte",
        "success": {
          "codeSent": "Code de vérification envoyé au nouvel e-mail",
          "emailUpdated": "E-mail mis à jour avec succès"
        },
        "errors": {
          "sendCodeError": "Erreur lors de l'envoi du code",
          "verificationError": "Erreur lors de la vérification du code",
          "invalidCode": "Code de vérification invalide"
        }
      },
      "messages": {
        "errors": {
          "networkError": "Erreur de réseau. Veuillez réessayer.",
          "invalidOtp": "Code OTP invalide ou expiré.",
          "sendOtpError": "Erreur lors de l'envoi du code OTP.",
          "followError": "Erreur lors du suivi de la chaîne.",
          "unfollowError": "Erreur lors de l'arrêt du suivi de la chaîne.",
          "profileUpdateError": "Erreur lors de la mise à jour du profil.",
          "emailUpdateError": "Erreur lors de la mise à jour de l'email.",
          "sessionError": "Erreur de session. Veuillez vous reconnecter.",
          "unauthorized": "Non autorisé. Veuillez vous connecter.",
          "serverError": "Erreur interne du serveur."
        },
        "success": {
          "profileUpdated": "Profil mis à jour avec succès",
          "emailUpdated": "Email mis à jour avec succès",
          "channelFollowed": "Chaîne suivie avec succès",
          "channelUnfollowed": "Vous ne suivez plus la chaîne",
          "otpSent": "Code envoyé avec succès",
          "loginSuccess": "Connexion réussie"
        },
        "info": {
          "noChannels": "Vous ne suivez encore aucune chaîne",
          "visitChannels": "Visitez les chaînes et cliquez sur \"Suivre la chaîne\" pour les ajouter ici",
          "exploreChannels": "Explorer les Chaînes",
          "loading": "Chargement...",
          "redirecting": "Redirection...",
          "sessionExpired": "Votre session a expiré. Veuillez vous reconnecter."
        }
      },
      "pagination": {
        "previous": "Précédent",
        "next": "Suivant",
        "pageOf": "Page"
      },
      "sessions": {
        "title": "Mes Sessions",
        "description": "Gérez vos sessions actives et consultez l'historique d'accès",
        "loading": "Chargement des sessions...",
        "activeSessions": "Sessions Actives",
        "totalSessions": "Total des Sessions",
        "noSessions": "Aucune session",
        "noSessionsDescription": "Aucune session trouvée pour votre compte.",
        "activeSession": "Session Active",
        "closedSession": "Session Fermée",
        "unknown": "Inconnu",
        "mobile": "Mobile",
        "tablet": "Tablette",
        "desktop": "Bureau",
        "ipNotAvailable": "IP non disponible",
        "created": "Créée",
        "lastActivity": "Dernière Activité",
        "expires": "Expire"
      },
      "profile": {
        "title": "Mon Profil",
        "loading": "Chargement du profil...",
        "personalInfo": "Informations Personnelles",
        "accountInfo": "Informations du Compte",
        "firstName": "Prénom",
        "lastName": "Nom",
        "displayName": "Nom d'affichage",
        "dateOfBirth": "Date de naissance",
        "city": "Ville",
        "country": "Pays",
        "firstNamePlaceholder": "Votre prénom",
        "lastNamePlaceholder": "Votre nom",
        "displayNamePlaceholder": "Votre nom public",
        "cityPlaceholder": "Votre ville",
        "countryPlaceholder": "Sélectionner un pays",
        "memberSince": "Membre depuis",
        "userId": "ID Utilisateur",
        "creationDate": "Date de Création",
        "lastUpdate": "Dernière Mise à Jour",
        "cancel": "Annuler",
        "saveChanges": "Enregistrer les Modifications",
        "saving": "Enregistrement...",
        "success": "Profil mis à jour avec succès",
        "error": "Erreur lors de la mise à jour du profil"
      },
      "following": {
        "title": "Chaînes Suivies",
        "loading": "Chargement des chaînes suivies...",
        "channelsCount": "{{count}} chaîne",
        "channelsCountPlural": "{{count}} chaînes",
        "exploreChannels": "Explorer les Chaînes",
        "noChannels": "Vous ne suivez aucune chaîne",
        "noChannelsDescription": "Commencez à suivre des chaînes pour les voir ici et recevoir des notifications quand elles sont en direct.",
        "followingSince": "Suivi depuis",
        "viewChannel": "Voir la Chaîne →"
      },
      "viewerLogin": {
        "loading": "Chargement...",
        "hello": "Bonjour",
        "viewer": "Spectateur",
        "dashboard": "Tableau de bord",
        "logout": "Se déconnecter",
        "loginAsViewer": "Se connecter en tant que spectateur",
        "loginAsViewerAria": "Se connecter en tant que spectateur"
      },
      "navbar": {
        "searchPlaceholder": "Rechercher des chaînes..."
      },
      "otpModal": {
        "loginTitle": "Se connecter",
        "verifyTitle": "Vérifier le code",
        "emailLabel": "Adresse e-mail",
        "emailPlaceholder": "votre@email.com",
        "sendCodeButton": "Envoyer le code",
        "sendingCode": "Envoi...",
        "codeSentSuccess": "Code envoyé à votre e-mail",
        "otpLabel": "Code de vérification",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "Vérifier le code",
        "verifyingCode": "Vérification...",
        "loginSuccess": "Connexion réussie",
        "resendCode": "Renvoyer le code",
        "resendIn": "Renvoyer dans",
        "resendCodeSuccess": "Code renvoyé",
        "backToEmail": "Retour à l'e-mail",
        "invalidCode": "Code invalide",
        "connectionError": "Erreur de connexion",
        "sendCodeError": "Erreur lors de l'envoi du code",
        "resendCodeError": "Erreur lors du renvoi du code",
        "codeSentTo": "Nous avons envoyé un code de vérification à :",
        "closeButton": "Fermer",
        "termsText": "En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.",
        "emailTemplate": {
          "verificationCode": "Votre code de vérification",
          "hello": "Bonjour",
          "useThisCode": "Utilisez ce code pour vous connecter :",
          "codeExpires": "Ce code expire dans 10 minutes",
          "ignoreEmail": "Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail.",
          "copyright": "© 2025 iblups. Tous droits réservés."
        }
      }
    }
  },
  "hi": {
    "common": {
      "navigation": {
        "home": "होम",
        "compare": "तुलना करें",
        "demo": "डेमो",
        "debug": "डीबग करें",
        "producerAccess": "निर्माता पहुंच",
        "viewerAccess": "दर्शक के रूप में प्रवेश",
        "toggleMenu": "मोबाइल मेनू टॉगल करें",
        "back": "वापस"
      },
      "tabs": {
        "all": "सभी",
        "popular": "लोकप्रिय",
        "recent": "हाल का"
      },
      "search": {
        "placeholder": "चैनल खोजें...",
        "liveChannels": "लाइव चैनल"
      },
      "channels": {
        "live": "लाइव",
        "loading": "चैनल लोड हो रहे हैं...",
        "error": "चैनल लोड करने में त्रुटि",
        "notFound": "कोई चैनल नहीं मिला",
        "retry": "पुनः प्रयास करें",
        "follow": "चैनल को फॉलो करें",
        "unfollow": "अनफॉलो करें",
        "following": "फॉलो कर रहे हैं"
      },
      "footer": {
        "privacyPolicy": "गोपनीयता नीति",
        "termsOfService": "सेवा की शर्तें",
        "support": "समर्थन",
        "copyright": "© 2025 danraf77 LLC - USA. सर्वाधिकार सुरक्षित।",
        "poweredBy": "द्वारा संचालित"
      },
      "player": {
        "loading": "लोड हो रहा है...",
        "error": "वीडियो लोड करने में त्रुटि",
        "play": "चलाएं",
        "pause": "रोकें",
        "mute": "म्यूट",
        "unmute": "अनम्यूट",
        "fullscreen": "फुल स्क्रीन",
        "exitFullscreen": "फुल स्क्रीन से बाहर निकलें"
      },
      "hero": {
        "title": "दुनिया, एक स्क्रीन।",
        "description": "सामग्री जो जोड़ती है। समाचार जो सूचित करते हैं। संगीत जो प्रेरित करता है। खेल जो एकजुट करते हैं। सिनेमा, पॉडकास्ट और रेडियो जो साथ देते हैं।",
        "subtitle": "सब कुछ यहीं होता है, लाइव।",
        "createChannel": "अपना चैनल बनाएं"
      },
      "pages": {
        "channel": {
          "title": "चैनल",
          "loading": "चैनल लोड हो रहा है...",
          "notFound": "चैनल नहीं मिला",
          "liveStream": "लाइव स्ट्रीम"
        },
        "embed": {
          "title": "लाइव स्ट्रीम",
          "description": "लाइव स्ट्रीम देखें"
        }
      },
      "dashboard": {
        "title": "डैशबोर्ड",
        "welcome": "स्वागत है, {{username}}!",
        "description": "यहाँ आप अपना प्रोफ़ाइल प्रबंधित कर सकते हैं और जिन चैनलों को आप फॉलो करते हैं उन्हें देख सकते हैं।",
        "loading": "आंकड़े लोड हो रहे हैं...",
        "stats": {
          "following": "फॉलो कर रहे हैं",
          "recentActivity": "हाल की गतिविधि",
          "memberSince": "सदस्यता से"
        },
        "quickActions": {
          "title": "त्वरित कार्य",
          "editProfile": "प्रोफ़ाइल संपादित करें",
          "editProfileDesc": "अपनी व्यक्तिगत जानकारी अपडेट करें",
          "viewFollowing": "फॉलो करने वाले देखें",
          "viewFollowingDesc": "अपने पसंदीदा चैनल प्रबंधित करें"
        },
        "sidebar": {
          "home": "होम",
          "profile": "मेरा प्रोफ़ाइल",
          "following": "फॉलो कर रहे हैं",
          "sessions": "सत्र",
          "email": "ईमेल",
          "logout": "लॉग आउट",
          "backToHome": "← होम पर वापस जाएं"
        },
        "loadingDashboard": "डैशबोर्ड लोड हो रहा है..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "iblups में लॉगिन करें",
            "verify": "कोड सत्यापित करें"
          },
          "buttons": {
            "viewerLogin": "दर्शक के रूप में प्रवेश",
            "followChannel": "चैनल को फॉलो करें",
            "unfollowChannel": "चैनल को अनफॉलो करें",
            "dashboard": "डैशबोर्ड",
            "hello": "नमस्ते"
          },
          "email": {
            "description": "एक्सेस कोड प्राप्त करने के लिए अपना ईमेल दर्ज करें",
            "label": "ईमेल",
            "placeholder": "आपका@ईमेल.कॉम",
            "button": "कोड भेजें",
            "sending": "भेजा जा रहा है..."
          },
          "otp": {
            "description": "भेजा गया 4 अंकों का कोड दर्ज करें",
            "label": "सत्यापन कोड",
            "placeholder": "0000",
            "button": "कोड सत्यापित करें",
            "verifying": "सत्यापित हो रहा है...",
            "resend": "कोड पुनः भेजें",
            "resending": "पुनः भेजा जा रहा है...",
            "changeEmail": "ईमेल बदलें"
          },
          "errors": {
            "emailRequired": "ईमेल आवश्यक है",
            "invalidEmail": "अमान्य ईमेल",
            "otpRequired": "कोड आवश्यक है",
            "invalidOtp": "अमान्य या समाप्त हो गया कोड",
            "networkError": "नेटवर्क त्रुटि। पुनः प्रयास करें।",
            "serverError": "आंतरिक सर्वर त्रुटि"
          },
          "success": {
            "emailSent": "कोड सफलतापूर्वक भेजा गया",
            "loginSuccess": "लॉगिन सफल"
          }
        }
      },
      "email": {
        "title": "ईमेल बदलें",
        "description": "OTP सत्यापन के साथ अपना ईमेल पता अपडेट करें",
        "currentEmail": "वर्तमान ईमेल",
        "currentEmailDescription": "आपके खाते का वर्तमान ईमेल",
        "newEmail": "नया ईमेल",
        "verifyCode": "कोड सत्यापित करें",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "सत्यापन कोड",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "{{email}} पर भेजे गए 4 अंकों का कोड दर्ज करें",
        "cancel": "रद्द करें",
        "sendCode": "कोड भेजें",
        "sending": "भेजा जा रहा है...",
        "changeEmail": "ईमेल बदलें",
        "verifyAndChange": "सत्यापित करें और बदलें",
        "verifying": "सत्यापित किया जा रहा है...",
        "securityInfo": "सुरक्षा जानकारी",
        "otpVerification": "OTP सत्यापन",
        "otpVerificationDescription": "स्वामित्व सत्यापित करने के लिए नए ईमेल पर 4 अंकों का कोड भेजा जाएगा",
        "security": "सुरक्षा",
        "securityDescription": "ईमेल बदलने के लिए आपके खाते की सुरक्षा के लिए सत्यापन आवश्यक है",
        "success": {
          "codeSent": "सत्यापन कोड नए ईमेल पर भेजा गया",
          "emailUpdated": "ईमेल सफलतापूर्वक अपडेट किया गया"
        },
        "errors": {
          "sendCodeError": "कोड भेजने में त्रुटि",
          "verificationError": "कोड सत्यापित करने में त्रुटि",
          "invalidCode": "अमान्य सत्यापन कोड"
        }
      },
      "messages": {
        "errors": {
          "networkError": "नेटवर्क त्रुटि। पुनः प्रयास करें।",
          "invalidOtp": "अमान्य या समाप्त हो गया ओटीपी कोड।",
          "sendOtpError": "ओटीपी कोड भेजने में त्रुटि।",
          "followError": "चैनल को फॉलो करने में त्रुटि।",
          "unfollowError": "चैनल को अनफॉलो करने में त्रुटि।",
          "profileUpdateError": "प्रोफ़ाइल अपडेट करने में त्रुटि।",
          "emailUpdateError": "ईमेल अपडेट करने में त्रुटि।",
          "sessionError": "सत्र त्रुटि। कृपया पुनः लॉग इन करें।",
          "unauthorized": "अनधिकृत। कृपया लॉग इन करें।",
          "serverError": "आंतरिक सर्वर त्रुटि।"
        },
        "success": {
          "profileUpdated": "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई",
          "emailUpdated": "ईमेल सफलतापूर्वक अपडेट किया गया",
          "channelFollowed": "चैनल सफलतापूर्वक फॉलो किया गया",
          "channelUnfollowed": "आपने चैनल को अनफॉलो कर दिया है",
          "otpSent": "कोड सफलतापूर्वक भेजा गया",
          "loginSuccess": "लॉगिन सफल"
        },
        "info": {
          "noChannels": "आप अभी तक किसी भी चैनल को फॉलो नहीं करते हैं",
          "visitChannels": "चैनलों पर जाएं और उन्हें यहां जोड़ने के लिए \"चैनल को फॉलो करें\" पर क्लिक करें",
          "exploreChannels": "चैनल एक्सप्लोर करें",
          "loading": "लोड हो रहा है...",
          "redirecting": "रीडायरेक्ट किया जा रहा है...",
          "sessionExpired": "आपका सत्र समाप्त हो गया है। कृपया पुनः लॉग इन करें।"
        }
      },
      "pagination": {
        "previous": "पिछला",
        "next": "अगला",
        "pageOf": "पृष्ठ"
      },
      "sessions": {
        "title": "मेरे सेशन",
        "description": "अपने सक्रिय सेशन प्रबंधित करें और एक्सेस इतिहास की समीक्षा करें",
        "loading": "सेशन लोड हो रहे हैं...",
        "activeSessions": "सक्रिय सेशन",
        "totalSessions": "कुल सेशन",
        "noSessions": "कोई सेशन नहीं",
        "noSessionsDescription": "आपके खाते के लिए कोई सेशन नहीं मिला।",
        "activeSession": "सक्रिय सेशन",
        "closedSession": "बंद सेशन",
        "unknown": "अज्ञात",
        "mobile": "मोबाइल",
        "tablet": "टैबलेट",
        "desktop": "डेस्कटॉप",
        "ipNotAvailable": "IP उपलब्ध नहीं",
        "created": "बनाया गया",
        "lastActivity": "अंतिम गतिविधि",
        "expires": "समाप्त होता है"
      },
      "profile": {
        "title": "मेरा प्रोफ़ाइल",
        "loading": "प्रोफ़ाइल लोड हो रहा है...",
        "personalInfo": "व्यक्तिगत जानकारी",
        "accountInfo": "खाता जानकारी",
        "firstName": "नाम",
        "lastName": "उपनाम",
        "displayName": "प्रदर्शन नाम",
        "dateOfBirth": "जन्म तिथि",
        "city": "शहर",
        "country": "देश",
        "firstNamePlaceholder": "आपका नाम",
        "lastNamePlaceholder": "आपका उपनाम",
        "displayNamePlaceholder": "आपका सार्वजनिक नाम",
        "cityPlaceholder": "आपका शहर",
        "countryPlaceholder": "देश चुनें",
        "memberSince": "सदस्यता से",
        "userId": "उपयोगकर्ता ID",
        "creationDate": "निर्माण तिथि",
        "lastUpdate": "अंतिम अपडेट",
        "cancel": "रद्द करें",
        "saveChanges": "परिवर्तन सहेजें",
        "saving": "सहेजा जा रहा है...",
        "success": "प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया",
        "error": "प्रोफ़ाइल अपडेट करने में त्रुटि"
      },
      "following": {
        "title": "फॉलो किए गए चैनल",
        "loading": "फॉलो किए गए चैनल लोड हो रहे हैं...",
        "channelsCount": "{{count}} चैनल",
        "channelsCountPlural": "{{count}} चैनल",
        "exploreChannels": "चैनल एक्सप्लोर करें",
        "noChannels": "आप कोई चैनल फॉलो नहीं कर रहे",
        "noChannelsDescription": "चैनल फॉलो करना शुरू करें ताकि आप उन्हें यहाँ देख सकें और लाइव होने पर नोटिफिकेशन प्राप्त कर सकें।",
        "followingSince": "फॉलो करना शुरू किया",
        "viewChannel": "चैनल देखें →"
      },
      "viewerLogin": {
        "loading": "लोड हो रहा है...",
        "hello": "नमस्ते",
        "viewer": "दर्शक",
        "dashboard": "डैशबोर्ड",
        "logout": "लॉग आउट",
        "loginAsViewer": "दर्शक के रूप में लॉगिन करें",
        "loginAsViewerAria": "दर्शक के रूप में लॉगिन करें"
      },
      "navbar": {
        "searchPlaceholder": "चैनल खोजें..."
      },
      "otpModal": {
        "loginTitle": "लॉग इन करें",
        "verifyTitle": "कोड सत्यापित करें",
        "emailLabel": "ईमेल पता",
        "emailPlaceholder": "your@email.com",
        "sendCodeButton": "कोड भेजें",
        "sendingCode": "भेजा जा रहा है...",
        "codeSentSuccess": "कोड आपके ईमेल पर भेजा गया",
        "otpLabel": "सत्यापन कोड",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "कोड सत्यापित करें",
        "verifyingCode": "सत्यापित किया जा रहा है...",
        "loginSuccess": "लॉग इन सफल",
        "resendCode": "कोड पुनः भेजें",
        "resendIn": "पुनः भेजें",
        "resendCodeSuccess": "कोड पुनः भेजा गया",
        "backToEmail": "ईमेल पर वापस जाएं",
        "invalidCode": "अमान्य कोड",
        "connectionError": "कनेक्शन त्रुटि",
        "sendCodeError": "कोड भेजने में त्रुटि",
        "resendCodeError": "कोड पुनः भेजने में त्रुटि",
        "codeSentTo": "हमने सत्यापन कोड भेजा है:",
        "closeButton": "बंद करें",
        "termsText": "जारी रखकर, आप हमारी सेवा की शर्तों और गोपनीयता नीति को स्वीकार करते हैं।",
        "emailTemplate": {
          "verificationCode": "आपका सत्यापन कोड",
          "hello": "नमस्ते",
          "useThisCode": "लॉग इन करने के लिए इस कोड का उपयोग करें:",
          "codeExpires": "यह कोड 10 मिनट में समाप्त हो जाएगा",
          "ignoreEmail": "यदि आपने इस कोड का अनुरोध नहीं किया है, तो आप इस ईमेल को नजरअंदाज कर सकते हैं।",
          "copyright": "© 2025 iblups. सभी अधिकार सुरक्षित।"
        }
      }
    }
  },
  "it": {
    "common": {
      "navigation": {
        "home": "Home",
        "compare": "Confronta",
        "demo": "Demo",
        "debug": "Debug",
        "producerAccess": "Accesso produttore",
        "viewerAccess": "Accesso spettatore",
        "toggleMenu": "Attiva/disattiva menu mobile",
        "back": "Indietro"
      },
      "tabs": {
        "all": "Tutti",
        "popular": "Popolari",
        "recent": "Recenti"
      },
      "search": {
        "placeholder": "Cerca canali...",
        "liveChannels": "canali in diretta"
      },
      "channels": {
        "live": "IN DIRETTA",
        "loading": "Caricamento canali...",
        "error": "Errore nel caricamento dei canali",
        "notFound": "Nessun canale trovato",
        "retry": "Riprova",
        "follow": "Segui il canale",
        "unfollow": "Smetti di seguire",
        "following": "Segui già"
      },
      "footer": {
        "privacyPolicy": "Informativa sulla privacy",
        "termsOfService": "Termini di servizio",
        "support": "Supporto",
        "copyright": "© 2025 danraf77 LLC - USA. Tutti i diritti riservati.",
        "poweredBy": "Realizzato da"
      },
      "player": {
        "loading": "Caricamento...",
        "error": "Errore nel caricamento del video",
        "play": "Riproduci",
        "pause": "Pausa",
        "mute": "Muto",
        "unmute": "Riattiva audio",
        "fullscreen": "Schermo intero",
        "exitFullscreen": "Esci da schermo intero"
      },
      "hero": {
        "title": "Il Mondo, uno Schermo.",
        "description": "Contenuti che connettono. Notizie che informano. Musica che ispira. Sport che uniscono. Cinema, podcast e radio che accompagnano.",
        "subtitle": "Tutto accade qui, in diretta.",
        "createChannel": "Crea il tuo canale"
      },
      "pages": {
        "channel": {
          "title": "Canale",
          "loading": "Caricamento canale...",
          "notFound": "Canale non trovato",
          "liveStream": "Trasmissione in diretta"
        },
        "embed": {
          "title": "Trasmissione in diretta",
          "description": "Guarda la trasmissione in diretta"
        }
      },
      "dashboard": {
        "title": "Dashboard",
        "welcome": "Benvenuto, {{username}}!",
        "description": "Qui puoi gestire il tuo profilo e vedere i canali che segui.",
        "loading": "Caricamento statistiche...",
        "stats": {
          "following": "Seguiti",
          "recentActivity": "Attività Recente",
          "memberSince": "Membro dal"
        },
        "quickActions": {
          "title": "Azioni Rapide",
          "editProfile": "Modifica Profilo",
          "editProfileDesc": "Aggiorna le tue informazioni personali",
          "viewFollowing": "Visualizza Seguiti",
          "viewFollowingDesc": "Gestisci i tuoi canali preferiti"
        },
        "sidebar": {
          "home": "Home",
          "profile": "Il Mio Profilo",
          "following": "Seguiti",
          "sessions": "Sessioni",
          "email": "Email",
          "logout": "Esci",
          "backToHome": "← Torna alla home"
        },
        "loadingDashboard": "Caricamento dashboard..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "Accedi a iblups",
            "verify": "Verifica codice"
          },
          "buttons": {
            "viewerLogin": "Accesso spettatore",
            "followChannel": "Segui il canale",
            "unfollowChannel": "Smetti di seguire il canale",
            "dashboard": "Dashboard",
            "hello": "Ciao"
          },
          "email": {
            "description": "Inserisci la tua email per ricevere un codice di accesso",
            "label": "Email",
            "placeholder": "tua@email.com",
            "button": "Invia codice",
            "sending": "Invio in corso..."
          },
          "otp": {
            "description": "Inserisci il codice a 4 cifre inviato a",
            "label": "Codice di verifica",
            "placeholder": "0000",
            "button": "Verifica codice",
            "verifying": "Verifica in corso...",
            "resend": "Reinvia codice",
            "resending": "Reinvio in corso...",
            "changeEmail": "Cambia email"
          },
          "errors": {
            "emailRequired": "L'email è obbligatoria",
            "invalidEmail": "Email non valida",
            "otpRequired": "Il codice è obbligatorio",
            "invalidOtp": "Codice non valido o scaduto",
            "networkError": "Errore di rete. Riprova.",
            "serverError": "Errore interno del server"
          },
          "success": {
            "emailSent": "Codice inviato con successo",
            "loginSuccess": "Accesso effettuato con successo"
          }
        }
      },
      "email": {
        "title": "Cambia E-mail",
        "description": "Aggiorna il tuo indirizzo e-mail con verifica OTP",
        "currentEmail": "E-mail Attuale",
        "currentEmailDescription": "E-mail attuale del tuo account",
        "newEmail": "Nuova E-mail",
        "verifyCode": "Verifica Codice",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "Codice di Verifica",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "Inserisci il codice a 4 cifre inviato a {{email}}",
        "cancel": "Annulla",
        "sendCode": "Invia Codice",
        "sending": "Invio...",
        "changeEmail": "Cambia E-mail",
        "verifyAndChange": "Verifica e Cambia",
        "verifying": "Verifica...",
        "securityInfo": "Informazioni di Sicurezza",
        "otpVerification": "Verifica OTP",
        "otpVerificationDescription": "Un codice a 4 cifre verrà inviato alla nuova e-mail per verificare la proprietà",
        "security": "Sicurezza",
        "securityDescription": "Il cambio di e-mail richiede verifica per proteggere il tuo account",
        "success": {
          "codeSent": "Codice di verifica inviato alla nuova e-mail",
          "emailUpdated": "E-mail aggiornata con successo"
        },
        "errors": {
          "sendCodeError": "Errore nell'invio del codice",
          "verificationError": "Errore nella verifica del codice",
          "invalidCode": "Codice di verifica non valido"
        }
      },
      "messages": {
        "errors": {
          "networkError": "Errore di rete. Riprova.",
          "invalidOtp": "Codice OTP non valido o scaduto.",
          "sendOtpError": "Errore durante l'invio del codice OTP.",
          "followError": "Errore nel seguire il canale.",
          "unfollowError": "Errore nel smettere di seguire il canale.",
          "profileUpdateError": "Errore nell'aggiornamento del profilo.",
          "emailUpdateError": "Errore nell'aggiornamento dell'email.",
          "sessionError": "Errore di sessione. Effettua nuovamente l'accesso.",
          "unauthorized": "Non autorizzato. Effettua l'accesso.",
          "serverError": "Errore interno del server."
        },
        "success": {
          "profileUpdated": "Profilo aggiornato con successo",
          "emailUpdated": "Email aggiornata con successo",
          "channelFollowed": "Canale seguito con successo",
          "channelUnfollowed": "Hai smesso di seguire il canale",
          "otpSent": "Codice inviato con successo",
          "loginSuccess": "Accesso effettuato con successo"
        },
        "info": {
          "noChannels": "Non segui ancora nessun canale",
          "visitChannels": "Visita i canali e fai clic su \"Segui il canale\" per aggiungerli qui",
          "exploreChannels": "Esplora i canali",
          "loading": "Caricamento...",
          "redirecting": "Reindirizzamento...",
          "sessionExpired": "La tua sessione è scaduta. Effettua nuovamente l'accesso."
        }
      },
      "pagination": {
        "previous": "Precedente",
        "next": "Successivo",
        "pageOf": "Pagina"
      },
      "sessions": {
        "title": "Le Mie Sessioni",
        "description": "Gestisci le tue sessioni attive e rivedi la cronologia degli accessi",
        "loading": "Caricamento sessioni...",
        "activeSessions": "Sessioni Attive",
        "totalSessions": "Totale Sessioni",
        "noSessions": "Nessuna sessione",
        "noSessionsDescription": "Nessuna sessione trovata per il tuo account.",
        "activeSession": "Sessione Attiva",
        "closedSession": "Sessione Chiusa",
        "unknown": "Sconosciuto",
        "mobile": "Mobile",
        "tablet": "Tablet",
        "desktop": "Desktop",
        "ipNotAvailable": "IP non disponibile",
        "created": "Creata",
        "lastActivity": "Ultima Attività",
        "expires": "Scade"
      },
      "profile": {
        "title": "Il Mio Profilo",
        "loading": "Caricamento profilo...",
        "personalInfo": "Informazioni Personali",
        "accountInfo": "Informazioni Account",
        "firstName": "Nome",
        "lastName": "Cognome",
        "displayName": "Nome Visualizzato",
        "dateOfBirth": "Data di Nascita",
        "city": "Città",
        "country": "Paese",
        "firstNamePlaceholder": "Il tuo nome",
        "lastNamePlaceholder": "Il tuo cognome",
        "displayNamePlaceholder": "Il tuo nome pubblico",
        "cityPlaceholder": "La tua città",
        "countryPlaceholder": "Seleziona paese",
        "memberSince": "Membro dal",
        "userId": "ID Utente",
        "creationDate": "Data di Creazione",
        "lastUpdate": "Ultimo Aggiornamento",
        "cancel": "Annulla",
        "saveChanges": "Salva Modifiche",
        "saving": "Salvataggio...",
        "success": "Profilo aggiornato con successo",
        "error": "Errore nell'aggiornamento del profilo"
      },
      "following": {
        "title": "Canali Seguiti",
        "loading": "Caricamento canali seguiti...",
        "channelsCount": "{{count}} canale",
        "channelsCountPlural": "{{count}} canali",
        "exploreChannels": "Esplora Canali",
        "noChannels": "Non stai seguendo nessun canale",
        "noChannelsDescription": "Inizia a seguire i canali per vederli qui e ricevere notifiche quando vanno in diretta.",
        "followingSince": "Seguito dal",
        "viewChannel": "Visualizza Canale →"
      },
      "viewerLogin": {
        "loading": "Caricamento...",
        "hello": "Ciao",
        "viewer": "Spettatore",
        "dashboard": "Dashboard",
        "logout": "Disconnetti",
        "loginAsViewer": "Accedi come Spettatore",
        "loginAsViewerAria": "Accedi come spettatore"
      },
      "navbar": {
        "searchPlaceholder": "Cerca canali..."
      },
      "otpModal": {
        "loginTitle": "Accedi",
        "verifyTitle": "Verifica codice",
        "emailLabel": "Indirizzo e-mail",
        "emailPlaceholder": "tuo@email.com",
        "sendCodeButton": "Invia codice",
        "sendingCode": "Invio...",
        "codeSentSuccess": "Codice inviato alla tua e-mail",
        "otpLabel": "Codice di verifica",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "Verifica codice",
        "verifyingCode": "Verifica...",
        "loginSuccess": "Accesso riuscito",
        "resendCode": "Invia di nuovo il codice",
        "resendIn": "Invia di nuovo tra",
        "resendCodeSuccess": "Codice inviato di nuovo",
        "backToEmail": "Torna all'e-mail",
        "invalidCode": "Codice non valido",
        "connectionError": "Errore di connessione",
        "sendCodeError": "Errore nell'invio del codice",
        "resendCodeError": "Errore nell'invio del codice",
        "codeSentTo": "Abbiamo inviato un codice di verifica a:",
        "closeButton": "Chiudi",
        "termsText": "Continuando, accetti i nostri termini di servizio e la politica sulla privacy.",
        "emailTemplate": {
          "verificationCode": "Il tuo codice di verifica",
          "hello": "Ciao",
          "useThisCode": "Usa questo codice per accedere:",
          "codeExpires": "Questo codice scade tra 10 minuti",
          "ignoreEmail": "Se non hai richiesto questo codice, puoi ignorare questa e-mail.",
          "copyright": "© 2025 iblups. Tutti i diritti riservati."
        }
      }
    }
  },
  "ja": {
    "common": {
      "navigation": {
        "home": "ホーム",
        "compare": "比較",
        "demo": "デモ",
        "debug": "デバッグ",
        "producerAccess": "プロデューサーアクセス",
        "viewerAccess": "視聴者としてログイン",
        "toggleMenu": "モバイルメニューの切り替え",
        "back": "戻る"
      },
      "tabs": {
        "all": "すべて",
        "popular": "人気",
        "recent": "最近"
      },
      "search": {
        "placeholder": "チャンネルを検索...",
        "liveChannels": "ライブチャンネル"
      },
      "channels": {
        "live": "ライブ",
        "loading": "チャンネルを読み込み中...",
        "error": "チャンネルの読み込みエラー",
        "notFound": "チャンネルが見つかりません",
        "retry": "再試行",
        "follow": "チャンネルをフォロー",
        "unfollow": "フォローを解除",
        "following": "フォロー中"
      },
      "footer": {
        "privacyPolicy": "プライバシーポリシー",
        "termsOfService": "利用規約",
        "support": "サポート",
        "copyright": "© 2025 danraf77 LLC - USA. 無断複写・転載を禁じます。",
        "poweredBy": "提供"
      },
      "player": {
        "loading": "読み込み中...",
        "error": "動画の読み込みエラー",
        "play": "再生",
        "pause": "一時停止",
        "mute": "ミュート",
        "unmute": "ミュート解除",
        "fullscreen": "全画面",
        "exitFullscreen": "全画面表示を終了"
      },
      "hero": {
        "title": "世界、一つのスクリーン。",
        "description": "つながるコンテンツ。知らせるニュース。感動を与える音楽。団結させるスポーツ。寄り添う映画、ポッドキャスト、ラジオ。",
        "subtitle": "すべてがここで、ライブで起こります。",
        "createChannel": "チャンネルを作成"
      },
      "pages": {
        "channel": {
          "title": "チャンネル",
          "loading": "チャンネルを読み込み中...",
          "notFound": "チャンネルが見つかりません",
          "liveStream": "ライブ配信"
        },
        "embed": {
          "title": "ライブ配信",
          "description": "ライブ配信を見る"
        }
      },
      "dashboard": {
        "title": "ダッシュボード",
        "welcome": "ようこそ、{{username}}さん！",
        "description": "ここでプロフィールを管理し、フォローしているチャンネルを確認できます。",
        "loading": "統計情報を読み込み中...",
        "stats": {
          "following": "フォロー中",
          "recentActivity": "最近のアクティビティ",
          "memberSince": "メンバー登録日"
        },
        "quickActions": {
          "title": "クイックアクション",
          "editProfile": "プロフィール編集",
          "editProfileDesc": "個人情報を更新する",
          "viewFollowing": "フォロー中を表示",
          "viewFollowingDesc": "お気に入りのチャンネルを管理する"
        },
        "sidebar": {
          "home": "ホーム",
          "profile": "マイプロフィール",
          "following": "フォロー中",
          "sessions": "セッション",
          "email": "メール",
          "logout": "ログアウト",
          "backToHome": "← ホームに戻る"
        },
        "loadingDashboard": "ダッシュボードを読み込み中..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "iblupsにログイン",
            "verify": "コードを確認"
          },
          "buttons": {
            "viewerLogin": "視聴者としてログイン",
            "followChannel": "チャンネルをフォロー",
            "unfollowChannel": "チャンネルのフォローを解除",
            "dashboard": "ダッシュボード",
            "hello": "こんにちは"
          },
          "email": {
            "description": "アクセスコードを受け取るためにメールアドレスを入力してください",
            "label": "メールアドレス",
            "placeholder": "your@email.com",
            "button": "コードを送信",
            "sending": "送信中..."
          },
          "otp": {
            "description": "に送信された4桁のコードを入力してください",
            "label": "確認コード",
            "placeholder": "0000",
            "button": "コードを確認",
            "verifying": "確認中...",
            "resend": "コードを再送信",
            "resending": "再送信中...",
            "changeEmail": "メールアドレスを変更"
          },
          "errors": {
            "emailRequired": "メールアドレスは必須です",
            "invalidEmail": "無効なメールアドレスです",
            "otpRequired": "コードは必須です",
            "invalidOtp": "コードが無効か、有効期限が切れています",
            "networkError": "ネットワークエラー。もう一度お試しください。",
            "serverError": "内部サーバーエラー"
          },
          "success": {
            "emailSent": "コードが正常に送信されました",
            "loginSuccess": "ログインに成功しました"
          }
        }
      },
      "email": {
        "title": "メール変更",
        "description": "OTP検証でメールアドレスを更新",
        "currentEmail": "現在のメール",
        "currentEmailDescription": "アカウントの現在のメール",
        "newEmail": "新しいメール",
        "verifyCode": "コード検証",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "検証コード",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "{{email}} に送信された4桁のコードを入力",
        "cancel": "キャンセル",
        "sendCode": "コード送信",
        "sending": "送信中...",
        "changeEmail": "メール変更",
        "verifyAndChange": "検証して変更",
        "verifying": "検証中...",
        "securityInfo": "セキュリティ情報",
        "otpVerification": "OTP検証",
        "otpVerificationDescription": "所有権を検証するために新しいメールに4桁のコードが送信されます",
        "security": "セキュリティ",
        "securityDescription": "メール変更にはアカウント保護のための検証が必要です",
        "success": {
          "codeSent": "検証コードが新しいメールに送信されました",
          "emailUpdated": "メールが正常に更新されました"
        },
        "errors": {
          "sendCodeError": "コード送信エラー",
          "verificationError": "コード検証エラー",
          "invalidCode": "無効な検証コード"
        }
      },
      "messages": {
        "errors": {
          "networkError": "ネットワークエラー。もう一度お試しください。",
          "invalidOtp": "OTPコードが無効か、有効期限が切れています。",
          "sendOtpError": "OTPコードの送信中にエラーが発生しました。",
          "followError": "チャンネルのフォロー中にエラーが発生しました。",
          "unfollowError": "チャンネルのフォロー解除中にエラーが発生しました。",
          "profileUpdateError": "プロフィールの更新中にエラーが発生しました。",
          "emailUpdateError": "メールアドレスの更新中にエラーが発生しました。",
          "sessionError": "セッションエラー。もう一度ログインしてください。",
          "unauthorized": "認証されていません。ログインしてください。",
          "serverError": "内部サーバーエラー。"
        },
        "success": {
          "profileUpdated": "プロフィールが正常に更新されました",
          "emailUpdated": "メールアドレスが正常に更新されました",
          "channelFollowed": "チャンネルを正常にフォローしました",
          "channelUnfollowed": "チャンネルのフォローを解除しました",
          "otpSent": "コードが正常に送信されました",
          "loginSuccess": "ログインに成功しました"
        },
        "info": {
          "noChannels": "まだチャンネルをフォローしていません",
          "visitChannels": "チャンネルにアクセスし、「チャンネルをフォロー」をクリックしてここに追加してください",
          "exploreChannels": "チャンネルを探す",
          "loading": "読み込み中...",
          "redirecting": "リダイレクト中...",
          "sessionExpired": "セッションの有効期限が切れました。もう一度ログインしてください。"
        }
      },
      "pagination": {
        "previous": "前へ",
        "next": "次へ",
        "pageOf": "ページ"
      },
      "sessions": {
        "title": "マイセッション",
        "description": "アクティブなセッションを管理し、アクセス履歴を確認します",
        "loading": "セッションを読み込み中...",
        "activeSessions": "アクティブセッション",
        "totalSessions": "総セッション数",
        "noSessions": "セッションがありません",
        "noSessionsDescription": "アカウントのセッションが見つかりませんでした。",
        "activeSession": "アクティブセッション",
        "closedSession": "閉じられたセッション",
        "unknown": "不明",
        "mobile": "モバイル",
        "tablet": "タブレット",
        "desktop": "デスクトップ",
        "ipNotAvailable": "IP利用不可",
        "created": "作成日時",
        "lastActivity": "最終活動",
        "expires": "有効期限"
      },
      "profile": {
        "title": "マイプロフィール",
        "loading": "プロフィールを読み込み中...",
        "personalInfo": "個人情報",
        "accountInfo": "アカウント情報",
        "firstName": "名",
        "lastName": "姓",
        "displayName": "表示名",
        "dateOfBirth": "生年月日",
        "city": "都市",
        "country": "国",
        "firstNamePlaceholder": "お名前",
        "lastNamePlaceholder": "お姓",
        "displayNamePlaceholder": "公開名",
        "cityPlaceholder": "お住まいの都市",
        "countryPlaceholder": "国を選択",
        "memberSince": "登録日",
        "userId": "ユーザーID",
        "creationDate": "作成日",
        "lastUpdate": "最終更新",
        "cancel": "キャンセル",
        "saveChanges": "変更を保存",
        "saving": "保存中...",
        "success": "プロフィールが正常に更新されました",
        "error": "プロフィールの更新中にエラーが発生しました"
      },
      "following": {
        "title": "フォロー中のチャンネル",
        "loading": "フォロー中のチャンネルを読み込み中...",
        "channelsCount": "{{count}} チャンネル",
        "channelsCountPlural": "{{count}} チャンネル",
        "exploreChannels": "チャンネルを探索",
        "noChannels": "フォロー中のチャンネルがありません",
        "noChannelsDescription": "チャンネルをフォローして、ここで表示し、ライブ配信時に通知を受け取るようにしましょう。",
        "followingSince": "フォロー開始日",
        "viewChannel": "チャンネルを見る →"
      },
      "viewerLogin": {
        "loading": "読み込み中...",
        "hello": "こんにちは",
        "viewer": "視聴者",
        "dashboard": "ダッシュボード",
        "logout": "ログアウト",
        "loginAsViewer": "視聴者としてログイン",
        "loginAsViewerAria": "視聴者としてログイン"
      },
      "navbar": {
        "searchPlaceholder": "チャンネルを検索..."
      },
      "otpModal": {
        "loginTitle": "ログイン",
        "verifyTitle": "コード確認",
        "emailLabel": "メールアドレス",
        "emailPlaceholder": "your@email.com",
        "sendCodeButton": "コード送信",
        "sendingCode": "送信中...",
        "codeSentSuccess": "コードをメールに送信しました",
        "otpLabel": "確認コード",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "コード確認",
        "verifyingCode": "確認中...",
        "loginSuccess": "ログイン成功",
        "resendCode": "コード再送信",
        "resendIn": "再送信",
        "resendCodeSuccess": "コードを再送信しました",
        "backToEmail": "メールに戻る",
        "invalidCode": "無効なコード",
        "connectionError": "接続エラー",
        "sendCodeError": "コード送信エラー",
        "resendCodeError": "コード再送信エラー",
        "codeSentTo": "確認コードを送信しました：",
        "closeButton": "閉じる",
        "termsText": "続行することで、利用規約とプライバシーポリシーに同意したことになります。",
        "emailTemplate": {
          "verificationCode": "認証コード",
          "hello": "こんにちは",
          "useThisCode": "このコードでログインしてください：",
          "codeExpires": "このコードは10分で期限切れになります",
          "ignoreEmail": "このコードをリクエストしていない場合は、このメールを無視できます。",
          "copyright": "© 2025 iblups. 全著作権所有。"
        }
      }
    }
  },
  "ko": {
    "common": {
      "navigation": {
        "home": "홈",
        "compare": "비교",
        "demo": "데모",
        "debug": "디버그",
        "producerAccess": "제작자 액세스",
        "viewerAccess": "시청자로 로그인",
        "toggleMenu": "모바일 메뉴 전환",
        "back": "뒤로"
      },
      "tabs": {
        "all": "모두",
        "popular": "인기",
        "recent": "최신"
      },
      "search": {
        "placeholder": "채널 검색...",
        "liveChannels": "라이브 채널"
      },
      "channels": {
        "live": "라이브",
        "loading": "채널 로드 중...",
        "error": "채널 로드 오류",
        "notFound": "채널을 찾을 수 없습니다",
        "retry": "재시도",
        "follow": "채널 팔로우",
        "unfollow": "팔로우 취소",
        "following": "팔로잉 중"
      },
      "footer": {
        "privacyPolicy": "개인정보 처리방침",
        "termsOfService": "서비스 이용약관",
        "support": "고객지원",
        "copyright": "© 2025 danraf77 LLC - USA. 모든 권리 보유.",
        "poweredBy": "제공"
      },
      "player": {
        "loading": "로드 중...",
        "error": "비디오 로드 오류",
        "play": "재생",
        "pause": "일시정지",
        "mute": "음소거",
        "unmute": "음소거 해제",
        "fullscreen": "전체 화면",
        "exitFullscreen": "전체 화면 종료"
      },
      "hero": {
        "title": "세상, 하나의 화면.",
        "description": "연결되는 콘텐츠. 정보를 주는 뉴스. 영감을 주는 음악. 하나로 만드는 스포츠. 함께하는 영화, 팟캐스트, 라디오.",
        "subtitle": "모든 것이 여기서, 라이브로 일어납니다.",
        "createChannel": "채널 만들기"
      },
      "pages": {
        "channel": {
          "title": "채널",
          "loading": "채널 로드 중...",
          "notFound": "채널을 찾을 수 없습니다",
          "liveStream": "라이브 스트림"
        },
        "embed": {
          "title": "라이브 스트림",
          "description": "라이브 스트림 시청"
        }
      },
      "dashboard": {
        "title": "대시보드",
        "welcome": "환영합니다, {{username}}님!",
        "description": "여기서 프로필을 관리하고 팔로우하는 채널을 볼 수 있습니다.",
        "loading": "통계 로딩 중...",
        "stats": {
          "following": "팔로우 중",
          "recentActivity": "최근 활동",
          "memberSince": "가입일"
        },
        "quickActions": {
          "title": "빠른 작업",
          "editProfile": "프로필 편집",
          "editProfileDesc": "개인 정보 업데이트",
          "viewFollowing": "팔로우 보기",
          "viewFollowingDesc": "즐겨찾는 채널 관리"
        },
        "sidebar": {
          "home": "홈",
          "profile": "내 프로필",
          "following": "팔로우 중",
          "sessions": "세션",
          "email": "이메일",
          "logout": "로그아웃",
          "backToHome": "← 홈으로 돌아가기"
        },
        "loadingDashboard": "대시보드 로딩 중..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "iblups에 로그인",
            "verify": "코드 확인"
          },
          "buttons": {
            "viewerLogin": "시청자로 로그인",
            "followChannel": "채널 팔로우",
            "unfollowChannel": "채널 팔로우 취소",
            "dashboard": "대시보드",
            "hello": "안녕하세요"
          },
          "email": {
            "description": "액세스 코드를 받으려면 이메일을 입력하세요",
            "label": "이메일",
            "placeholder": "your@email.com",
            "button": "코드 보내기",
            "sending": "보내는 중..."
          },
          "otp": {
            "description": "으로 전송된 4자리 코드를 입력하세요",
            "label": "인증 코드",
            "placeholder": "0000",
            "button": "코드 확인",
            "verifying": "확인 중...",
            "resend": "코드 재전송",
            "resending": "재전송 중...",
            "changeEmail": "이메일 변경"
          },
          "errors": {
            "emailRequired": "이메일은 필수입니다",
            "invalidEmail": "잘못된 이메일입니다",
            "otpRequired": "코드는 필수입니다",
            "invalidOtp": "코드가 잘못되었거나 만료되었습니다",
            "networkError": "네트워크 오류. 다시 시도해 주세요.",
            "serverError": "내부 서버 오류"
          },
          "success": {
            "emailSent": "코드가 성공적으로 전송되었습니다",
            "loginSuccess": "로그인 성공"
          }
        }
      },
      "email": {
        "title": "이메일 변경",
        "description": "OTP 인증으로 이메일 주소 업데이트",
        "currentEmail": "현재 이메일",
        "currentEmailDescription": "계정의 현재 이메일",
        "newEmail": "새 이메일",
        "verifyCode": "코드 인증",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "인증 코드",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "{{email}}로 전송된 4자리 코드를 입력하세요",
        "cancel": "취소",
        "sendCode": "코드 전송",
        "sending": "전송 중...",
        "changeEmail": "이메일 변경",
        "verifyAndChange": "인증하고 변경",
        "verifying": "인증 중...",
        "securityInfo": "보안 정보",
        "otpVerification": "OTP 인증",
        "otpVerificationDescription": "소유권을 확인하기 위해 새 이메일로 4자리 코드가 전송됩니다",
        "security": "보안",
        "securityDescription": "이메일 변경은 계정 보호를 위해 인증이 필요합니다",
        "success": {
          "codeSent": "인증 코드가 새 이메일로 전송되었습니다",
          "emailUpdated": "이메일이 성공적으로 업데이트되었습니다"
        },
        "errors": {
          "sendCodeError": "코드 전송 오류",
          "verificationError": "코드 인증 오류",
          "invalidCode": "유효하지 않은 인증 코드"
        }
      },
      "messages": {
        "errors": {
          "networkError": "네트워크 오류. 다시 시도해 주세요.",
          "invalidOtp": "OTP 코드가 잘못되었거나 만료되었습니다.",
          "sendOtpError": "OTP 코드 전송 오류.",
          "followError": "채널 팔로우 오류.",
          "unfollowError": "채널 팔로우 취소 오류.",
          "profileUpdateError": "프로필 업데이트 오류.",
          "emailUpdateError": "이메일 업데이트 오류.",
          "sessionError": "세션 오류. 다시 로그인해 주세요.",
          "unauthorized": "권한이 없습니다. 로그인해 주세요.",
          "serverError": "내부 서버 오류."
        },
        "success": {
          "profileUpdated": "프로필이 성공적으로 업데이트되었습니다",
          "emailUpdated": "이메일이 성공적으로 업데이트되었습니다",
          "channelFollowed": "채널을 성공적으로 팔로우했습니다",
          "channelUnfollowed": "채널 팔로우를 취소했습니다",
          "otpSent": "코드가 성공적으로 전송되었습니다",
          "loginSuccess": "로그인 성공"
        },
        "info": {
          "noChannels": "아직 팔로우하는 채널이 없습니다",
          "visitChannels": "채널을 방문하여 '채널 팔로우'를 클릭하여 여기에 추가하세요",
          "exploreChannels": "채널 탐색",
          "loading": "로드 중...",
          "redirecting": "리디렉션 중...",
          "sessionExpired": "세션이 만료되었습니다. 다시 로그인해 주세요."
        }
      },
      "pagination": {
        "previous": "이전",
        "next": "다음",
        "pageOf": "페이지"
      },
      "sessions": {
        "title": "내 세션",
        "description": "활성 세션을 관리하고 액세스 기록을 검토하세요",
        "loading": "세션 로딩 중...",
        "activeSessions": "활성 세션",
        "totalSessions": "총 세션 수",
        "noSessions": "세션이 없습니다",
        "noSessionsDescription": "계정에 대한 세션을 찾을 수 없습니다.",
        "activeSession": "활성 세션",
        "closedSession": "닫힌 세션",
        "unknown": "알 수 없음",
        "mobile": "모바일",
        "tablet": "태블릿",
        "desktop": "데스크톱",
        "ipNotAvailable": "IP 사용 불가",
        "created": "생성됨",
        "lastActivity": "마지막 활동",
        "expires": "만료"
      },
      "profile": {
        "title": "내 프로필",
        "loading": "프로필 로딩 중...",
        "personalInfo": "개인 정보",
        "accountInfo": "계정 정보",
        "firstName": "이름",
        "lastName": "성",
        "displayName": "표시 이름",
        "dateOfBirth": "생년월일",
        "city": "도시",
        "country": "국가",
        "firstNamePlaceholder": "이름을 입력하세요",
        "lastNamePlaceholder": "성을 입력하세요",
        "displayNamePlaceholder": "공개 이름",
        "cityPlaceholder": "도시를 입력하세요",
        "countryPlaceholder": "국가 선택",
        "memberSince": "가입일",
        "userId": "사용자 ID",
        "creationDate": "생성일",
        "lastUpdate": "마지막 업데이트",
        "cancel": "취소",
        "saveChanges": "변경사항 저장",
        "saving": "저장 중...",
        "success": "프로필이 성공적으로 업데이트되었습니다",
        "error": "프로필 업데이트 중 오류가 발생했습니다"
      },
      "following": {
        "title": "팔로우 중인 채널",
        "loading": "팔로우 중인 채널 로딩 중...",
        "channelsCount": "{{count}}개 채널",
        "channelsCountPlural": "{{count}}개 채널",
        "exploreChannels": "채널 탐색",
        "noChannels": "팔로우 중인 채널이 없습니다",
        "noChannelsDescription": "채널을 팔로우하여 여기에서 확인하고 라이브 방송 시 알림을 받으세요.",
        "followingSince": "팔로우 시작일",
        "viewChannel": "채널 보기 →"
      },
      "viewerLogin": {
        "loading": "로딩 중...",
        "hello": "안녕하세요",
        "viewer": "시청자",
        "dashboard": "대시보드",
        "logout": "로그아웃",
        "loginAsViewer": "시청자로 로그인",
        "loginAsViewerAria": "시청자로 로그인"
      },
      "navbar": {
        "searchPlaceholder": "채널 검색..."
      },
      "otpModal": {
        "loginTitle": "로그인",
        "verifyTitle": "코드 확인",
        "emailLabel": "이메일 주소",
        "emailPlaceholder": "your@email.com",
        "sendCodeButton": "코드 전송",
        "sendingCode": "전송 중...",
        "codeSentSuccess": "코드가 이메일로 전송되었습니다",
        "otpLabel": "인증 코드",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "코드 확인",
        "verifyingCode": "확인 중...",
        "loginSuccess": "로그인 성공",
        "resendCode": "코드 재전송",
        "resendIn": "재전송",
        "resendCodeSuccess": "코드가 재전송되었습니다",
        "backToEmail": "이메일로 돌아가기",
        "invalidCode": "유효하지 않은 코드",
        "connectionError": "연결 오류",
        "sendCodeError": "코드 전송 오류",
        "resendCodeError": "코드 재전송 오류",
        "codeSentTo": "인증 코드를 다음으로 전송했습니다:",
        "closeButton": "닫기",
        "termsText": "계속하시면 서비스 약관 및 개인정보 보호정책에 동의하는 것입니다.",
        "emailTemplate": {
          "verificationCode": "인증 코드",
          "hello": "안녕하세요",
          "useThisCode": "이 코드로 로그인하세요:",
          "codeExpires": "이 코드는 10분 후 만료됩니다",
          "ignoreEmail": "이 코드를 요청하지 않았다면 이 이메일을 무시할 수 있습니다.",
          "copyright": "© 2025 iblups. 모든 권리 보유."
        }
      }
    }
  },
  "pl": {
    "common": {
      "navigation": {
        "home": "Strona główna",
        "compare": "Porównaj",
        "demo": "Demo",
        "debug": "Debuguj",
        "producerAccess": "Dostęp producenta",
        "viewerAccess": "Dostęp dla widzów",
        "toggleMenu": "Przełącz menu mobilne",
        "back": "Wróć"
      },
      "tabs": {
        "all": "Wszystkie",
        "popular": "Popularne",
        "recent": "Ostatnie"
      },
      "search": {
        "placeholder": "Szukaj kanałów...",
        "liveChannels": "kanały na żywo"
      },
      "channels": {
        "live": "NA ŻYWO",
        "loading": "Ładowanie kanałów...",
        "error": "Błąd ładowania kanałów",
        "notFound": "Nie znaleziono kanałów",
        "retry": "Spróbuj ponownie",
        "follow": "Obserwuj kanał",
        "unfollow": "Przestań obserwować",
        "following": "Obserwujesz"
      },
      "footer": {
        "privacyPolicy": "Polityka prywatności",
        "termsOfService": "Warunki korzystania z usługi",
        "support": "Wsparcie",
        "copyright": "© 2025 danraf77 LLC - USA. Wszelkie prawa zastrzeżone.",
        "poweredBy": "Oparte na"
      },
      "player": {
        "loading": "Ładowanie...",
        "error": "Błąd ładowania wideo",
        "play": "Odtwarzaj",
        "pause": "Pauza",
        "mute": "Wycisz",
        "unmute": "Wyłącz wyciszenie",
        "fullscreen": "Pełny ekran",
        "exitFullscreen": "Opuść pełny ekran"
      },
      "hero": {
        "title": "Świat, jeden ekran.",
        "description": "Treści, które łączą. Wiadomości, które informują. Muzyka, która inspiruje. Sport, który jednoczy. Kino, podcasty i radio, które towarzyszą.",
        "subtitle": "Wszystko dzieje się tutaj, na żywo.",
        "createChannel": "Stwórz swój kanał"
      },
      "pages": {
        "channel": {
          "title": "Kanał",
          "loading": "Ładowanie kanału...",
          "notFound": "Kanał nie został znaleziony",
          "liveStream": "Transmisja na żywo"
        },
        "embed": {
          "title": "Transmisja na żywo",
          "description": "Oglądaj transmisję na żywo"
        }
      },
      "dashboard": {
        "title": "Panel",
        "welcome": "Witaj, {{username}}!",
        "description": "Tutaj możesz zarządzać swoim profilem i zobaczyć kanały, które obserwujesz.",
        "loading": "Ładowanie statystyk...",
        "stats": {
          "following": "Obserwowane",
          "recentActivity": "Ostatnia aktywność",
          "memberSince": "Członek od"
        },
        "quickActions": {
          "title": "Szybkie akcje",
          "editProfile": "Edytuj profil",
          "editProfileDesc": "Zaktualizuj swoje dane osobowe",
          "viewFollowing": "Zobacz obserwowane",
          "viewFollowingDesc": "Zarządzaj ulubionymi kanałami"
        },
        "sidebar": {
          "home": "Strona główna",
          "profile": "Mój profil",
          "following": "Obserwowane",
          "sessions": "Sesje",
          "email": "E-mail",
          "logout": "Wyloguj",
          "backToHome": "← Powrót do strony głównej"
        },
        "loadingDashboard": "Ładowanie panelu..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "Zaloguj się do iblups",
            "verify": "Zweryfikuj kod"
          },
          "buttons": {
            "viewerLogin": "Zaloguj się jako widz",
            "followChannel": "Obserwuj kanał",
            "unfollowChannel": "Przestań obserwować kanał",
            "dashboard": "Panel",
            "hello": "Cześć"
          },
          "email": {
            "description": "Wpisz swój adres e-mail, aby otrzymać kod dostępu",
            "label": "E-mail",
            "placeholder": "twoj@email.com",
            "button": "Wyślij kod",
            "sending": "Wysyłanie..."
          },
          "otp": {
            "description": "Wpisz 4-cyfrowy kod wysłany na adres",
            "label": "Kod weryfikacyjny",
            "placeholder": "0000",
            "button": "Zweryfikuj kod",
            "verifying": "Weryfikowanie...",
            "resend": "Wyślij kod ponownie",
            "resending": "Wysyłanie ponowne...",
            "changeEmail": "Zmień e-mail"
          },
          "errors": {
            "emailRequired": "E-mail jest wymagany",
            "invalidEmail": "Nieprawidłowy adres e-mail",
            "otpRequired": "Kod jest wymagany",
            "invalidOtp": "Nieprawidłowy lub wygasły kod",
            "networkError": "Błąd sieci. Spróbuj ponownie.",
            "serverError": "Wewnętrzny błąd serwera"
          },
          "success": {
            "emailSent": "Kod został pomyślnie wysłany",
            "loginSuccess": "Logowanie udane"
          }
        }
      },
      "email": {
        "title": "Zmień E-mail",
        "description": "Zaktualizuj swój adres e-mail z weryfikacją OTP",
        "currentEmail": "Aktualny E-mail",
        "currentEmailDescription": "Aktualny e-mail Twojego konta",
        "newEmail": "Nowy E-mail",
        "verifyCode": "Zweryfikuj Kod",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "Kod Weryfikacyjny",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "Wprowadź 4-cyfrowy kod wysłany na {{email}}",
        "cancel": "Anuluj",
        "sendCode": "Wyślij Kod",
        "sending": "Wysyłanie...",
        "changeEmail": "Zmień E-mail",
        "verifyAndChange": "Zweryfikuj i Zmień",
        "verifying": "Weryfikacja...",
        "securityInfo": "Informacje Bezpieczeństwa",
        "otpVerification": "Weryfikacja OTP",
        "otpVerificationDescription": "4-cyfrowy kod zostanie wysłany na nowy e-mail w celu weryfikacji własności",
        "security": "Bezpieczeństwo",
        "securityDescription": "Zmiana e-maila wymaga weryfikacji w celu ochrony Twojego konta",
        "success": {
          "codeSent": "Kod weryfikacyjny wysłany na nowy e-mail",
          "emailUpdated": "E-mail pomyślnie zaktualizowany"
        },
        "errors": {
          "sendCodeError": "Błąd wysyłania kodu",
          "verificationError": "Błąd weryfikacji kodu",
          "invalidCode": "Nieprawidłowy kod weryfikacyjny"
        }
      },
      "messages": {
        "errors": {
          "networkError": "Błąd sieci. Spróbuj ponownie.",
          "invalidOtp": "Nieprawidłowy lub wygasły kod OTP.",
          "sendOtpError": "Błąd podczas wysyłania kodu OTP.",
          "followError": "Błąd podczas obserwowania kanału.",
          "unfollowError": "Błąd podczas anulowania obserwacji kanału.",
          "profileUpdateError": "Błąd podczas aktualizacji profilu.",
          "emailUpdateError": "Błąd podczas aktualizacji adresu e-mail.",
          "sessionError": "Błąd sesji. Zaloguj się ponownie.",
          "unauthorized": "Brak autoryzacji. Proszę się zalogować.",
          "serverError": "Wewnętrzny błąd serwera."
        },
        "success": {
          "profileUpdated": "Profil został pomyślnie zaktualizowany",
          "emailUpdated": "Adres e-mail został pomyślnie zaktualizowany",
          "channelFollowed": "Pomyślnie zaobserwowano kanał",
          "channelUnfollowed": "Przestałeś obserwować kanał",
          "otpSent": "Kod został pomyślnie wysłany",
          "loginSuccess": "Logowanie udane"
        },
        "info": {
          "noChannels": "Nie obserwujesz jeszcze żadnych kanałów",
          "visitChannels": "Odwiedź kanały i kliknij \"Obserwuj kanał\", aby dodać je tutaj",
          "exploreChannels": "Przeglądaj kanały",
          "loading": "Ładowanie...",
          "redirecting": "Przekierowywanie...",
          "sessionExpired": "Twoja sesja wygasła. Zaloguj się ponownie."
        }
      },
      "pagination": {
        "previous": "Poprzednia",
        "next": "Następna",
        "pageOf": "Strona"
      },
      "sessions": {
        "title": "Moje Sesje",
        "description": "Zarządzaj aktywnymi sesjami i przeglądaj historię dostępu",
        "loading": "Ładowanie sesji...",
        "activeSessions": "Aktywne Sesje",
        "totalSessions": "Łącznie Sesji",
        "noSessions": "Brak sesji",
        "noSessionsDescription": "Nie znaleziono sesji dla Twojego konta.",
        "activeSession": "Aktywna Sesja",
        "closedSession": "Zamknięta Sesja",
        "unknown": "Nieznane",
        "mobile": "Mobilne",
        "tablet": "Tablet",
        "desktop": "Pulpit",
        "ipNotAvailable": "IP niedostępne",
        "created": "Utworzona",
        "lastActivity": "Ostatnia Aktywność",
        "expires": "Wygasa"
      },
      "profile": {
        "title": "Mój Profil",
        "loading": "Ładowanie profilu...",
        "personalInfo": "Informacje Osobiste",
        "accountInfo": "Informacje o Koncie",
        "firstName": "Imię",
        "lastName": "Nazwisko",
        "displayName": "Nazwa Wyświetlana",
        "dateOfBirth": "Data Urodzenia",
        "city": "Miasto",
        "country": "Kraj",
        "firstNamePlaceholder": "Twoje imię",
        "lastNamePlaceholder": "Twoje nazwisko",
        "displayNamePlaceholder": "Twoja publiczna nazwa",
        "cityPlaceholder": "Twoje miasto",
        "countryPlaceholder": "Wybierz kraj",
        "memberSince": "Członek od",
        "userId": "ID Użytkownika",
        "creationDate": "Data Utworzenia",
        "lastUpdate": "Ostatnia Aktualizacja",
        "cancel": "Anuluj",
        "saveChanges": "Zapisz Zmiany",
        "saving": "Zapisywanie...",
        "success": "Profil został pomyślnie zaktualizowany",
        "error": "Błąd podczas aktualizacji profilu"
      },
      "following": {
        "title": "Obserwowane Kanały",
        "loading": "Ładowanie obserwowanych kanałów...",
        "channelsCount": "{{count}} kanał",
        "channelsCountPlural": "{{count}} kanałów",
        "exploreChannels": "Przeglądaj Kanały",
        "noChannels": "Nie obserwujesz żadnych kanałów",
        "noChannelsDescription": "Zacznij obserwować kanały, aby zobaczyć je tutaj i otrzymywać powiadomienia, gdy są na żywo.",
        "followingSince": "Obserwowane od",
        "viewChannel": "Zobacz Kanał →"
      },
      "viewerLogin": {
        "loading": "Ładowanie...",
        "hello": "Cześć",
        "viewer": "Widz",
        "dashboard": "Panel",
        "logout": "Wyloguj",
        "loginAsViewer": "Zaloguj jako Widz",
        "loginAsViewerAria": "Zaloguj jako widz"
      },
      "navbar": {
        "searchPlaceholder": "Szukaj kanałów..."
      },
      "otpModal": {
        "loginTitle": "Zaloguj się",
        "verifyTitle": "Zweryfikuj kod",
        "emailLabel": "Adres e-mail",
        "emailPlaceholder": "twoj@email.com",
        "sendCodeButton": "Wyślij kod",
        "sendingCode": "Wysyłanie...",
        "codeSentSuccess": "Kod wysłany na Twój e-mail",
        "otpLabel": "Kod weryfikacyjny",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "Zweryfikuj kod",
        "verifyingCode": "Weryfikacja...",
        "loginSuccess": "Logowanie udane",
        "resendCode": "Wyślij ponownie kod",
        "resendIn": "Wyślij ponownie za",
        "resendCodeSuccess": "Kod wysłany ponownie",
        "backToEmail": "Wróć do e-maila",
        "invalidCode": "Nieprawidłowy kod",
        "connectionError": "Błąd połączenia",
        "sendCodeError": "Błąd wysyłania kodu",
        "resendCodeError": "Błąd ponownego wysyłania kodu",
        "codeSentTo": "Wysłaliśmy kod weryfikacyjny na:",
        "closeButton": "Zamknij",
        "termsText": "Kontynuując, akceptujesz nasze warunki usługi i politykę prywatności.",
        "emailTemplate": {
          "verificationCode": "Twój kod weryfikacyjny",
          "hello": "Cześć",
          "useThisCode": "Użyj tego kodu, aby się zalogować:",
          "codeExpires": "Ten kod wygasa za 10 minut",
          "ignoreEmail": "Jeśli nie prosiłeś o ten kod, możesz zignorować ten e-mail.",
          "copyright": "© 2025 iblups. Wszelkie prawa zastrzeżone."
        }
      }
    }
  },
  "pt": {
    "common": {
      "navigation": {
        "home": "Início",
        "compare": "Comparar",
        "demo": "Demonstração",
        "debug": "Depurar",
        "producerAccess": "Acesso de produtor",
        "viewerAccess": "Acesso de espectador",
        "toggleMenu": "Alternar menu móvel",
        "back": "Voltar"
      },
      "tabs": {
        "all": "Todos",
        "popular": "Popular",
        "recent": "Recente"
      },
      "search": {
        "placeholder": "Buscar canais...",
        "liveChannels": "canais ao vivo"
      },
      "channels": {
        "live": "AO VIVO",
        "loading": "Carregando canais...",
        "error": "Erro ao carregar canais",
        "notFound": "Nenhum canal encontrado",
        "retry": "Tentar novamente",
        "follow": "Seguir canal",
        "unfollow": "Deixar de seguir",
        "following": "Seguindo"
      },
      "footer": {
        "privacyPolicy": "Política de Privacidade",
        "termsOfService": "Termos de Serviço",
        "support": "Suporte",
        "copyright": "© 2025 danraf77 LLC - USA. Todos os direitos reservados.",
        "poweredBy": "Desenvolvido por"
      },
      "player": {
        "loading": "Carregando...",
        "error": "Erro ao carregar vídeo",
        "play": "Reproduzir",
        "pause": "Pausar",
        "mute": "Silenciar",
        "unmute": "Ativar som",
        "fullscreen": "Tela cheia",
        "exitFullscreen": "Sair da tela cheia"
      },
      "hero": {
        "title": "O Mundo, uma Tela.",
        "description": "Conteúdo que conecta. Notícias que informam. Música que inspira. Esportes que unem. Cinema, podcasts e rádios que acompanham.",
        "subtitle": "Tudo acontece aqui, ao vivo.",
        "createChannel": "Crie seu canal"
      },
      "pages": {
        "channel": {
          "title": "Canal",
          "loading": "Carregando canal...",
          "notFound": "Canal não encontrado",
          "liveStream": "Transmissão ao vivo"
        },
        "embed": {
          "title": "Transmissão ao vivo",
          "description": "Assistir transmissão ao vivo"
        }
      },
      "dashboard": {
        "title": "Painel",
        "welcome": "Bem-vindo, {{username}}!",
        "description": "Aqui você pode gerenciar seu perfil e ver os canais que você segue.",
        "loading": "Carregando estatísticas...",
        "stats": {
          "following": "Seguindo",
          "recentActivity": "Atividade Recente",
          "memberSince": "Membro desde"
        },
        "quickActions": {
          "title": "Ações Rápidas",
          "editProfile": "Editar Perfil",
          "editProfileDesc": "Atualize suas informações pessoais",
          "viewFollowing": "Ver Seguindo",
          "viewFollowingDesc": "Gerencie seus canais favoritos"
        },
        "sidebar": {
          "home": "Início",
          "profile": "Meu Perfil",
          "following": "Seguindo",
          "sessions": "Sessões",
          "email": "E-mail",
          "logout": "Sair",
          "backToHome": "← Voltar ao início"
        },
        "loadingDashboard": "Carregando painel..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "Entrar no iblups",
            "verify": "Verificar código"
          },
          "buttons": {
            "viewerLogin": "Entrar como espectador",
            "followChannel": "Seguir canal",
            "unfollowChannel": "Deixar de seguir o canal",
            "dashboard": "Painel",
            "hello": "Olá"
          },
          "email": {
            "description": "Digite seu e-mail para receber um código de acesso",
            "label": "E-mail",
            "placeholder": "seu@email.com",
            "button": "Enviar código",
            "sending": "Enviando..."
          },
          "otp": {
            "description": "Digite o código de 4 dígitos enviado para",
            "label": "Código de verificação",
            "placeholder": "0000",
            "button": "Verificar código",
            "verifying": "Verificando...",
            "resend": "Reenviar código",
            "resending": "Reenviando...",
            "changeEmail": "Alterar e-mail"
          },
          "errors": {
            "emailRequired": "O e-mail é obrigatório",
            "invalidEmail": "E-mail inválido",
            "otpRequired": "O código é obrigatório",
            "invalidOtp": "Código inválido ou expirado",
            "networkError": "Erro de rede. Tente novamente.",
            "serverError": "Erro interno do servidor"
          },
          "success": {
            "emailSent": "Código enviado com sucesso",
            "loginSuccess": "Login realizado com sucesso"
          }
        }
      },
      "email": {
        "title": "Alterar E-mail",
        "description": "Atualize seu endereço de e-mail com verificação OTP",
        "currentEmail": "E-mail Atual",
        "currentEmailDescription": "E-mail atual da sua conta",
        "newEmail": "Novo E-mail",
        "verifyCode": "Verificar Código",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "Código de Verificação",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "Digite o código de 4 dígitos enviado para {{email}}",
        "cancel": "Cancelar",
        "sendCode": "Enviar Código",
        "sending": "Enviando...",
        "changeEmail": "Alterar E-mail",
        "verifyAndChange": "Verificar e Alterar",
        "verifying": "Verificando...",
        "securityInfo": "Informações de Segurança",
        "otpVerification": "Verificação OTP",
        "otpVerificationDescription": "Um código de 4 dígitos será enviado para o novo e-mail para verificar a propriedade",
        "security": "Segurança",
        "securityDescription": "A alteração de e-mail requer verificação para proteger sua conta",
        "success": {
          "codeSent": "Código de verificação enviado para o novo e-mail",
          "emailUpdated": "E-mail atualizado com sucesso"
        },
        "errors": {
          "sendCodeError": "Erro ao enviar código",
          "verificationError": "Erro ao verificar código",
          "invalidCode": "Código de verificação inválido"
        }
      },
      "messages": {
        "errors": {
          "networkError": "Erro de rede. Tente novamente.",
          "invalidOtp": "Código OTP inválido ou expirado.",
          "sendOtpError": "Erro ao enviar o código OTP.",
          "followError": "Erro ao seguir o canal.",
          "unfollowError": "Erro ao deixar de seguir o canal.",
          "profileUpdateError": "Erro ao atualizar o perfil.",
          "emailUpdateError": "Erro ao atualizar o e-mail.",
          "sessionError": "Erro de sessão. Por favor, faça login novamente.",
          "unauthorized": "Não autorizado. Por favor, faça login.",
          "serverError": "Erro interno do servidor."
        },
        "success": {
          "profileUpdated": "Perfil atualizado com sucesso",
          "emailUpdated": "E-mail atualizado com sucesso",
          "channelFollowed": "Canal seguido com sucesso",
          "channelUnfollowed": "Você deixou de seguir o canal",
          "otpSent": "Código enviado com sucesso",
          "loginSuccess": "Login realizado com sucesso"
        },
        "info": {
          "noChannels": "Você ainda não segue nenhum canal",
          "visitChannels": "Visite os canais e clique em \"Seguir canal\" para adicioná-los aqui",
          "exploreChannels": "Explorar Canais",
          "loading": "Carregando...",
          "redirecting": "Redirecionando...",
          "sessionExpired": "Sua sessão expirou. Por favor, faça login novamente."
        }
      },
      "pagination": {
        "previous": "Anterior",
        "next": "Próximo",
        "pageOf": "Página"
      },
      "sessions": {
        "title": "Minhas Sessões",
        "description": "Gerencie suas sessões ativas e revise o histórico de acesso",
        "loading": "Carregando sessões...",
        "activeSessions": "Sessões Ativas",
        "totalSessions": "Total de Sessões",
        "noSessions": "Nenhuma sessão",
        "noSessionsDescription": "Nenhuma sessão encontrada para sua conta.",
        "activeSession": "Sessão Ativa",
        "closedSession": "Sessão Fechada",
        "unknown": "Desconhecido",
        "mobile": "Móvel",
        "tablet": "Tablet",
        "desktop": "Desktop",
        "ipNotAvailable": "IP não disponível",
        "created": "Criada",
        "lastActivity": "Última Atividade",
        "expires": "Expira"
      },
      "profile": {
        "title": "Meu Perfil",
        "loading": "Carregando perfil...",
        "personalInfo": "Informações Pessoais",
        "accountInfo": "Informações da Conta",
        "firstName": "Nome",
        "lastName": "Sobrenome",
        "displayName": "Nome de Exibição",
        "dateOfBirth": "Data de Nascimento",
        "city": "Cidade",
        "country": "País",
        "firstNamePlaceholder": "Seu nome",
        "lastNamePlaceholder": "Seu sobrenome",
        "displayNamePlaceholder": "Seu nome público",
        "cityPlaceholder": "Sua cidade",
        "countryPlaceholder": "Selecionar país",
        "memberSince": "Membro desde",
        "userId": "ID do Usuário",
        "creationDate": "Data de Criação",
        "lastUpdate": "Última Atualização",
        "cancel": "Cancelar",
        "saveChanges": "Salvar Alterações",
        "saving": "Salvando...",
        "success": "Perfil atualizado com sucesso",
        "error": "Erro ao atualizar perfil"
      },
      "following": {
        "title": "Canais Seguidos",
        "loading": "Carregando canais seguidos...",
        "channelsCount": "{{count}} canal",
        "channelsCountPlural": "{{count}} canais",
        "exploreChannels": "Explorar Canais",
        "noChannels": "Você não está seguindo nenhum canal",
        "noChannelsDescription": "Comece a seguir canais para vê-los aqui e receber notificações quando estiverem ao vivo.",
        "followingSince": "Seguindo desde",
        "viewChannel": "Ver Canal →"
      },
      "viewerLogin": {
        "loading": "Carregando...",
        "hello": "Olá",
        "viewer": "Visualizador",
        "dashboard": "Painel",
        "logout": "Sair",
        "loginAsViewer": "Entrar como Visualizador",
        "loginAsViewerAria": "Entrar como visualizador"
      },
      "navbar": {
        "searchPlaceholder": "Pesquisar canais..."
      },
      "otpModal": {
        "loginTitle": "Entrar",
        "verifyTitle": "Verificar código",
        "emailLabel": "Endereço de e-mail",
        "emailPlaceholder": "seu@email.com",
        "sendCodeButton": "Enviar código",
        "sendingCode": "Enviando...",
        "codeSentSuccess": "Código enviado para seu e-mail",
        "otpLabel": "Código de verificação",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "Verificar código",
        "verifyingCode": "Verificando...",
        "loginSuccess": "Login bem-sucedido",
        "resendCode": "Reenviar código",
        "resendIn": "Reenviar em",
        "resendCodeSuccess": "Código reenviado",
        "backToEmail": "Voltar ao e-mail",
        "invalidCode": "Código inválido",
        "connectionError": "Erro de conexão",
        "sendCodeError": "Erro ao enviar código",
        "resendCodeError": "Erro ao reenviar código",
        "codeSentTo": "Enviamos um código de verificação para:",
        "closeButton": "Fechar",
        "termsText": "Ao continuar, você aceita nossos termos de serviço e política de privacidade.",
        "emailTemplate": {
          "verificationCode": "Seu código de verificação",
          "hello": "Olá",
          "useThisCode": "Use este código para fazer login:",
          "codeExpires": "Este código expira em 10 minutos",
          "ignoreEmail": "Se você não solicitou este código, pode ignorar este e-mail.",
          "copyright": "© 2025 iblups. Todos os direitos reservados."
        }
      }
    }
  },
  "ru": {
    "common": {
      "navigation": {
        "home": "Главная",
        "compare": "Сравнить",
        "demo": "Демо",
        "debug": "Отладка",
        "producerAccess": "Доступ для создателей",
        "viewerAccess": "Вход для зрителей",
        "toggleMenu": "Переключить мобильное меню",
        "back": "Назад"
      },
      "tabs": {
        "all": "Все",
        "popular": "Популярные",
        "recent": "Недавние"
      },
      "search": {
        "placeholder": "Поиск каналов...",
        "liveChannels": "каналы в прямом эфире"
      },
      "channels": {
        "live": "В ЭФИРЕ",
        "loading": "Загрузка каналов...",
        "error": "Ошибка загрузки каналов",
        "notFound": "Каналы не найдены",
        "retry": "Повторить",
        "follow": "Подписаться на канал",
        "unfollow": "Отписаться",
        "following": "Вы подписаны"
      },
      "footer": {
        "privacyPolicy": "Политика конфиденциальности",
        "termsOfService": "Условия обслуживания",
        "support": "Поддержка",
        "copyright": "© 2025 danraf77 LLC - USA. Все права защищены.",
        "poweredBy": "Разработано"
      },
      "player": {
        "loading": "Загрузка...",
        "error": "Ошибка загрузки видео",
        "play": "Воспроизвести",
        "pause": "Пауза",
        "mute": "Выключить звук",
        "unmute": "Включить звук",
        "fullscreen": "Полный экран",
        "exitFullscreen": "Выйти из полноэкранного режима"
      },
      "hero": {
        "title": "Мир — один экран.",
        "description": "Контент, который объединяет. Новости, которые информируют. Музыка, которая вдохновляет. Спорт, который сближает. Кино, подкасты и радио, которые сопровождают.",
        "subtitle": "Все происходит здесь, в прямом эфире.",
        "createChannel": "Создать свой канал"
      },
      "pages": {
        "channel": {
          "title": "Канал",
          "loading": "Загрузка канала...",
          "notFound": "Канал не найден",
          "liveStream": "Прямая трансляция"
        },
        "embed": {
          "title": "Прямая трансляция",
          "description": "Смотреть прямую трансляцию"
        }
      },
      "dashboard": {
        "title": "Панель управления",
        "welcome": "Добро пожаловать, {{username}}!",
        "description": "Здесь вы можете управлять своим профилем и просматривать каналы, на которые подписаны.",
        "loading": "Загрузка статистики...",
        "stats": {
          "following": "Подписки",
          "recentActivity": "Недавняя активность",
          "memberSince": "Участник с"
        },
        "quickActions": {
          "title": "Быстрые действия",
          "editProfile": "Редактировать профиль",
          "editProfileDesc": "Обновите свою личную информацию",
          "viewFollowing": "Просмотр подписок",
          "viewFollowingDesc": "Управляйте любимыми каналами"
        },
        "sidebar": {
          "home": "Главная",
          "profile": "Мой профиль",
          "following": "Подписки",
          "sessions": "Сессии",
          "email": "Электронная почта",
          "logout": "Выйти",
          "backToHome": "← Вернуться на главную"
        },
        "loadingDashboard": "Загрузка панели управления..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "Войти в iblups",
            "verify": "Проверить код"
          },
          "buttons": {
            "viewerLogin": "Вход для зрителей",
            "followChannel": "Подписаться на канал",
            "unfollowChannel": "Отписаться от канала",
            "dashboard": "Панель управления",
            "hello": "Привет"
          },
          "email": {
            "description": "Введите свой адрес электронной почты, чтобы получить код доступа",
            "label": "Email",
            "placeholder": "vash@email.com",
            "button": "Отправить код",
            "sending": "Отправка..."
          },
          "otp": {
            "description": "Введите 4-значный код, отправленный на",
            "label": "Код подтверждения",
            "placeholder": "0000",
            "button": "Проверить код",
            "verifying": "Проверка...",
            "resend": "Отправить код повторно",
            "resending": "Повторная отправка...",
            "changeEmail": "Изменить email"
          },
          "errors": {
            "emailRequired": "Требуется адрес электронной почты",
            "invalidEmail": "Неверный адрес электронной почты",
            "otpRequired": "Требуется код",
            "invalidOtp": "Неверный или истекший код",
            "networkError": "Сетевая ошибка. Попробуйте снова.",
            "serverError": "Внутренняя ошибка сервера"
          },
          "success": {
            "emailSent": "Код успешно отправлен",
            "loginSuccess": "Вход выполнен успешно"
          }
        }
      },
      "email": {
        "title": "Изменить E-mail",
        "description": "Обновите свой адрес электронной почты с OTP-проверкой",
        "currentEmail": "Текущий E-mail",
        "currentEmailDescription": "Текущий e-mail вашего аккаунта",
        "newEmail": "Новый E-mail",
        "verifyCode": "Проверить Код",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "Код Проверки",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "Введите 4-значный код, отправленный на {{email}}",
        "cancel": "Отмена",
        "sendCode": "Отправить Код",
        "sending": "Отправка...",
        "changeEmail": "Изменить E-mail",
        "verifyAndChange": "Проверить и Изменить",
        "verifying": "Проверка...",
        "securityInfo": "Информация о Безопасности",
        "otpVerification": "OTP-Проверка",
        "otpVerificationDescription": "4-значный код будет отправлен на новый e-mail для проверки владения",
        "security": "Безопасность",
        "securityDescription": "Изменение e-mail требует проверки для защиты вашего аккаунта",
        "success": {
          "codeSent": "Код проверки отправлен на новый e-mail",
          "emailUpdated": "E-mail успешно обновлен"
        },
        "errors": {
          "sendCodeError": "Ошибка отправки кода",
          "verificationError": "Ошибка проверки кода",
          "invalidCode": "Недействительный код проверки"
        }
      },
      "messages": {
        "errors": {
          "networkError": "Сетевая ошибка. Попробуйте снова.",
          "invalidOtp": "Неверный или истекший OTP-код.",
          "sendOtpError": "Ошибка при отправке OTP-кода.",
          "followError": "Ошибка при подписке на канал.",
          "unfollowError": "Ошибка при отписке от канала.",
          "profileUpdateError": "Ошибка при обновлении профиля.",
          "emailUpdateError": "Ошибка при обновлении адреса электронной почты.",
          "sessionError": "Ошибка сеанса. Пожалуйста, войдите снова.",
          "unauthorized": "Не авторизован. Пожалуйста, войдите.",
          "serverError": "Внутренняя ошибка сервера."
        },
        "success": {
          "profileUpdated": "Профиль успешно обновлен",
          "emailUpdated": "Email успешно обновлен",
          "channelFollowed": "Вы успешно подписались на канал",
          "channelUnfollowed": "Вы отписались от канала",
          "otpSent": "Код успешно отправлен",
          "loginSuccess": "Вход выполнен успешно"
        },
        "info": {
          "noChannels": "Вы еще не подписаны ни на один канал",
          "visitChannels": "Посетите каналы и нажмите «Подписаться на канал», чтобы добавить их сюда",
          "exploreChannels": "Обзор каналов",
          "loading": "Загрузка...",
          "redirecting": "Перенаправление...",
          "sessionExpired": "Ваша сессия истекла. Пожалуйста, войдите снова."
        }
      },
      "pagination": {
        "previous": "Назад",
        "next": "Вперед",
        "pageOf": "Страница"
      },
      "sessions": {
        "title": "Мои Сессии",
        "description": "Управляйте активными сессиями и просматривайте историю доступа",
        "loading": "Загрузка сессий...",
        "activeSessions": "Активные Сессии",
        "totalSessions": "Всего Сессий",
        "noSessions": "Нет сессий",
        "noSessionsDescription": "Сессии для вашего аккаунта не найдены.",
        "activeSession": "Активная Сессия",
        "closedSession": "Закрытая Сессия",
        "unknown": "Неизвестно",
        "mobile": "Мобильный",
        "tablet": "Планшет",
        "desktop": "Рабочий стол",
        "ipNotAvailable": "IP недоступен",
        "created": "Создана",
        "lastActivity": "Последняя Активность",
        "expires": "Истекает"
      },
      "profile": {
        "title": "Мой Профиль",
        "loading": "Загрузка профиля...",
        "personalInfo": "Личная Информация",
        "accountInfo": "Информация об Аккаунте",
        "firstName": "Имя",
        "lastName": "Фамилия",
        "displayName": "Отображаемое Имя",
        "dateOfBirth": "Дата Рождения",
        "city": "Город",
        "country": "Страна",
        "firstNamePlaceholder": "Ваше имя",
        "lastNamePlaceholder": "Ваша фамилия",
        "displayNamePlaceholder": "Ваше публичное имя",
        "cityPlaceholder": "Ваш город",
        "countryPlaceholder": "Выберите страну",
        "memberSince": "Участник с",
        "userId": "ID Пользователя",
        "creationDate": "Дата Создания",
        "lastUpdate": "Последнее Обновление",
        "cancel": "Отмена",
        "saveChanges": "Сохранить Изменения",
        "saving": "Сохранение...",
        "success": "Профиль успешно обновлен",
        "error": "Ошибка при обновлении профиля"
      },
      "following": {
        "title": "Отслеживаемые Каналы",
        "loading": "Загрузка отслеживаемых каналов...",
        "channelsCount": "{{count}} канал",
        "channelsCountPlural": "{{count}} каналов",
        "exploreChannels": "Исследовать Каналы",
        "noChannels": "Вы не отслеживаете никаких каналов",
        "noChannelsDescription": "Начните отслеживать каналы, чтобы видеть их здесь и получать уведомления, когда они в эфире.",
        "followingSince": "Отслеживается с",
        "viewChannel": "Посмотреть Канал →"
      },
      "viewerLogin": {
        "loading": "Загрузка...",
        "hello": "Привет",
        "viewer": "Зритель",
        "dashboard": "Панель",
        "logout": "Выйти",
        "loginAsViewer": "Войти как Зритель",
        "loginAsViewerAria": "Войти как зритель"
      },
      "navbar": {
        "searchPlaceholder": "Поиск каналов..."
      },
      "otpModal": {
        "loginTitle": "Войти",
        "verifyTitle": "Проверить код",
        "emailLabel": "Адрес электронной почты",
        "emailPlaceholder": "your@email.com",
        "sendCodeButton": "Отправить код",
        "sendingCode": "Отправка...",
        "codeSentSuccess": "Код отправлен на вашу почту",
        "otpLabel": "Код подтверждения",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "Проверить код",
        "verifyingCode": "Проверка...",
        "loginSuccess": "Вход выполнен успешно",
        "resendCode": "Отправить код повторно",
        "resendIn": "Отправить повторно через",
        "resendCodeSuccess": "Код отправлен повторно",
        "backToEmail": "Вернуться к почте",
        "invalidCode": "Неверный код",
        "connectionError": "Ошибка соединения",
        "sendCodeError": "Ошибка отправки кода",
        "resendCodeError": "Ошибка повторной отправки кода",
        "codeSentTo": "Мы отправили код подтверждения на:",
        "closeButton": "Закрыть",
        "termsText": "Продолжая, вы принимаете наши условия обслуживания и политику конфиденциальности.",
        "emailTemplate": {
          "verificationCode": "Ваш код подтверждения",
          "hello": "Привет",
          "useThisCode": "Используйте этот код для входа:",
          "codeExpires": "Этот код истекает через 10 минут",
          "ignoreEmail": "Если вы не запрашивали этот код, можете проигнорировать это письмо.",
          "copyright": "© 2025 iblups. Все права защищены."
        }
      }
    }
  },
  "tr": {
    "common": {
      "navigation": {
        "home": "Anasayfa",
        "compare": "Karşılaştır",
        "demo": "Demo",
        "debug": "Hata Ayıkla",
        "producerAccess": "Yapımcı Erişimi",
        "viewerAccess": "İzleyici Olarak Giriş",
        "toggleMenu": "Mobil Menüyü Aç/Kapat",
        "back": "Geri"
      },
      "tabs": {
        "all": "Tümü",
        "popular": "Popüler",
        "recent": "Son Eklenenler"
      },
      "search": {
        "placeholder": "Kanal ara...",
        "liveChannels": "canlı kanallar"
      },
      "channels": {
        "live": "CANLI",
        "loading": "Kanallar yükleniyor...",
        "error": "Kanallar yüklenirken hata oluştu",
        "notFound": "Kanal bulunamadı",
        "retry": "Tekrar Dene",
        "follow": "Kanalı takip et",
        "unfollow": "Takibi bırak",
        "following": "Takip ediliyor"
      },
      "footer": {
        "privacyPolicy": "Gizlilik Politikası",
        "termsOfService": "Hizmet Şartları",
        "support": "Destek",
        "copyright": "© 2025 danraf77 LLC - USA. Tüm hakları saklıdır.",
        "poweredBy": "Sağlayan"
      },
      "player": {
        "loading": "Yükleniyor...",
        "error": "Video yüklenirken hata oluştu",
        "play": "Oynat",
        "pause": "Duraklat",
        "mute": "Sessize Al",
        "unmute": "Sesi Aç",
        "fullscreen": "Tam Ekran",
        "exitFullscreen": "Tam Ekrandan Çık"
      },
      "hero": {
        "title": "Dünya, Tek Bir Ekran.",
        "description": "Bağlantı kuran içerikler. Bilgilendiren haberler. İlham veren müzikler. Birleştiren sporlar. Eşlik eden sinema, podcast'ler ve radyolar.",
        "subtitle": "Her şey burada, canlı yayında olur.",
        "createChannel": "Kanalını oluştur"
      },
      "pages": {
        "channel": {
          "title": "Kanal",
          "loading": "Kanal yükleniyor...",
          "notFound": "Kanal bulunamadı",
          "liveStream": "Canlı Yayın"
        },
        "embed": {
          "title": "Canlı Yayın",
          "description": "Canlı yayını izle"
        }
      },
      "dashboard": {
        "title": "Kontrol Paneli",
        "welcome": "Hoş geldin, {{username}}!",
        "description": "Burada profilinizi yönetebilir ve takip ettiğiniz kanalları görüntüleyebilirsiniz.",
        "loading": "İstatistikler yükleniyor...",
        "stats": {
          "following": "Takip Edilenler",
          "recentActivity": "Son Aktiviteler",
          "memberSince": "Üye olma tarihi"
        },
        "quickActions": {
          "title": "Hızlı İşlemler",
          "editProfile": "Profili Düzenle",
          "editProfileDesc": "Kişisel bilgilerinizi güncelleyin",
          "viewFollowing": "Takip Edilenleri Görüntüle",
          "viewFollowingDesc": "Favori kanallarınızı yönetin"
        },
        "sidebar": {
          "home": "Ana Sayfa",
          "profile": "Profilim",
          "following": "Takip Edilenler",
          "sessions": "Oturumlar",
          "email": "E-posta",
          "logout": "Çıkış Yap",
          "backToHome": "← Ana sayfaya dön"
        },
        "loadingDashboard": "Kontrol paneli yükleniyor..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "iblups'a giriş yap",
            "verify": "Kodu doğrula"
          },
          "buttons": {
            "viewerLogin": "İzleyici olarak giriş yap",
            "followChannel": "Kanalı takip et",
            "unfollowChannel": "Kanalı takibi bırak",
            "dashboard": "Kontrol Paneli",
            "hello": "Merhaba"
          },
          "email": {
            "description": "Bir erişim kodu almak için e-postanızı girin",
            "label": "E-posta",
            "placeholder": "senin@epostan.com",
            "button": "Kodu gönder",
            "sending": "Gönderiliyor..."
          },
          "otp": {
            "description": "adresine gönderilen 4 haneli kodu girin",
            "label": "Doğrulama kodu",
            "placeholder": "0000",
            "button": "Kodu doğrula",
            "verifying": "Doğrulanıyor...",
            "resend": "Kodu tekrar gönder",
            "resending": "Tekrar gönderiliyor...",
            "changeEmail": "E-postayı değiştir"
          },
          "errors": {
            "emailRequired": "E-posta gereklidir",
            "invalidEmail": "Geçersiz e-posta",
            "otpRequired": "Kod gereklidir",
            "invalidOtp": "Geçersiz veya süresi dolmuş kod",
            "networkError": "Ağ hatası. Tekrar deneyin.",
            "serverError": "Dahili sunucu hatası"
          },
          "success": {
            "emailSent": "Kod başarıyla gönderildi",
            "loginSuccess": "Giriş başarılı"
          }
        }
      },
      "email": {
        "title": "E-posta Değiştir",
        "description": "E-posta adresinizi OTP doğrulaması ile güncelleyin",
        "currentEmail": "Mevcut E-posta",
        "currentEmailDescription": "Hesabınızın mevcut e-postası",
        "newEmail": "Yeni E-posta",
        "verifyCode": "Kodu Doğrula",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "Doğrulama Kodu",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "{{email}} adresine gönderilen 4 haneli kodu girin",
        "cancel": "İptal",
        "sendCode": "Kod Gönder",
        "sending": "Gönderiliyor...",
        "changeEmail": "E-posta Değiştir",
        "verifyAndChange": "Doğrula ve Değiştir",
        "verifying": "Doğrulanıyor...",
        "securityInfo": "Güvenlik Bilgileri",
        "otpVerification": "OTP Doğrulaması",
        "otpVerificationDescription": "Mülkiyeti doğrulamak için yeni e-postaya 4 haneli kod gönderilecek",
        "security": "Güvenlik",
        "securityDescription": "E-posta değişikliği hesabınızı korumak için doğrulama gerektirir",
        "success": {
          "codeSent": "Doğrulama kodu yeni e-postaya gönderildi",
          "emailUpdated": "E-posta başarıyla güncellendi"
        },
        "errors": {
          "sendCodeError": "Kod gönderme hatası",
          "verificationError": "Kod doğrulama hatası",
          "invalidCode": "Geçersiz doğrulama kodu"
        }
      },
      "messages": {
        "errors": {
          "networkError": "Ağ hatası. Tekrar deneyin.",
          "invalidOtp": "Geçersiz veya süresi dolmuş OTP kodu.",
          "sendOtpError": "OTP kodu gönderilirken hata oluştu.",
          "followError": "Kanal takip edilirken hata oluştu.",
          "unfollowError": "Kanal takibi bırakılırken hata oluştu.",
          "profileUpdateError": "Profil güncellenirken hata oluştu.",
          "emailUpdateError": "E-posta güncellenirken hata oluştu.",
          "sessionError": "Oturum hatası. Lütfen tekrar giriş yapın.",
          "unauthorized": "Yetkisiz. Lütfen giriş yapın.",
          "serverError": "Dahili sunucu hatası."
        },
        "success": {
          "profileUpdated": "Profil başarıyla güncellendi",
          "emailUpdated": "E-posta başarıyla güncellendi",
          "channelFollowed": "Kanal başarıyla takip edildi",
          "channelUnfollowed": "Kanalı takibi bıraktınız",
          "otpSent": "Kod başarıyla gönderildi",
          "loginSuccess": "Giriş başarılı"
        },
        "info": {
          "noChannels": "Henüz hiçbir kanalı takip etmiyorsun",
          "visitChannels": "Kanalları ziyaret et ve buraya eklemek için \"Kanalı takip et\"e tıkla",
          "exploreChannels": "Kanalları Keşfet",
          "loading": "Yükleniyor...",
          "redirecting": "Yönlendiriliyor...",
          "sessionExpired": "Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın."
        }
      },
      "pagination": {
        "previous": "Önceki",
        "next": "Sonraki",
        "pageOf": "Sayfa"
      },
      "sessions": {
        "title": "Oturumlarım",
        "description": "Aktif oturumlarınızı yönetin ve erişim geçmişini inceleyin",
        "loading": "Oturumlar yükleniyor...",
        "activeSessions": "Aktif Oturumlar",
        "totalSessions": "Toplam Oturum",
        "noSessions": "Oturum yok",
        "noSessionsDescription": "Hesabınız için oturum bulunamadı.",
        "activeSession": "Aktif Oturum",
        "closedSession": "Kapalı Oturum",
        "unknown": "Bilinmeyen",
        "mobile": "Mobil",
        "tablet": "Tablet",
        "desktop": "Masaüstü",
        "ipNotAvailable": "IP mevcut değil",
        "created": "Oluşturuldu",
        "lastActivity": "Son Aktivite",
        "expires": "Süresi Doluyor"
      },
      "profile": {
        "title": "Profilim",
        "loading": "Profil yükleniyor...",
        "personalInfo": "Kişisel Bilgiler",
        "accountInfo": "Hesap Bilgileri",
        "firstName": "Ad",
        "lastName": "Soyad",
        "displayName": "Görünen Ad",
        "dateOfBirth": "Doğum Tarihi",
        "city": "Şehir",
        "country": "Ülke",
        "firstNamePlaceholder": "Adınız",
        "lastNamePlaceholder": "Soyadınız",
        "displayNamePlaceholder": "Genel adınız",
        "cityPlaceholder": "Şehriniz",
        "countryPlaceholder": "Ülke seçin",
        "memberSince": "Üye olma tarihi",
        "userId": "Kullanıcı ID",
        "creationDate": "Oluşturulma Tarihi",
        "lastUpdate": "Son Güncelleme",
        "cancel": "İptal",
        "saveChanges": "Değişiklikleri Kaydet",
        "saving": "Kaydediliyor...",
        "success": "Profil başarıyla güncellendi",
        "error": "Profil güncellenirken hata oluştu"
      },
      "following": {
        "title": "Takip Edilen Kanallar",
        "loading": "Takip edilen kanallar yükleniyor...",
        "channelsCount": "{{count}} kanal",
        "channelsCountPlural": "{{count}} kanal",
        "exploreChannels": "Kanalları Keşfet",
        "noChannels": "Hiçbir kanalı takip etmiyorsunuz",
        "noChannelsDescription": "Kanalları takip etmeye başlayın, burada görün ve canlı yayın yaptıklarında bildirim alın.",
        "followingSince": "Takip ediliyor",
        "viewChannel": "Kanalı Görüntüle →"
      },
      "viewerLogin": {
        "loading": "Yükleniyor...",
        "hello": "Merhaba",
        "viewer": "İzleyici",
        "dashboard": "Kontrol Paneli",
        "logout": "Çıkış Yap",
        "loginAsViewer": "İzleyici Olarak Giriş Yap",
        "loginAsViewerAria": "İzleyici olarak giriş yap"
      },
      "navbar": {
        "searchPlaceholder": "Kanal ara..."
      },
      "otpModal": {
        "loginTitle": "Giriş Yap",
        "verifyTitle": "Kodu Doğrula",
        "emailLabel": "E-posta adresi",
        "emailPlaceholder": "your@email.com",
        "sendCodeButton": "Kod Gönder",
        "sendingCode": "Gönderiliyor...",
        "codeSentSuccess": "Kod e-postanıza gönderildi",
        "otpLabel": "Doğrulama kodu",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "Kodu Doğrula",
        "verifyingCode": "Doğrulanıyor...",
        "loginSuccess": "Giriş başarılı",
        "resendCode": "Kodu tekrar gönder",
        "resendIn": "Tekrar gönder",
        "resendCodeSuccess": "Kod tekrar gönderildi",
        "backToEmail": "E-postaya dön",
        "invalidCode": "Geçersiz kod",
        "connectionError": "Bağlantı hatası",
        "sendCodeError": "Kod gönderme hatası",
        "resendCodeError": "Kod tekrar gönderme hatası",
        "codeSentTo": "Doğrulama kodunu şu adrese gönderdik:",
        "closeButton": "Kapat",
        "termsText": "Devam ederek hizmet şartlarımızı ve gizlilik politikamızı kabul etmiş olursunuz.",
        "emailTemplate": {
          "verificationCode": "Doğrulama kodunuz",
          "hello": "Merhaba",
          "useThisCode": "Giriş yapmak için bu kodu kullanın:",
          "codeExpires": "Bu kod 10 dakika içinde sona erer",
          "ignoreEmail": "Bu kodu talep etmediyseniz, bu e-postayı yok sayabilirsiniz.",
          "copyright": "© 2025 iblups. Tüm hakları saklıdır."
        }
      }
    }
  },
  "zh": {
    "common": {
      "navigation": {
        "home": "首页",
        "compare": "比较",
        "demo": "演示",
        "debug": "调试",
        "producerAccess": "创作者入口",
        "viewerAccess": "观众入口",
        "toggleMenu": "切换移动菜单",
        "back": "返回"
      },
      "tabs": {
        "all": "全部",
        "popular": "热门",
        "recent": "最近"
      },
      "search": {
        "placeholder": "搜索频道...",
        "liveChannels": "直播频道"
      },
      "channels": {
        "live": "直播中",
        "loading": "正在加载频道...",
        "error": "加载频道出错",
        "notFound": "未找到频道",
        "retry": "重试",
        "follow": "关注频道",
        "unfollow": "取消关注",
        "following": "已关注"
      },
      "footer": {
        "privacyPolicy": "隐私政策",
        "termsOfService": "服务条款",
        "support": "支持",
        "copyright": "© 2025 danraf77 LLC - USA. 版权所有。",
        "poweredBy": "技术支持"
      },
      "player": {
        "loading": "加载中...",
        "error": "视频加载错误",
        "play": "播放",
        "pause": "暂停",
        "mute": "静音",
        "unmute": "取消静音",
        "fullscreen": "全屏",
        "exitFullscreen": "退出全屏"
      },
      "hero": {
        "title": "世界，尽在一屏。",
        "description": "连接你我的内容。报道事实的新闻。激发灵感的音乐。凝聚人心的体育。伴你同行的电影、播客和广播。",
        "subtitle": "所有精彩，尽在直播。",
        "createChannel": "创建您的频道"
      },
      "pages": {
        "channel": {
          "title": "频道",
          "loading": "正在加载频道...",
          "notFound": "未找到频道",
          "liveStream": "直播"
        },
        "embed": {
          "title": "直播",
          "description": "观看直播"
        }
      },
      "dashboard": {
        "title": "仪表板",
        "welcome": "欢迎，{{username}}！",
        "description": "在这里您可以管理您的个人资料并查看您关注的频道。",
        "loading": "加载统计信息...",
        "stats": {
          "following": "关注中",
          "recentActivity": "最近活动",
          "memberSince": "会员自"
        },
        "quickActions": {
          "title": "快速操作",
          "editProfile": "编辑个人资料",
          "editProfileDesc": "更新您的个人信息",
          "viewFollowing": "查看关注",
          "viewFollowingDesc": "管理您喜爱的频道"
        },
        "sidebar": {
          "home": "首页",
          "profile": "我的个人资料",
          "following": "关注中",
          "sessions": "会话",
          "email": "电子邮件",
          "logout": "退出登录",
          "backToHome": "← 返回首页"
        },
        "loadingDashboard": "加载仪表板..."
      },
      "auth": {
        "modal": {
          "title": {
            "login": "登录 iblups",
            "verify": "验证代码"
          },
          "buttons": {
            "viewerLogin": "以观众身份登录",
            "followChannel": "关注频道",
            "unfollowChannel": "取消关注频道",
            "dashboard": "仪表盘",
            "hello": "你好"
          },
          "email": {
            "description": "输入您的电子邮件以接收访问代码",
            "label": "电子邮件",
            "placeholder": "your@email.com",
            "button": "发送代码",
            "sending": "发送中..."
          },
          "otp": {
            "description": "请输入发送至的4位数代码",
            "label": "验证码",
            "placeholder": "0000",
            "button": "验证代码",
            "verifying": "验证中...",
            "resend": "重新发送代码",
            "resending": "重新发送中...",
            "changeEmail": "更改电子邮件"
          },
          "errors": {
            "emailRequired": "需要提供电子邮件",
            "invalidEmail": "无效的电子邮件",
            "otpRequired": "需要提供代码",
            "invalidOtp": "代码无效或已过期",
            "networkError": "网络错误，请重试。",
            "serverError": "服务器内部错误"
          },
          "success": {
            "emailSent": "代码已成功发送",
            "loginSuccess": "登录成功"
          }
        }
      },
      "email": {
        "title": "更改邮箱",
        "description": "通过OTP验证更新您的邮箱地址",
        "currentEmail": "当前邮箱",
        "currentEmailDescription": "您账户的当前邮箱",
        "newEmail": "新邮箱",
        "verifyCode": "验证代码",
        "newEmailPlaceholder": "your@new-email.com",
        "verificationCode": "验证代码",
        "verificationCodePlaceholder": "0000",
        "verificationCodeDescription": "输入发送到 {{email}} 的4位数字代码",
        "cancel": "取消",
        "sendCode": "发送代码",
        "sending": "发送中...",
        "changeEmail": "更改邮箱",
        "verifyAndChange": "验证并更改",
        "verifying": "验证中...",
        "securityInfo": "安全信息",
        "otpVerification": "OTP验证",
        "otpVerificationDescription": "将向新邮箱发送4位数字代码以验证所有权",
        "security": "安全性",
        "securityDescription": "更改邮箱需要验证以保护您的账户",
        "success": {
          "codeSent": "验证代码已发送到新邮箱",
          "emailUpdated": "邮箱更新成功"
        },
        "errors": {
          "sendCodeError": "发送代码时出错",
          "verificationError": "验证代码时出错",
          "invalidCode": "验证代码无效"
        }
      },
      "messages": {
        "errors": {
          "networkError": "网络错误，请重试。",
          "invalidOtp": "一次性密码（OTP）无效或已过期。",
          "sendOtpError": "发送一次性密码（OTP）时出错。",
          "followError": "关注频道时出错。",
          "unfollowError": "取消关注频道时出错。",
          "profileUpdateError": "更新个人资料时出错。",
          "emailUpdateError": "更新电子邮件时出错。",
          "sessionError": "会话错误。请重新登录。",
          "unauthorized": "未经授权。请登录。",
          "serverError": "服务器内部错误。"
        },
        "success": {
          "profileUpdated": "个人资料更新成功",
          "emailUpdated": "电子邮件更新成功",
          "channelFollowed": "成功关注频道",
          "channelUnfollowed": "已取消关注频道",
          "otpSent": "代码已成功发送",
          "loginSuccess": "登录成功"
        },
        "info": {
          "noChannels": "您尚未关注任何频道",
          "visitChannels": "访问频道并点击“关注频道”即可将其添加至此",
          "exploreChannels": "浏览频道",
          "loading": "加载中...",
          "redirecting": "正在重定向...",
          "sessionExpired": "您的会话已过期。请重新登录。"
        }
      },
      "pagination": {
        "previous": "上一页",
        "next": "下一页",
        "pageOf": "第"
      },
      "sessions": {
        "title": "我的会话",
        "description": "管理您的活动会话并查看访问历史",
        "loading": "加载会话中...",
        "activeSessions": "活动会话",
        "totalSessions": "总会话数",
        "noSessions": "没有会话",
        "noSessionsDescription": "未找到您账户的会话记录。",
        "activeSession": "活动会话",
        "closedSession": "已关闭会话",
        "unknown": "未知",
        "mobile": "移动设备",
        "tablet": "平板电脑",
        "desktop": "桌面",
        "ipNotAvailable": "IP不可用",
        "created": "创建时间",
        "lastActivity": "最后活动",
        "expires": "过期时间"
      },
      "profile": {
        "title": "我的个人资料",
        "loading": "加载个人资料中...",
        "personalInfo": "个人信息",
        "accountInfo": "账户信息",
        "firstName": "名字",
        "lastName": "姓氏",
        "displayName": "显示名称",
        "dateOfBirth": "出生日期",
        "city": "城市",
        "country": "国家",
        "firstNamePlaceholder": "您的名字",
        "lastNamePlaceholder": "您的姓氏",
        "displayNamePlaceholder": "您的公开名称",
        "cityPlaceholder": "您的城市",
        "countryPlaceholder": "选择国家",
        "memberSince": "注册时间",
        "userId": "用户ID",
        "creationDate": "创建日期",
        "lastUpdate": "最后更新",
        "cancel": "取消",
        "saveChanges": "保存更改",
        "saving": "保存中...",
        "success": "个人资料更新成功",
        "error": "更新个人资料时出错"
      },
      "following": {
        "title": "关注的频道",
        "loading": "加载关注的频道中...",
        "channelsCount": "{{count}} 个频道",
        "channelsCountPlural": "{{count}} 个频道",
        "exploreChannels": "探索频道",
        "noChannels": "您还没有关注任何频道",
        "noChannelsDescription": "开始关注频道，在这里查看它们，并在它们直播时接收通知。",
        "followingSince": "关注于",
        "viewChannel": "查看频道 →"
      },
      "viewerLogin": {
        "loading": "加载中...",
        "hello": "你好",
        "viewer": "观众",
        "dashboard": "仪表板",
        "logout": "退出登录",
        "loginAsViewer": "以观众身份登录",
        "loginAsViewerAria": "以观众身份登录"
      },
      "navbar": {
        "searchPlaceholder": "搜索频道..."
      },
      "otpModal": {
        "loginTitle": "登录",
        "verifyTitle": "验证代码",
        "emailLabel": "电子邮件地址",
        "emailPlaceholder": "your@email.com",
        "sendCodeButton": "发送代码",
        "sendingCode": "发送中...",
        "codeSentSuccess": "代码已发送到您的邮箱",
        "otpLabel": "验证码",
        "otpPlaceholder": "0000",
        "verifyCodeButton": "验证代码",
        "verifyingCode": "验证中...",
        "loginSuccess": "登录成功",
        "resendCode": "重新发送代码",
        "resendIn": "重新发送",
        "resendCodeSuccess": "代码已重新发送",
        "backToEmail": "返回邮箱",
        "invalidCode": "无效代码",
        "connectionError": "连接错误",
        "sendCodeError": "发送代码错误",
        "resendCodeError": "重新发送代码错误",
        "codeSentTo": "我们向以下地址发送了验证码：",
        "closeButton": "关闭",
        "termsText": "继续即表示您接受我们的服务条款和隐私政策。",
        "emailTemplate": {
          "verificationCode": "您的验证码",
          "hello": "您好",
          "useThisCode": "使用此代码登录：",
          "codeExpires": "此代码将在10分钟后过期",
          "ignoreEmail": "如果您没有请求此代码，可以忽略此邮件。",
          "copyright": "© 2025 iblups. 保留所有权利。"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
