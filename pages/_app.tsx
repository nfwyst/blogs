import React from 'react';
import './static/style/index.css';
import '../node_modules/react-quill/dist/quill.snow.css';

function MyApp({ Component, pageProps }): JSX.Element {
  return <Component {...pageProps} />
}

export default MyApp
