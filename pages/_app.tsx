import "../styles/global.css";

import Head from "next/head";
import Script from "next/script";
import { QueryClient, QueryClientProvider } from "react-query";

import { Analytics } from "@vercel/analytics/react";

import { AuthContextProvider } from "../context/AuthContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
          />
          <title>Oke for You - คาราโอเกะออนไลน์บน YouTube</title>
          <meta
            name="title"
            content="Oke for You - คาราโอเกะออนไลน์บน YouTube"
          />
          <meta
            name="description"
            content="คาราโอเกะออนไลน์ฟรี ไม่ต้องติดตั้ง ทำงานโดยตรงในเบราว์เซอร์ ใช้ได้กับอุปกรณ์หลากหลาย ฐานข้อมูลเพลงจาก Youtube ครบถ้วนและมีคุณภาพสูง "
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://play.okeforyou.com/" />
          <meta
            property="og:title"
            content="Oke for You - คาราโอเกะออนไลน์บน YouTube"
          />
          <meta
            property="og:description"
            content="คาราโอเกะออนไลน์ฟรี ไม่ต้องติดตั้ง ทำงานโดยตรงในเบราว์เซอร์ ใช้ได้กับอุปกรณ์หลากหลาย ฐานข้อมูลเพลงจาก Youtube ครบถ้วนและมีคุณภาพสูง 
          "
          />
          <meta property="og:image" content="/assets/og-image.png" />
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://play.okeforyou.com/" />
          <meta
            property="twitter:title"
            content="Oke for You - คาราโอเกะออนไลน์บน YouTube"
          />
          <meta
            property="twitter:description"
            content="คาราโอเกะออนไลน์ฟรี ไม่ต้องติดตั้ง ทำงานโดยตรงในเบราว์เซอร์ ใช้ได้กับอุปกรณ์หลากหลาย ฐานข้อมูลเพลงจาก Youtube ครบถ้วนและมีคุณภาพสูง 
          "
          />
          <meta property="twitter:image" content="/assets/og-image.png" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#ef4444" />
          <meta name="robots" content="all" />
        </Head>
        {process.env.NODE_ENV !== "production" ? null : (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id="
              strategy="worker"
            />
            <Script id="google-analytics" strategy="worker">
              {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '');
        `}
            </Script>
          </>
        )}
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          {/* <ReactQueryDevtools /> */}
        </QueryClientProvider>
        <Analytics />
      </>
    </AuthContextProvider>
  );
}

export default App;
