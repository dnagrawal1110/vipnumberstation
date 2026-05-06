import { Inter, Rajdhani, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Topbar from './components/Topbar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const rajdhani = Rajdhani({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-rajdhani' });
const cormorant = Cormorant_Garamond({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-cormorant' });

export const metadata = {
  title: "VIP Number Station - Premium VIP Mobile Numbers",
  description: "India's most trusted marketplace for premium VIP mobile numbers. Instant port (RTP) and non-RTP options available.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${rajdhani.variable} ${cormorant.variable}`}>
        <Topbar />
        <Navbar />
        {children}
        <Footer />
        {/* Enquiry Float */}
        <div className="enquiry-float">
          <a href="https://wa.me/919999976767?text=Hi,%20I%20want%20to%20enquire%20about%20VIP%20numbers%20from%20vipnumberstation.com" target="_blank" rel="noreferrer" className="float-btn float-wa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.115 1.524 5.843L.057 23.927l6.248-1.637A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.376l-.36-.213-3.714.974.99-3.614-.235-.372A9.818 9.818 0 012.182 12c0-5.424 4.394-9.818 9.818-9.818s9.818 4.394 9.818 9.818-4.394 9.818-9.818 9.818z"/></svg>
            Enquire on WhatsApp
          </a>
        </div>
      </body>
    </html>
  );
}
