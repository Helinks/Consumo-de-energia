import './App.css';
import Dashboard from './pages/dashboard/dashboard';
import CalcularConsumo from './pages/calcularConsumo/calcularConsumo';
import GestionarInquilinos from './pages/gestionarInquilinos/gestionarInquilinos';
import GestionarApartamentos from './pages/gestionarApartamentos/gestionarApartamentos';
import HistorialConsumo from './pages/historialConsumo/historialConsumo';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Resultados from './pages/calcularConsumo/resultados';
import ResultadoHistorial from './pages/historialConsumo/resultadoHistorial';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard/>}></Route>
        <Route path='/calcularConsumo' element={<CalcularConsumo/>}></Route>
        <Route path='/resultados' element={<Resultados/>}></Route>
        <Route path='/inquilinos' element={<GestionarInquilinos/>}></Route>
        <Route path='/apartamentos' element={<GestionarApartamentos/>}></Route>
        <Route path='/historial' element={<HistorialConsumo/>}></Route>
        <Route path='/resultadoHistorial' element={<ResultadoHistorial/>}></Route>
      </Routes>
    </Router>
   
  );
}

export default App;
