export type Locale = 'pt' | 'en';

export const dictionaries = {
  pt: {
    nav: {
      method: 'Método',
      about: 'Sobre o Professor',
      testimonials: 'Depoimentos',
      videos: 'Dicas em Vídeo',
      loginGoogle: 'Entrar com Google',
      dashboard: 'Meu Painel',
      admin: 'Painel Admin',
      logout: 'Sair'
    },
    hero: {
      badge: '🇧🇷 Aprenda o Português Real do Brasil',
      title: 'Fale português com a fluência e o ritmo dos brasileiros.',
      subtitle: 'Aulas 100% personalizadas, práticas e focadas na comunicação da vida real. Esqueça gramática engessada e aprenda a viver a língua.',
      cta: 'Agendar Aula Experimental Grátis',
      ctaSub: '⚡ 30 minutos de diagnóstico sem compromisso no Google Meet',
      socialProof: '+500 alunos de mais de 25 países fluentes hoje'
    },
    method: {
      tag: 'COMO FUNCIONA',
      title: 'Um método direto, imersivo e natural',
      subtitle: 'Desenvolvido especificamente para falantes de inglês, espanhol, francês e outras línguas.',
      card1Title: 'Conversação Ativa',
      card1Desc: 'Fale desde o minuto 1. Treinamos situações do dia a dia, trabalho, viagens e contextos culturais com diálogos reais.',
      card2Title: 'Entonação & Ritmo Brasileiro',
      card2Desc: 'Aprenda os segredos da pronúncia, contrações coloquiais e expressões idiomáticas que os nativos usam de verdade.',
      card3Title: 'Flexibilidade de Fuso Horário',
      card3Desc: 'Agendamentos automáticos calculados no seu fuso horário local com salas de Google Meet geradas instantaneamente.'
    },
    about: {
      tag: 'SEU PROFESSOR',
      title: 'Olá! Sou o Teacher Vittor 👋',
      bio1: 'Sou especialista no ensino de Português Brasileiro como Língua Estrangeira (PLE). Há mais de 7 anos ajudo expatriados, nômades digitais e apaixonados pela cultura brasileira a quebrarem a barreira do idioma.',
      bio2: 'Minha abordagem não é baseada em decoreba. Criamos conexões autênticas com a música, a literatura, o humor e o cotidiano brasileiro para que você se sinta em casa em qualquer lugar do Brasil.',
      feature1: 'Mais de 3.500 horas de aulas ministradas',
      feature2: 'Material próprio e feedback personalizado',
      feature3: 'Certificação internacional em ensino de idiomas',
      cta: 'Conheça minha metodologia na prática'
    },
    testimonials: {
      tag: 'O QUE DIZEM OS ALUNOS',
      title: 'Histórias reais de quem conquistou a fluência',
      subtitle: 'Estudantes do mundo todo que hoje conversam, trabalham e viajam pelo Brasil com segurança.'
    },
    videos: {
      tag: 'CONTEÚDO EXCLUSIVO',
      title: 'Pílulas de Português & Cultura',
      subtitle: 'Aulas curtas e práticas direto ao ponto. Faça login com o Google para assistir e desbloquear todo o acervo.',
      watchPrompt: 'Faça login com o Google para assistir a este vídeo completo e ter acesso aos materiais de apoio!',
      loginToUnlock: 'Entrar para Assistir'
    },
    modal: {
      title: 'Agende sua Aula Experimental',
      step1Title: 'Escolha Data & Horário',
      step2Title: 'Seus Dados',
      step3Title: 'Agendamento Confirmado!',
      timezoneNotice: 'Horários convertidos automaticamente para o seu fuso horário local:',
      noSlots: 'Nenhum horário disponível para esta data. Selecione outro dia.',
      whatsappLabel: 'Seu WhatsApp com código do país (DDI + DDD):',
      whatsappPlaceholder: '+1 (555) 000-0000',
      loginRequired: 'Para confirmar seu agendamento, faça login rápido com sua conta Google:',
      confirmBtn: 'Confirmar Agendamento',
      confirming: 'Criando agendamento e sala Google Meet...',
      successTitle: 'Tudo pronto! Te esperamos!',
      successDesc: 'Seu agendamento foi registrado com sucesso. Enviamos os detalhes e o link do Google Meet para o seu e-mail.',
      goToDashboard: 'Acessar Meu Painel de Aulas'
    }
  },
  en: {
    nav: {
      method: 'Method',
      about: 'About Teacher',
      testimonials: 'Testimonials',
      videos: 'Video Tips',
      loginGoogle: 'Sign in with Google',
      dashboard: 'Student Dashboard',
      admin: 'Admin Panel',
      logout: 'Sign Out'
    },
    hero: {
      badge: '🇧🇷 Learn Real Brazilian Portuguese',
      title: 'Speak Portuguese with natural rhythm and true fluency.',
      subtitle: '100% personalized, practical lessons focused on real-life communication. Forget rigid grammar and start truly living the language.',
      cta: 'Book Free Trial Lesson',
      ctaSub: '⚡ 30-minute diagnosis on Google Meet, no obligations',
      socialProof: '500+ fluent students from 25+ countries'
    },
    method: {
      tag: 'HOW IT WORKS',
      title: 'A direct, immersive and natural approach',
      subtitle: 'Designed specifically for speakers of English, Spanish, French and other languages.',
      card1Title: 'Active Conversation',
      card1Desc: 'Speak from minute one. We train everyday scenarios, business meetings, travel, and cultural contexts with authentic dialogues.',
      card2Title: 'Brazilian Rhythm & Pronunciation',
      card2Desc: 'Master the musicality of Brazilian Portuguese, colloquial contractions, and slang that native speakers actually use.',
      card3Title: 'Worldwide Timezone Compatibility',
      card3Desc: 'Automatic scheduling mapped precisely to your local timezone with instant Google Meet link generation.'
    },
    about: {
      tag: 'MEET YOUR TEACHER',
      title: 'Hi! I am Teacher Vittor 👋',
      bio1: 'Specialist in Brazilian Portuguese as a Foreign Language. For over 7 years I have helped expats, digital nomads, and culture lovers break through the language barrier.',
      bio2: 'No tedious textbook memorization. We build genuine connections using Brazilian music, cinema, humor, and daily habits so you feel right at home anywhere in Brazil.',
      feature1: 'Over 3,500 hours of lessons taught',
      feature2: 'Custom materials and tailored feedback',
      feature3: 'Certified language teaching methodology',
      cta: 'Experience the method in a trial class'
    },
    testimonials: {
      tag: 'STUDENT REVIEWS',
      title: 'Real stories from fluent students',
      subtitle: 'Students from across the globe now traveling, working, and speaking freely in Brazil.'
    },
    videos: {
      tag: 'FREE LEARNING BITES',
      title: 'Quick Portuguese & Culture Tips',
      subtitle: 'Bite-sized, practical lessons. Sign in with Google to watch and unlock the complete learning library.',
      watchPrompt: 'Please sign in with Google to watch this complete video and access downloadable lesson notes!',
      loginToUnlock: 'Sign In to Watch'
    },
    modal: {
      title: 'Book Your Free Trial Lesson',
      step1Title: 'Select Date & Time',
      step2Title: 'Identification',
      step3Title: 'Class Confirmed!',
      timezoneNotice: 'Times are automatically converted to your local timezone:',
      noSlots: 'No available slots for this day. Please select another date.',
      whatsappLabel: 'Your WhatsApp number (with Country Code):',
      whatsappPlaceholder: '+1 (555) 000-0000',
      loginRequired: 'To confirm your lesson, quickly sign in with your Google account:',
      confirmBtn: 'Confirm My Booking',
      confirming: 'Creating schedule & Google Meet room...',
      successTitle: 'You are all set! See you in class!',
      successDesc: 'Your session has been confirmed. We sent the Google Meet link and calendar invitation to your email.',
      goToDashboard: 'Go to Student Dashboard'
    }
  }
};
