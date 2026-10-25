export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  portfolio: boolean;
  partners: boolean;
  testimonials: boolean;
  faqs: boolean;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string; // Uploadable brand logo for Navbar and Footer
  copyrightText?: string;
  establishedYear: number;
  phone: string;
  whatsapp: string; // e.g. "6281234567890" (format tanpa +)
  whatsappPrefilledMessage: string;
  instagram: string; // e.g. "https://instagram.com/royalrasacatering"
  facebook: string; // e.g. "https://facebook.com/royalrasacatering"
  email: string;
  address: string;
  city: string;
  openingHours: string;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
}

export interface MenuPackage {
  name: string;
  description: string;
  price: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  subtext: string;
}

export interface HeroSection {
  badge: string;
  headline: string;
  subheadline: string;
  ctaWhatsappText: string;
  ctaPortfolioText: string;
  stats: StatItem[];
}

export interface AboutFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutSection {
  badge: string;
  title: string;
  subtitle: string;
  story: string;
  quote: string;
  quoteAuthor?: string;
  quoteRole?: string;
  features: AboutFeature[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  eventDate: string;
  guestCount: string;
  description: string;
}

export interface PortfolioSectionConfig {
  badge: string;
  title: string;
  subtitle: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  category: string;
  logoUrl?: string; // Image URL or SVG
  logoText?: string;
}

export interface PartnersSectionConfig {
  badge: string;
  title: string;
  subtitle: string;
  footnote?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  event: string;
  avatarUrl: string;
}

export interface TestimonialsSectionConfig {
  badge: string;
  title: string;
  subtitle: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqsSectionConfig {
  badge: string;
  title: string;
  subtitle: string;
}

export interface CateringContent {
  sectionVisibility?: SectionVisibility;
  company: CompanyInfo;
  seo: SeoSettings;
  menuPackages?: MenuPackage[];
  hero: HeroSection;
  about: AboutSection;
  portfolio: PortfolioItem[]; // Maksimal 10 foto
  portfolioSection?: PortfolioSectionConfig;
  partners: PartnerItem[];
  partnersSection?: PartnersSectionConfig;
  testimonials: TestimonialItem[];
  testimonialsSection?: TestimonialsSectionConfig;
  faqs: FaqItem[];
  faqsSection?: FaqsSectionConfig;
  lastUpdated: string;
}
