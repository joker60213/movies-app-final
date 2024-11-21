import { useCallback } from 'react';

const useAPI = () => {
    const apiToken =
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NDAwMjU3MWY4ZWQzOTkzMWJkN2ZmNzA2NjQ2YmNhNCIsInN1YiI6IjY1ODk5OWZmMDcyMTY2NjdlNGE1ZTFjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Fow_XT2lKTxtiCeT-55ML2Yio61BWS_mEW0LwDo4_gs';
    
    const apiKey = '64002571f8ed39931bd7ff706646bca4';
    
    const mainUrl = 'https://api.themoviedb.org/3/';

    const headers = {
        accept: 'application/json',
        Authorization: `${apiToken}`,
    };

    const getResponse = useCallback(async (url) => {
        const response = await fetch(`${mainUrl}${url}`, {
            method: 'GET',
            headers: headers,
        });

        if (response.ok) {
            return await response.json();
        }

        throw new Error(`Не удалость получить данные ${mainUrl}${url}`);
    }, [mainUrl]);

    const postRating = async (guestId, movieId, value) => {
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ value }),
        };

        const response = await fetch(
            `${mainUrl}movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${guestId}`,
            options
        );

        if (response.ok) {
            return await response.json();
        }

        throw new Error('Не удалось опубликовать данные рейтинга');
    };

    const deleteRating = async (guestId, movieId) => {
        const options = {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
        };

        const response = await fetch(
            `${mainUrl}movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${guestId}`,
            options
        );

        if (response.ok) {
            return await response.json();
        }

        throw new Error('Не удалось удалить данные рейтинга');
    };

    const getMoviesOnQuery = async (query, page = 1, adult = false, language = 'en-US') => {
        const res = await getResponse(
            `search/movie?query=${query}&include_adult=${adult}&language=${language}&page=${page}`
        );
        return {
            results: res.results,
            totalItems: res.total_results,
        };
    };

    const getGenresList = async (language = 'en') => {
        const res = await getResponse(`genre/movie/list?language=${language}`);
        return res.genres;
    };

    const createGuestSession = async () => {
        const res = await getResponse('authentication/guest_session/new');
        return res.guest_session_id;
    };

    const getMoviesWithRating = async (guestId, page = 1, language = 'en-US') => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        };

        const response = await fetch(
            `${mainUrl}guest_session/${guestId}/rated/movies?api_key=${apiKey}&language=${language}&page=${page}&sort_by=created_at.asc`,
            options
        );

        if (response.ok) {
            return await response.json().then((res) => ({
                results: res.results,
                totalItems: res.total_results,
            }));
        }

        throw new Error(`Не удалось получить данные ${mainUrl}`);
    };

    return {
        getMoviesOnQuery,
        getGenresList,
        createGuestSession,
        postRating,
        deleteRating,
        getMoviesWithRating,
    };
};

export default useAPI;