import "./globals.css";

export const metadata = {
  title: "BayBouncers | Bounce House Rentals | Monterey Bay to San Jose",
  description:
    "Premium bounce house rentals for birthday parties, events & backyard fun. Delivered and set up from Watsonville to San Jose.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
