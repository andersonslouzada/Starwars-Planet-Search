import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import PlanetsTable from '../components/PlanetsTable';
import PlanetsContext from '../contexts/PlanetsContext';

describe('testa o componente PlanetsTable', () => {
  it('renders without error', () => {
    render(
      <PlanetsContext.Provider value={{ planets: [], nameFilter: '', setNameFilter: () => {} }}>
        <PlanetsTable />
      </PlanetsContext.Provider>
    );
  });

  it('testa se filtra os planetas corretamente', () => {
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

    const filteredRows = getAllByTestId('planet-row');
    expect(filteredRows.length).toBe(1);
    expect(filteredRows[0]).toHaveTextContent('Planet 2');
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
});
