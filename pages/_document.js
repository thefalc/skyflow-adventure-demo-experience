import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css?family=Inter"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css?family=Roboto Mono"
          rel="stylesheet"
        />
        <link rel="shortcut icon" type="image/png" href="/static/images/skyflow-logo-new.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}