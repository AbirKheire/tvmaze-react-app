import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ShowDetails.css';

const ShowDetails = () => {
  const { id } = useParams(); // recup id de l'URL
  const [show, setShow] = useState(null); // state pour la serie
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.tvmaze.com/shows/${id}?embed[]=cast&embed[]=episodes`
        );
        setShow(response.data); // stock les infos
      } catch (error) {
        console.error('Erreur lors du chargement de la serie:', error);
      }
    };

    fetchShowDetails(); // appel au chargement
  }, [id]);

  if (!show) return <p>Chargement...</p>; // si pas encore dispo

  return (
    <div className="container">
      <Link to="/">
        <button className="back-button">← Retour</button>
      </Link>

      <h1>{show.name}</h1>

      {show.image && (
        <img
          src={show.image.original}
          alt={show.name}
          style={{ maxWidth: '300px', borderRadius: '10px' }}
        />
      )}

      <p dangerouslySetInnerHTML={{ __html: show.summary }}></p> {}

      {show._embedded.cast && (
        <>
          <h3>Acteurs</h3>
          <div className="cast-grid">
            {show._embedded.cast.slice(0, 10).map((c, i) => (
              <div
                key={i}
                className="cast-card"
                onClick={() => navigate(`/actor/${c.person.id}`)} // --> page acteur
              >
                <img
                  src={
                    c.person.image?.medium ||
                    'https://via.placeholder.com/120x160?text=No+Image'
                  }
                  alt={c.person.name}
                />
                <div className="actor-name">{c.person.name}</div>
                <div className="character-name">dans le role de {c.character.name}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {show._embedded.episodes && (
        <>
          <h3>Episodes</h3>
          <ul>
            {show._embedded.episodes.slice(0, 10).map((ep) => (
              <li key={ep.id}>
                <Link
                  to={`/show/episode/${ep.id}`}
                  style={{
                    textDecoration: 'none',
                    color: '#c200d3',
                    fontWeight: 'bold',
                  }}
                >
                  S{ep.season}E{ep.number} : {ep.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ShowDetails;
