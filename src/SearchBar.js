import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className='search-bar'>
      <form onSubmit={handleSubmit}>
        <div
          className='search-bar__container'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <input
            type='text'
            placeholder='Search podcasts...'
            value={query}
            onChange={handleChange}
          />
          {isHovered && (
            <div className='search-bar__tooltip'>
              Search podcasts by title, description, or keywords...
            </div>
          )}
        </div>
        <button type='submit'>Search</button>
      </form>
    </div>
  );
};

export default SearchBar;
