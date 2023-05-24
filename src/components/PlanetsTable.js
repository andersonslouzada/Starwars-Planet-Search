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
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ]);

  useEffect(() => {
    let filteredData = planets;

    appliedFilters.forEach((filter) => {
      if (filter.column && filter.comparison && filter.value !== '') {
        const filterNumber = parseFloat(filter.value);

        if (filter.comparison === 'maior que') {
          filteredData = filteredData.filter(
            (planet) => parseFloat(planet[filter.column]) > filterNumber,
          );
        } else if (filter.comparison === 'menor que') {
          filteredData = filteredData.filter(
            (planet) => parseFloat(planet[filter.column]) < filterNumber,
          );
        } else if (filter.comparison === 'igual a') {
          filteredData = filteredData.filter(
            (planet) => parseFloat(planet[filter.column]) === filterNumber,
          );
        }
      }
    });

    filteredData = filteredData.filter((planet) => planet.name
      .toLowerCase().includes(nameFilter.toLowerCase()));

    setFilteredPlanets(filteredData);
  }, [planets, nameFilter, appliedFilters]);

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
  };

  const handleFilterClick = () => {
    const newFilter = {
      column: filters.column,
      comparison: filters.comparison,
      value: filters.value,
    };

    setAppliedFilters((prevFilters) => [...prevFilters, newFilter]);

    setAvailableColumns((prevColumns) => prevColumns
      .filter((column) => column !== filters.column));

    const nextColumn = availableColumns[0];
    setFilters((prevFilters) => ({
      ...prevFilters,
      column: nextColumn,
    }));
  };

  const removeFilter = (index) => {
    const removedColumn = appliedFilters[index].column;
    const updatedFilters = [...appliedFilters];
    updatedFilters.splice(index, 1);
    setAppliedFilters(updatedFilters);

    setAvailableColumns((prevColumns) => prevColumns.concat(removedColumn).sort());
  };

  const removeAllFilters = () => {
    setAppliedFilters([]);
    setAvailableColumns([
      'population',
      'orbital_period',
      'diameter',
      'rotation_period',
      'surface_water',
    ]);
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
        {availableColumns.map((column) => (
          <option
            key={ column }
            value={ column }
          >
            {column}
          </option>
        ))}
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

      <button data-testid="button-remove-filters" onClick={ removeAllFilters }>
        Remove all filters
      </button>

      <div>
        {appliedFilters.map((filter, index) => (
          <div data-testid="filter" key={ index }>
            <span>{`${filter.column} ${filter.comparison} ${filter.value}`}</span>
            <button onClick={ () => removeFilter(index) }>Remover</button>
          </div>
        ))}
      </div>
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
