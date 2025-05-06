import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ShowSearch.css';

const ShowSearch = () => {
  // states recherche, filtres, pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [popularShows, setPopularShows] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [filteredShows, setFilteredShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);
  const maxVisible = 10;

  const navigate = useNavigate();

  const cardWidth = 220;
  const visibleCards = 5;
  const showsPerPage = 6;

  // au chargement, on récupère toutes les séries
  useEffect(() => {
    axios.get('https://api.tvmaze.com/shows').then((res) => {
      const sorted = res.data
        .filter((show) => show.rating?.average)
        .sort((a, b) => b.rating.average - a.rating.average);

      setPopularShows(sorted.slice(0, 15)); // top 15 populaires
      setFilteredShows(res.data);
    });
  }, []);

  // slider carousel top shows
  const nextSlide = () => {
    const maxIndex = popularShows.length - visibleCards;
    if (carouselIndex < maxIndex) {
      setCarouselIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (carouselIndex > 0) {
      setCarouselIndex((prev) => prev - 1);
    }
  };

  // filtre par genre
  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setGenreFilter(genre);
    setCurrentPage(1);
    axios.get('https://api.tvmaze.com/shows').then((res) => {
      const filtered = res.data.filter((show) => show.genres.includes(genre));
      setFilteredShows(filtered);
    });
  };

  // recherche par nom
  const handleSearch = async () => {
    const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
    const shows = res.data.map((result) => result.show);
    setFilteredShows(shows);
    setCurrentPage(1);
  };

  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = filteredShows.slice(indexOfFirstShow, indexOfLastShow);

  const goToShow = (id) => {
    navigate(`/show/${id}`);
  };

  return (
    <div className="container">
      <h2>Search TV Shows</h2>

      {/* barre de recherche + filtre */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a show..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <select onChange={handleGenreChange} value={genreFilter}>
          <option value=""> Filter by Genre</option>
          <option value="Drama">Drama</option>
          <option value="Comedy">Comedy</option>
          <option value="Action">Action</option>
          <option value="Horror">Horror</option>
          <option value="Crime">Crime</option>
          <option value="Fantasy">Fantasy</option>
        </select>
      </div>

      {/* carrousel popular shows */}
      <h3>Popular TV Shows</h3>
      <div className="carousel-wrapper">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${carouselIndex * cardWidth}px)` }}
        >
          {popularShows.map((show) => (
            <div className="show-card" key={show.id} onClick={() => goToShow(show.id)}>
              <img
                src={show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image'}
                alt={show.name}
              />
              <p>
                {show.name} ({show.premiered?.slice(0, 4)})
              </p>
            </div>
          ))}
        </div>
        <div className="carousel-arrow left" onClick={prevSlide}>‹</div>
        <div className="carousel-arrow right" onClick={nextSlide}>›</div>
      </div>

      {/* section tous les shows */}
      <h3>All TV Shows</h3>
      <div className="show-grid">
        {currentShows.map((show) => (
          <div className="show-card" key={show.id} onClick={() => goToShow(show.id)}>
            <img
              src={show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image'}
              alt={show.name}
            />
            <p>
              {show.name} ({show.premiered?.slice(0, 4)})
            </p>
          </div>
        ))}
      </div>

      {/* pagination */}
      {filteredShows.length > showsPerPage && (
        <div className="pagination">
          <button
            onClick={() => setStartIndex(Math.max(1, startIndex - 1))}
            disabled={startIndex === 1}
          >
            ◀
          </button>

          {Array.from({
            length: Math.min(
              maxVisible,
              Math.ceil(filteredShows.length / showsPerPage) - startIndex + 1
            ),
          }).map((_, i) => {
            const page = startIndex + i;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() =>
              setStartIndex((prev) =>
                prev + maxVisible - 1 < Math.ceil(filteredShows.length / showsPerPage)
                  ? prev + 1
                  : prev
              )
            }
            disabled={
              startIndex + maxVisible - 1 >=
              Math.ceil(filteredShows.length / showsPerPage)
            }
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowSearch;
