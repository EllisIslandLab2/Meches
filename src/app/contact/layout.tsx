import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us - Meche's Handmade Crafts",
  description: "Get in touch with Meche's Handmade Crafts for questions about products, custom orders, or general inquiries. We respond within 24 hours.",
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: "Contact Us - Meche's Handmade Crafts",
    description: "Get in touch for custom orders and inquiries",
    url: 'https://www.mechescreations.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
