import { createFileRoute } from "@tanstack/react-router";
import { Storefront } from "@/components/storefront";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kamdhenu Enterprise | Premium Dry Fruits in Kolkata" },
      {
        name: "description",
        content:
          "Shop premium cashews, almonds, walnuts, raisins, figs, makhana and seeds at transparent market-direct prices in Kolkata.",
      },
      { property: "og:title", content: "Kamdhenu Enterprise — Premium Quality. Wholesale Prices." },
      {
        property: "og:description",
        content:
          "Build your family basket of premium dry fruits and superfoods, then order directly on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          name: "Kamdhenu Enterprise",
          description: "Premium dry fruits and superfoods at competitive market-direct prices.",
          telephone: "+918585827649",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Shib Dey Lane, Esplanade, Dharmatala, Taltala",
            addressLocality: "Kolkata",
            addressRegion: "West Bengal",
            postalCode: "700016",
            addressCountry: "IN",
          },
          currenciesAccepted: "INR",
        }),
      },
    ],
  }),
  component: Storefront,
});
