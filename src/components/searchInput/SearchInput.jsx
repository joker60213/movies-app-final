import React, { useState } from 'react';

import './SearchInput.scss';

const SearchInput = ({ searchMovies }) => {
  const [value, setValue] = useState('');

  const onChange = (evt) => {
    const newValue = evt.target.value;
    setValue(newValue);
    searchMovies(newValue);
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <input
        className="search-input"
        placeholder="Type to search..."
        value={value}
        onChange={onChange}
      />
    </form>
  );
};

export default SearchInput;
