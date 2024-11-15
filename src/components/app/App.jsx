import React, { useState, useEffect} from 'react'

import './App.scss'

import Main from '../main/Main'
import Header from '../header/Header'
import useAPI from '../../api/useAPI' // тут API заменил на useAPI
import { APIProvider } from '../../api-context/API-Context'
import Error from '../uI/error/Error'


const App = () => {
  const api = useAPI(); // тут API заменил на useAPI

  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [guestId, setGuestId] = useState('');
  const [tab, setTab] = useState('Search');
  const [isError, setIsError] = useState(false);

  const searchMovies = (query) => {
    setQuery(query.trim());
  };

  const getGenresList = () => {
    api
      .getGenresList()
      .then((res) => {
        setGenres(res);
      })
      .catch(onError);
  };

  const getGuestId = () => {
    if (!sessionStorage.getItem('guestId')) {
      api
        .createGuestSession()
        .then((res) => {
          sessionStorage.setItem('guestId', res);
          setGuestId(res);
        })
        .catch(onError);
    } else {
      setGuestId(sessionStorage.getItem('guestId'));
    }
  };

  const onChangeTabs = (key) => {
    setTab(key);
  };

  const onError = () => {
    setIsError(true);
  };

  useEffect(() => {
    getGuestId();
    getGenresList();
  }, []); // Запускаем только один раз при монтировании

  const appView = isError ? (
    <Error message="Oops. Something went wrong. Try again." type="error" />
  ) : (
    <APIProvider
      value={{ genres, postRating: api.postRating, deleteRating: api.deleteRating }}
    >
      <Header onChangeTabs={onChangeTabs} />
      <Main
        query={query}
        searchMovies={searchMovies}
        tab={tab}
        guestId={guestId}
      />
    </APIProvider>
  );

  return <>{appView}</>;
};

export default App;
// готово +