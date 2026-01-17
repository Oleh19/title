import React from 'react';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '../widgets';
import '@/shared/styles/globals.scss';

export const metadata: Metadata = {
  title: 'TT',
  description: 'TT project',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-poppins',
});

function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
