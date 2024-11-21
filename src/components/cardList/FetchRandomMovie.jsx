import React, { useState, useEffect } from 'react';

const FetchRandomMovie = ({ setRandomMovie, setMessage, setIsError }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=64002571f8ed39931bd7ff706646bca4&language=en-US`);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
                const data = await response.json();

                if (data.results.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.results.length);
                    const randomMovie = data.results[randomIndex];

                    setRandomMovie(randomMovie);
                    setMessage('Ваш случайный фильм:');
                } else {
                    throw new Error('Фильмы не найдены');
                }
            } catch (error) {
                setIsError(true);
                setMessage('Ошибка при выборе фильма: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovie(); 
    }, [setRandomMovie, setMessage, setIsError]);

    return null;
};

export default FetchRandomMovie;