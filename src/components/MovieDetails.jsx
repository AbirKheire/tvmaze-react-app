import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams(); // recup id du film depuis URL
  const [movie, setMovie] = useState(null); // state pour les infos du film

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
          params: {
            api_key: TMDB_API_KEY,
            language: 'en-US'
          }
        });
        setMovie(res.data); // infos du film
      } catch (err) {
        console.error('Erreur chargement film:', err);
      }
    };

    fetchMovie(); 
  }, [id]);

  if (!movie) return <p style={{ padding: '2rem' }}>Chargement du film...</p>; // attente

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>{movie.title}</h1>

      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
          alt={movie.title}
          style={{ borderRadius: '12px', marginBottom: '1rem' }}
        />
      )}

      <p><strong>Date de sortie:</strong> {movie.release_date}</p>
      <p><strong>Resume:</strong></p>
      <p>{movie.overview}</p>
    </div>
  );
};

export default MovieDetails;
