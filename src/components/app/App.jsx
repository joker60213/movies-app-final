import React, { useState, useEffect} from 'react'



import Main from '../main/Main'
import Header from '../header/Header'
import useAPI from '../../hooks/useAPI' 
import { APIProvider } from '../../apiСontext/API-Context'
import Error from '../error/Error'


const App = () => {
  const api = useAPI();

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
  }, []);

  const appView = isError ? (
    <Error message="Ой. Что-то пошло не так. Пробовать снова." type="error" />
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