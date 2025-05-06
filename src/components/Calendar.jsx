// components/Calendar.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Calendar.css';

const Calendar = () => {
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get('https://api.tvmaze.com/schedule?country=US');
        const grouped = res.data.reduce((acc, episode) => {
          const date = episode.airdate;
          acc[date] = acc[date] || [];
          acc[date].push(episode);
          return acc;
        }, {});
        setSchedule(grouped);
      } catch (err) {
        console.error("Erreur chargement calendrier", err);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="calendar-container">
      <h1>TV Schedule</h1>
      <div className="calendar-grid">
        {Object.entries(schedule).map(([date, episodes]) => (
          <div key={date} className="calendar-day">
            <h3>{new Date(date).toDateString()}</h3>
            <ul>
              {episodes.map(ep => (
                <li key={ep.id}>
                  <strong>{ep.show.name}</strong>: {ep.name} (S{ep.season}E{ep.number})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
