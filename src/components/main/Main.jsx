import React from 'react'

import './Main.scss'

import CardList from '../cardList/CardList'
import SearchInput from '../searchInput/SearchInput'

const Main = ({ query, searchMovies, tab, guestId }) => {
  return (
    <main className="main-search">
      {tab === 'Search' ? <SearchInput searchMovies={searchMovies} /> : null}
      <CardList query={query} tab={tab} guestId={guestId} />
    </main>
  )
}

export default Main
// готово + 