import { ReactElement } from 'react';
import { TankTable } from './components/TankTable';
import './App.scss';

function App(): ReactElement {
  return (
    <div className="app">
      <main className="app__main">
        <h1 className="app__title">Tanks</h1>
        <TankTable />
      </main>
    </div>
  );
}

export default App;
