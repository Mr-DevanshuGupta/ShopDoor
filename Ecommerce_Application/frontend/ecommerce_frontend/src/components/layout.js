import React from 'react';
import Footer from './LandingPage/footer';
import SearchAppBar from './LandingPage/search';
import { useRouter } from "next/router";


export default function Layout({ children }) {
  const router = useRouter();
  const showFooter = !(
    router.pathname.startsWith('/orderSummary') || 
    router.pathname.startsWith('/cart') || 
    router.pathname.startsWith('/address') ||
    router.pathname.startsWith('/account') || 
    router.pathname.startsWith('/admin')
  );
  return (
    <>
      <SearchAppBar />
      <main style={{ paddingTop: '64px' , overflow: 'hidden'}}>
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}
