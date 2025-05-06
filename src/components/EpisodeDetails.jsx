import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GuestCast from './GuestCast';

const EpisodeDetails = () => {
  const { episodeId } = useParams(); // recup id episode depuis URL
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null); 

  useEffect(() => {
    axios
      .get(`https://api.tvmaze.com/episodes/${episodeId}`)
      .then(res => setEpisode(res.data)) // stock les infos episode
      .catch(err => console.error(err)); 
  }, [episodeId]);

  const goToEpisode = (id) => {
    navigate(`/show/episode/${id}`); // navigation vers un autre ep
  };

  if (!episode) return <p>Chargement...</p>;

  const trailerQuery = `${episode.name} trailer`.replace(/\s+/g, '+'); // cherche trailer
  const trailerUrl = `https://www.youtube.com/embed?listType=search&list=${trailerQuery}`;

  return (
    <div className="episode-detail-container" style={{ padding: '20px' }}>
      {/* bouton retour home */}
      <Link to="/">
        <button
          style={{
            marginBottom: '1rem',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3f568c',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ⬅ Retour a l'accueil
        </button>
      </Link>

      <h1>{episode.name}</h1>

      <p dangerouslySetInnerHTML={{ __html: episode.summary }} />

      {episode.image && (
        <img
          src={episode.image.medium}
          alt={episode.name}
          style={{ maxWidth: '100%', marginBottom: '20px' }}
        />
      )}

      <div>
        <h3>Trailer</h3>
        <iframe
          width="560"
          height="315"
          src={trailerUrl}
          title="Trailer"
          frameBorder="0"
          allowFullScreen
        />
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Invites</h3>
        <GuestCast episodeId={episodeId} /> {/* liste des guests */}
      </div>

      <div style={{ marginTop: '30px' }}>
        <button onClick={() => goToEpisode(Number(episodeId) - 1)}>
          « Episode prec.
        </button>
        <button
          onClick={() => goToEpisode(Number(episodeId) + 1)}
          style={{ marginLeft: '10px' }}
        >
          Episode suiv. »
        </button>
      </div>
    </div>
  );
};

export default EpisodeDetails;
