import { Metadata } from "next";
import { getContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PortfolioCarousel from "@/components/PortfolioCarousel";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import SocialAndFooter from "@/components/SocialAndFooter";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SeoSchema from "@/components/SeoSchema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const { seo, company } = content;

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    authors: [{ name: company.name }],
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: seo.canonicalUrl,
      siteName: company.name,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${company.name} - Jamuan Katering Premium`,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: [seo.ogImage],
    },
    alternates: {
      canonical: seo.canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function HomePage() {
  const content = await getContent();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col font-sans selection:bg-[#B38E5D]/20 selection:text-[#1C1917]">
      {/* Schema Markup for Google SEO */}
      <SeoSchema content={content} />

      {/* Navigation Header */}
      <Navbar company={content.company} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        {content.sectionVisibility?.hero !== false && (
          <Hero company={content.company} hero={content.hero} />
        )}

        {/* 2. About Section */}
        {content.sectionVisibility?.about !== false && (
          <About about={content.about} />
        )}

        {/* 3. Portfolio Event Section (Carousel, Max 10 Photos) */}
        {content.sectionVisibility?.portfolio !== false && (
          <PortfolioCarousel
            portfolio={content.portfolio}
            config={content.portfolioSection}
          />
        )}

        {/* 4. Mitra & Klien Section (Telkomsel, Indosat, XL, BCA, Mandiri, dll.) */}
        {content.sectionVisibility?.partners !== false && (
          <Partners
            partners={content.partners}
            config={content.partnersSection}
          />
        )}

        {/* 5. Testimonials Section */}
        {content.sectionVisibility?.testimonials !== false && (
          <Testimonials
            testimonials={content.testimonials}
            config={content.testimonialsSection}
          />
        )}

        {/* 6. FAQ Section */}
        {content.sectionVisibility?.faqs !== false && (
          <Faq faqs={content.faqs} config={content.faqsSection} />
        )}
      </main>

      {/* Social Media Connections & Footer */}
      <SocialAndFooter company={content.company} />

      {/* Floating Instant WhatsApp Button */}
      <FloatingWhatsApp company={content.company} />
    </div>
  );
}
