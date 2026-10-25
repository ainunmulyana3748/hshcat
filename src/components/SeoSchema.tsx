import { CateringContent } from "@/types/content";

interface SeoSchemaProps {
  content: CateringContent;
}

export default function SeoSchema({ content }: SeoSchemaProps) {
  const { company, seo, menuPackages } = content;

  const schemaData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["CateringService", "LocalBusiness", "FoodEstablishment"],
    name: company.name,
    image: [seo.ogImage],
    description: seo.metaDescription,
    url: seo.canonicalUrl,
    telephone: company.phone,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressLocality: company.city,
      addressRegion: "DKI Jakarta",
      postalCode: "12190",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.2349,
      longitude: 106.8122,
    },
    priceRange: "$$$",
    servesCuisine: [
      "Indonesian",
      "Traditional Royal Banquet",
      "Western Fine Dining",
      "Asian Fusion",
    ],
    openingHours: "Mo-Su 08:00-20:00",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "2840",
      bestRating: "5",
      worstRating: "1",
    },
    sameAs: [company.instagram, company.facebook],
  };

  if (menuPackages && menuPackages.length > 0) {
    schemaData.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: "Daftar Paket Catering Premium",
      itemListElement: menuPackages.map((pkg, idx) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: pkg.name,
          description: pkg.description,
        },
        price: pkg.price.replace(/\D/g, ""),
        priceCurrency: "IDR",
        position: idx + 1,
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
