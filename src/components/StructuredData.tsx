export default function StructuredData() {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Meche's Handmade Crafts",
    "description": "Unique handcrafted jewelry and laser-cut wooden designs made with love and attention to detail.",
    "url": "https://www.mechescreations.com",
    "logo": "https://www.mechescreations.com/logo.jpg",
    "image": "https://www.mechescreations.com/logo.jpg",
    "priceRange": "$",
    "servedArea": {
      "@type": "Country",
      "name": "United States"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Handmade Jewelry & Crafts",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Handmade Earrings",
            "description": "Beautiful handcrafted earrings in various styles including cowgirl and floral designs"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "Laser Cut Wooden Designs",
            "description": "Custom laser-cut wooden crafts and decorative items"
          }
        }
      ]
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": []
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Meche's Handmade Crafts",
    "url": "https://www.mechescreations.com",
    "description": "Discover unique, handcrafted jewelry and laser-cut wooden designs made with love and attention to detail.",
    "publisher": {
      "@type": "Organization",
      "name": "Meche's Handmade Crafts"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}