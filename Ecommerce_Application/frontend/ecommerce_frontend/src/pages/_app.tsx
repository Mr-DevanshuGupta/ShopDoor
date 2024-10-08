import store from "@/redux/store";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
// import Layout from './components/layout'
// import Layout from '../components'
// import CircularLoader from "./components/loader";
import Layout from "@/components/layout";

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false); 
  useEffect(() => {
    setIsClient(true)
  }, [])

  // if (!isClient) {
  //   return <CircularLoader />;
  // }

  return(
    isClient &&

    <Provider store={store}>
      <Layout>
      <Component {...pageProps} />
    </Layout>
    </Provider>
  ) 
}
