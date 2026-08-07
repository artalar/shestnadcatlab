import type { UIKey } from './i18n/en';

export const SITE = {
  locale: 'ru',
  title: 'Шестнадцать',
  description:
    'Фотолаборатория в Калуге: проявка и сканирование плёнки. Оставьте заявку — мы свяжемся и примем заказ.',
  rssDescription: 'Новости лаборатории Шестнадцать.',
  ogImage: '/og.jpg',
  author: 'Шестнадцать',
  footerText: 'Шестнадцать · фотолаборатория · Калуга',
  city: 'Калуга',
  tagline: 'Проявка и скан плёнки',
} as const;

export type SocialIcon = 'github' | 'x' | 'linkedin' | 'rss' | 'email';

export interface SocialLink {
  label: string;
  href: string;
  icon: SocialIcon;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'Email', href: 'mailto:hello@shestnadcat.lab', icon: 'email' },
];

export interface GiscusConfig {
  enabled: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  strict: boolean;
  reactionsEnabled: boolean;
  inputPosition: 'top' | 'bottom';
  lang: string;
  lightTheme: string;
  darkTheme: string;
}

export const GISCUS: GiscusConfig = {
  enabled: false,
  repo: '',
  repoId: '',
  category: 'Announcements',
  categoryId: '',
  mapping: 'pathname',
  strict: true,
  reactionsEnabled: true,
  inputPosition: 'bottom',
  lang: 'ru',
  lightTheme: 'light',
  darkTheme: 'dark',
};

export type NavItem =
  | { href: string; label: string; labelKey?: never }
  | { href: string; labelKey: UIKey; label?: never };

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/#services', label: 'Услуги' },
  { href: '/#process', label: 'Как сдаём' },
  { href: '/#request', label: 'Заявка' },
];
