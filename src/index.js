import React from 'react'
import ReactDOM from 'react-dom/client'
import { Offline, Online } from 'react-detect-offline'
import './index.scss'


import {App} from './components'
import NoInternet from './components/noInternet'

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
