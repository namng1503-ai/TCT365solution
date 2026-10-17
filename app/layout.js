import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingContact from '@/components/FloatingContact';
import { site } from '@/data/site';

const font = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font',
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.shortName} – Đại lý thuế, dịch vụ kế toán thuế trọn gói tại Hà Nội`, template: `%s | ${site.shortName}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: 'vi_VN', type: 'website', images: ['/logo.png'] },
  icons: { icon: '/logo.png' },
};

export const viewport = { themeColor: '#036B68' };

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={font.variable}>
      <body>
        <a className="skip" href="#main">Bỏ qua điều hướng</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
