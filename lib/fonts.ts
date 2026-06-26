import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

// Anda dapat memanggil fungsi ini jika menggunakan class utilities di lib
export const fontClass = poppins.variable;
