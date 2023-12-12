import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {FaSearch } from 'react-icons/fa';

import { useTranslation } from 'react-i18next';

function SearchComponent() {

  const { t, i18n } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
      <div className="search-container">
        <div className="search-wrapper">
          <input
            className='search-field'
            type="text"
            placeholder={t('searchworkers')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-icon">
            <FaSearch />
          </div>
        </div>
      </div>
  );
}

export default SearchComponent;