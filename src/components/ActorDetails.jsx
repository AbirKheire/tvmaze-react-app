import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ActorDetails = () => {
  const { id } = useParams(); // recup id acteur depuis URL
  const [actor, setActor] = useState(null); // infos acteur
  const [shows, setShows] = useState([]); // series jouees
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        const actorRes = await axios.get(`https://api.tvmaze.com/people/${id}`);
        setActor(actorRes.data); // stock acteur

        const castCreditsRes = await axios.get(
          `https://api.tvmaze.com/people/${id}/castcredits?embed=show`
        );

        const uniqueShows = [];
        const seen = new Set();

        // evite doublons dans les series
        castCreditsRes.data.forEach((credit) => {
          const show = credit._embedded.show;
          if (!seen.has(show.id)) {
            seen.add(show.id);
            uniqueShows.push(show);
          }
        });

        setShows(uniqueShows); // stocke les shows
      } catch (err) {
        console.error('Erreur chargement acteur :', err);
      }
    };

    fetchActorData(); // appel au mount
  }, [id]);

  const goToShow = (showId) => {
    navigate(`/show/${showId}`); // vers page show
  };

  if (!actor) return <p>Chargement acteur...</p>; 

  return (
    <div className="actor-details">
      <Link to="/">
        <button
          style={{
            marginBottom: '1rem',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3f568c',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          ⬅ Retour a la recherche
        </button>
      </Link>

      <h1>{actor.name}</h1>

      {actor.image && (
        <img
          src={actor.image.medium}
          alt={actor.name}
          style={{
            width: '150px',
            borderRadius: '10px',
            marginBottom: '1rem',
          }}
        />
      )}

      <h2>Bio</h2>
      <p>{actor?.birthday && `Ne(e) le : ${actor.birthday}`}</p>
      <p>{actor?.country?.name && `Pays : ${actor.country.name}`}</p>
      <p>{actor?.gender && `Genre : ${actor.gender}`}</p>

      <h2 style={{ marginTop: '2rem' }}>Series principales</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {shows.map((show) => (
          <div
            key={show.id}
            style={{
              width: '160px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '8px',
              padding: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onClick={() => goToShow(show.id)}
          >
            <img
              src={
                show.image?.medium ||
                'https://via.placeholder.com/210x295?text=No+Image'
              }
              alt={show.name}
              style={{ width: '100%', borderRadius: '6px' }}
            />
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{show.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActorDetails;
