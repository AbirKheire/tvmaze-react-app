import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GuestCast = ({ episodeId }) => {
  const [guestCast, setGuestCast] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://api.tvmaze.com/episodes/${episodeId}/guestcast`)
      .then(res => setGuestCast(res.data))
      .catch(err => console.error(err));
  }, [episodeId]);

  const goToActorProfile = (id) => {
    navigate(`/actor/${id}`);
  };

  return (
    <div className="guest-cast">
      {guestCast.map(guest => (
        <div
          key={guest.person.id}
          style={{ marginBottom: '15px', cursor: 'pointer' }}
          onClick={() => goToActorProfile(guest.person.id)}
        >
          <img
            src={guest.person.image?.medium || 'https://via.placeholder.com/100x140?text=No+Image'}
            alt={guest.person.name}
            style={{ width: '100px', borderRadius: '6px' }}
          />
          <p style={{ marginTop: '5px' }}>{guest.person.name} as {guest.character.name}</p>
        </div>
      ))}
    </div>
  );
};

export default GuestCast;
