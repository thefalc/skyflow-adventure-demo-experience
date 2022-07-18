import 'bootstrap/dist/css/bootstrap.css'; // Add this line
import '../public/static/css/styles.scss'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp