import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';

export default function PlanetsProvider({ children }) {
  const [nameFilter, setNameFilter] = useState('');
  const [planets, setPlanets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlanets = async () => {
    setIsLoading(true);
    const response = await fetch('https://swapi.dev/api/planets');
    const data = await response.json();
    setPlanets(data.results.filter((planet) => delete planet.residents));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  return (
    isLoading ? <p>Loading...</p>
      : (
        <PlanetsContext.Provider value={ { planets, nameFilter, setNameFilter } }>
          <div>
            { children }
          </div>
        </PlanetsContext.Provider>
      )
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
