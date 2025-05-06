import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowSearch from './components/ShowSearch';
import Navbar from './components/Navbar';
import Actors from './components/Actors';
import Calendar from './components/Calendar';
import ActorDetails from './components/ActorDetails';
import MovieDetails from './components/MovieDetails';

// Lazy load the components
const ShowDetails = lazy(() => import('./components/ShowDetails'));
const EpisodeDetails = lazy(() => import('./components/EpisodeDetails'));


function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div style={{ padding: '2rem' }}>Loading details...</div>}>
        <Routes>
          <Route path="/" element={<ShowSearch />} />
          <Route path="/show/:id" element={<ShowDetails />} />
          <Route path="/actors" element={<Actors />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/actor/:id" element={<ActorDetails />} />
          <Route path="/actor/name/:name" element={<ActorDetails />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/show/episode/:episodeId" element={<EpisodeDetails />} /> {/* ✅ Updated path to avoid conflict */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
