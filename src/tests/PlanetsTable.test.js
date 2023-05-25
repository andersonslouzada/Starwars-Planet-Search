import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PlanetsTable from '../components/PlanetsTable';
import PlanetsContext from '../contexts/PlanetsContext';

const mockPlanets = [
  { name: 'Earth', population: '1000000' },
  { name: 'Mars', population: '500000' },
];

const mockPlanetsContext = {
  planets: mockPlanets,
  nameFilter: '',
  setNameFilter: jest.fn(),
};

describe('testa o componente PlanetsTable', () => {
  it('renders without error', () => {
    render(
      <PlanetsContext.Provider value={{ planets: [], nameFilter: '', setNameFilter: () => {} }}>
        <PlanetsTable />
      </PlanetsContext.Provider>
    );
  });

  it('testa se o filtro maior que corretamente', () => {
    const planets = [
      { name: 'Planet 1', population: '1000000' },
      { name: 'Planet 2', population: '2000000' },
    ];
    const { getByTestId, getAllByTestId } = render(
      <PlanetsContext.Provider value={{ planets, nameFilter: '', setNameFilter: () => {} }}>
        <PlanetsTable />
      </PlanetsContext.Provider>
    );

    fireEvent.change(getByTestId('column-filter'), { target: { value: 'population' } });
    fireEvent.change(getByTestId('comparison-filter'), { target: { value: 'maior que' } });
    fireEvent.change(getByTestId('value-filter'), { target: { value: '1500000' } });
    fireEvent.click(getByTestId('button-filter'));

    const planetTwo = getAllByTestId('planet-row');
    expect(planetTwo.length).toBe(1);
    expect(planetTwo[0]).toHaveTextContent('Planet 2');

    const removeAllFiltersButton = getByTestId('button-remove-filters');
    fireEvent.click(removeAllFiltersButton);
    
    fireEvent.change(getByTestId('column-filter'), { target: { value: 'population' } });
    fireEvent.change(getByTestId('comparison-filter'), { target: { value: 'menor que' } });
    fireEvent.change(getByTestId('value-filter'), { target: { value: '1500000' } });
    fireEvent.click(getByTestId('button-filter'));

    const planetOne = getAllByTestId('planet-row');
    expect(planetOne.length).toBe(1);
    expect(planetOne[0]).toHaveTextContent('Planet 1');

    fireEvent.click(removeAllFiltersButton);
    
    fireEvent.change(getByTestId('column-filter'), { target: { value: 'population' } });
    fireEvent.change(getByTestId('comparison-filter'), { target: { value: 'igual a' } });
    fireEvent.change(getByTestId('value-filter'), { target: { value: '1000000' } });
    fireEvent.click(getByTestId('button-filter'));

    expect(planetOne.length).toBe(1);
    expect(planetOne[0]).toHaveTextContent('Planet 1');
  });

  it('testa se filtra quando altera o input de nome corretamente', () => {
    const setNameFilterMock = jest.fn();
    const { getByTestId } = render(
      <PlanetsContext.Provider value={{ planets: [], nameFilter: '', setNameFilter: setNameFilterMock }}>
        <PlanetsTable />
      </PlanetsContext.Provider>
    );

    const nameFilterInput = getByTestId('name-filter');
    fireEvent.change(nameFilterInput, { target: { value: 'Alderaan' } });

    expect(setNameFilterMock).toHaveBeenCalledWith('Alderaan');
  });

  it('testa se remove filtro ao clicar no botão "Remover"', () => {
    const planets = [
      { name: 'Planet 1', population: '1000000' },
      { name: 'Planet 2', population: '2000000' },
    ];
    const { getByTestId, getByText } = render(
      <PlanetsContext.Provider value={{ planets, nameFilter: '', setNameFilter: () => {} }}>
        <PlanetsTable />
      </PlanetsContext.Provider>
    );
  
    fireEvent.change(getByTestId('column-filter'), { target: { value: 'population' } });
    fireEvent.change(getByTestId('comparison-filter'), { target: { value: 'maior que' } });
    fireEvent.change(getByTestId('value-filter'), { target: { value: '1500000' } });
    expect(getByText(/planet 1/i)).toBeInTheDocument();
    expect(getByText(/planet 2/i)).toBeInTheDocument();

    fireEvent.click(getByTestId('button-filter'));
    expect(getByText(/planet 2/i)).toBeInTheDocument();

    fireEvent.click(getByTestId('button-remove-filter'));
    expect(getByText(/planet 1/i)).toBeInTheDocument();
  });

  it('testa se a função removeAllFilters é chamada corretamente', () => {
    const { getByTestId } = render(
      <PlanetsContext.Provider
        value={{
          planets: [],
          nameFilter: '',
          setNameFilter: () => {},
        }}
      >
        <PlanetsTable />
      </PlanetsContext.Provider>
    );

    fireEvent.change(getByTestId('column-filter'), { target: { value: 'population' } });
    fireEvent.change(getByTestId('comparison-filter'), { target: { value: 'maior que' } });
    fireEvent.change(getByTestId('value-filter'), { target: { value: '1500000' } });

    fireEvent.click(getByTestId('button-filter'));

    const filter = getByTestId('filter')
    expect(filter).toBeInTheDocument();

    const removeAllFiltersButton = getByTestId('button-remove-filters');
    fireEvent.click(removeAllFiltersButton);
    
    expect(filter).not.toBeInTheDocument();
  });

  it('testa se aplica o filtro quando todas as condições do filtro são atendidas', () => {
    const filter = { column: 'population', comparison: 'maior que', value: '500000' };
    
    const { getByTestId } = render(
      <PlanetsContext.Provider value={mockPlanetsContext}>
        <PlanetsTable />
      </PlanetsContext.Provider>
    );

    fireEvent.change(getByTestId('column-filter'), { target: { value: filter.column } });
    fireEvent.change(getByTestId('comparison-filter'), { target: { value: filter.comparison } });
    fireEvent.change(getByTestId('value-filter'), { target: { value: filter.value } });
    
    fireEvent.click(getByTestId('button-filter'));

    expect(getByTestId('planet-row')).toBeInTheDocument();
  });
  
  it('testa se não aplica o filtro quando qualquer condição de filtro não é atendida', () => {
    const filter = { column: '', comparison: 'maior que', value: '500000' };
    
    const { getByTestId, queryByTestId } = render(
      <PlanetsContext.Provider value={mockPlanetsContext}>
        <PlanetsTable />
      </PlanetsContext.Provider>
    );

    fireEvent.change(getByTestId('column-filter'), { target: { value: filter.column } });
    fireEvent.change(getByTestId('comparison-filter'), { target: { value: filter.comparison } });
    fireEvent.change(getByTestId('value-filter'), { target: { value: filter.value } });

    fireEvent.click(getByTestId('button-filter'));

    expect(queryByTestId('planet-row')).not.toBeInTheDocument();
  });
});
