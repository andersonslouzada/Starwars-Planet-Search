import React from 'react';
import PlanetsProvider from './contexts/PlanetsProvider';
import PlanetsTable from './components/PlanetsTable';

function App() {
  return (
    <>
      <h1>Star Wars Planets</h1>
      <PlanetsProvider>
        <PlanetsTable />
      </PlanetsProvider>
    </>
  );
}

export default App;
