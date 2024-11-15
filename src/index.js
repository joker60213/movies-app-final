import React from 'react'
import ReactDOM from 'react-dom/client'
import { Offline, Online } from 'react-detect-offline'

import App from './components/app/App.jsx'
import NoInternet from './components/uI/noInternet/NoInternet.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <>
    <Online>
      <App />
    </Online>
    <Offline>
      <NoInternet />
    </Offline>
  </>
)
