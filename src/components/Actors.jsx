import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Actors.css';

const Actors = () => {
  const [searchTerm, setSearchTerm] = useState(''); // champ de recherche
  const [results, setResults] = useState([]); // resultats recherche
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://api.tvmaze.com/search/people?q=${searchTerm}`);
      setResults(res.data); // stocke les persos trouves
    } catch (err) {
      console.error('Erreur recherche acteur:', err);
    }
  };

  const goToActor = (id) => {
    navigate(`/actor/${id}`); // vers fiche acteur
  };

  return (
    <div className="actors-container">
      <Link to="/">
        <button className="back-button">⬅ Retour a l'accueil</button>
      </Link>

      <h1>Recherche d'acteurs</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Nom de l'acteur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Rechercher</button>
      </div>

      <div className="actors-grid">
        {results.map((item) => (
          <div
            className="actor-card"
            key={item.person.id}
            onClick={() => goToActor(item.person.id)}
          >
            {item.person.image ? (
              <img src={item.person.image.medium} alt={item.person.name} />
            ) : (
              <div className="no-image">Pas d'image</div>
            )}
            <p>{item.person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Actors;
