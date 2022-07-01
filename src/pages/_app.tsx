import '../globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={"/loweware-logo.ico"} />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
