import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

import useAPI from '../../api/useAPI'; /// тут API заменил на useAPI
import Spinner from '../uI/spinner/Spinner';
import Error from '../uI/error/Error';
import PaginationUI from '../uI/pagination/PaginationUI';
import { APIConsumer } from '../../api-context/API-Context';

import SearchInput from '../searchInput/SearchInput'; // ипортировал зачем не знаю

import CardItem from './cardItem/CardItem';

import './CardList.scss';

const CardList = ({ query, guestId, tab }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // c фолс на тру
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('Type to search...');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageRated, setCurrentPageRated] = useState(1);
  const [totalItems, setTotalItems] = useState(1); // с 0 на 1
  const [ratingList, setRatingList] = useState([]);

  const [randomMovie, setRandomMovie] = useState(null); // Новое состояние для случайного фильма

  const api =  useAPI(); // тут API заменил на useAPI

  const onMoviesLoad = (movies) => {
    setMovies(movies);
    setIsLoading(false);
    setIsError(false);
  };

  const onError = () => {
    setIsError(true);
    setIsLoading(false);
  };

  const getMovies = (query = '', currentPage) => {
    if (query.length === 0) {
      setMessage('Type to search...');
      setMovies ([]);
    }
    api
      .getMoviesOnQuery(query, currentPage)
      .then((res) => {
        onMoviesLoad(res.results);
        setTotalItems(res.totalItems);
      })
      .catch(onError);
  };

  const getMoviesWithRating = (guestId, currentPage) => {
    api
      .getMoviesWithRating(guestId, currentPage)
      .then((res) => {
        onMoviesLoad(res.results);
        setTotalItems(res.totalItems);
      })
      .catch(onError);
  };

  const debounceGetMovies = useCallback(
    debounce((query, currentPage) => {
      setIsLoading(true);
      setMessage('We are very sorry, but we have not found anything...');
      getMovies(query, currentPage);
    }, 1500),
    []
  );

  useEffect(() => {
    debounceGetMovies(query, currentPage);
  }, [query, currentPage, debounceGetMovies]);

  const paginationOnChange = (page) => {
    if (tab === 'Search') {
      setCurrentPage(page);
    } else {
      setCurrentPageRated(page);
    }
  };

  const addRatedMovie = (id, value) => {
    const newRatedMovie = { id, value };
    setRatingList((prevRatingList) => [...prevRatingList, newRatedMovie]);
  };

  const removeRatedMovie = (id) => {
    setRatingList((prevRatingList) => prevRatingList.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const storedRatingList = sessionStorage.getItem('ratingList');
    if (storedRatingList) {
      setRatingList(JSON.parse(storedRatingList));
    }
  }, []);

  useEffect(() => {
    if (tab === 'Rated') {
      setMessage('We are very sorry, but we have not found anything...');
      getMoviesWithRating(guestId, currentPageRated);
    }
    if (tab === 'Search') {
      setMessage('Type to search...');
      getMovies(query, currentPage);
    }
    sessionStorage.setItem('ratingList', JSON.stringify(ratingList));
  }, [query, currentPage, currentPageRated, tab, guestId, ratingList]);



  
 // функция случайный фильм
 const fetchRandomMovie = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
       `https://api.themoviedb.org/3/discover/movie?api_key=64002571f8ed39931bd7ff706646bca4&language=en-US`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
    const data = await response.json();
  
  // проверка
  if (data.results.length > 0) {
  const randomIndex = Math.floor(Math.random() * data.results.length);
  const randomMovie = data.results[randomIndex];
  
  setRandomMovie(randomMovie); // Добавляем случайный фильм в массив
  setMessage('Here is your random movie:');
  } else {
    throw new Error('No movies found');
  }
  } catch (error) {
      setIsError(true);
      setMessage('Error fetching movie: ' + error.message);
  } finally {
      setIsLoading(false);
  }
  };
  
  useEffect(() => {
    fetchRandomMovie(); // вызов функс
    }, []);


  const errorView = isError ? <Error message="Oops. Something went wrong. Try again." type="error" /> : null;
  const spinner = isLoading && !isError ? <Spinner fontSize={60} /> : null;
  const current = tab === 'Search' ? currentPage : currentPageRated;

  const cardList = !isLoading && !isError ? (
    <CardListView
      movies={[...movies, randomMovie].filter(Boolean)} // объедение рандомные фильмы и обычные
      message={message}
      current={current}
      onChange={paginationOnChange}
      totalItems={totalItems}
      guestId={guestId}
      addRatedMovie={addRatedMovie}
      removeRatedMovie={removeRatedMovie}
      ratingList={ratingList}
    />
  ) : null;

  return (
    <>
      {errorView}
      {spinner}
      {cardList}  
    </>
  );
};

const CardListView = ({
  movies,
  message,
  current,
  onChange,
  totalItems,
  guestId,
  addRatedMovie,
  removeRatedMovie,
  ratingList,
}) => {

  return movies.length > 0 ? (
    <APIConsumer>
      {({ genres, postRating, deleteRating }) => (
        <>
          <ul className="card-list">
            {movies.map((movie) => {
              const rating = ratingList.find((item) => item.id === movie.id)?.value || undefined;
              return (

                <CardItem
                  key={movie.id}
                  movie={movie}
                  genresList={genres}
                  postRating={postRating}
                  deleteRating={deleteRating}
                  guestId={guestId}
                  addRatedMovie={addRatedMovie}
                  removeRatedMovie={removeRatedMovie}
                  rating={rating}
                />
              );
            })}
          </ul>
          
          <PaginationUI current={current} onChange={onChange} totalItems={totalItems} />
        </>
      )}
      
    </APIConsumer>
  ) : (
    <Error message={message} type="info" />
  );
};

export default CardList;
// вроде ок