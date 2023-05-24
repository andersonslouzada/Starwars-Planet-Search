import React, { useContext, useState, useEffect } from 'react';
import PlanetsContext from '../contexts/PlanetsContext';

export default function PlanetsTable() {
  const { planets, nameFilter, setNameFilter } = useContext(PlanetsContext);
  const [filters, setFilters] = useState({
    column: 'population',
    comparison: 'maior que',
    value: '0',
  });
  const [filteredPlanets, setFilteredPlanets] = useState([]);

  useEffect(() => {
    const filteredData = planets.filter((planet) => planet.name
      .toLowerCase().includes(nameFilter.toLowerCase()));
    setFilteredPlanets(filteredData);
  }, [planets, nameFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleNameFilterChange = (event) => {
    const { value } = event.target;
    setNameFilter(value);
    setFilteredPlanets(planets.filter((planet) => planet.name
      .toLowerCase().includes(value.toLowerCase())));
  };

  const handleFilterClick = () => {
    let filteredData = planets;

    if (filters.column && filters.comparison && filters.value !== '') {
      const filterNumber = parseFloat(filters.value);

      if (filters.comparison === 'maior que') {
        filteredData = filteredData.filter(
          (planet) => parseFloat(planet[filters.column]) > filterNumber,
        );
      } else if (filters.comparison === 'menor que') {
        filteredData = filteredData.filter(
          (planet) => parseFloat(planet[filters.column]) < filterNumber,
        );
      } else if (filters.comparison === 'igual a') {
        filteredData = filteredData.filter(
          (planet) => parseFloat(planet[filters.column]) === filterNumber,
        );
      }
    }

    setFilteredPlanets(filteredData);
  };

  return (
    <div>
      <input
        data-testid="name-filter"
        placeholder="Search name"
        value={ nameFilter }
        onChange={ handleNameFilterChange }
      />
      <select
        data-testid="column-filter"
        name="column"
        value={ filters.column }
        onChange={ handleChange }
      >
        <option value="population">population</option>
        <option value="orbital_period">orbital_period</option>
        <option value="diameter">diameter</option>
        <option value="rotation_period">rotation_period</option>
        <option value="surface_water">surface_water</option>
      </select>

      <select
        data-testid="comparison-filter"
        name="comparison"
        value={ filters.comparison }
        onChange={ handleChange }
      >
        <option value="maior que">maior que</option>
        <option value="menor que">menor que</option>
        <option value="igual a">igual a</option>
      </select>

      <input
        data-testid="value-filter"
        type="number"
        name="value"
        value={ filters.value }
        onChange={ handleChange }
      />

      <button data-testid="button-filter" onClick={ handleFilterClick }>
        Filter
      </button>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Rotation Period</th>
            <th scope="col">Orbital Period</th>
            <th scope="col">Diameter</th>
            <th scope="col">Climate</th>
            <th scope="col">Gravity</th>
            <th scope="col">Terrain</th>
            <th scope="col">Surface Water</th>
            <th scope="col">Population</th>
            <th scope="col">Films</th>
            <th scope="col">Created</th>
            <th scope="col">Edited</th>
            <th scope="col">URL</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlanets.map((planet) => (
            <tr key={ planet.name }>
              <td>{planet.name}</td>
              <td>{planet.rotation_period}</td>
              <td>{planet.orbital_period}</td>
              <td>{planet.diameter}</td>
              <td>{planet.climate}</td>
              <td>{planet.gravity}</td>
              <td>{planet.terrain}</td>
              <td>{planet.surface_water}</td>
              <td>{planet.population}</td>
              <td>{planet.films}</td>
              <td>{planet.created}</td>
              <td>{planet.edited}</td>
              <td>{planet.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
