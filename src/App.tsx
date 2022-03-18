import './App.css';
import GetRoutes from './routes/index'
import {
  BrowserRouter
} from 'react-router-dom';
function App() {
  return (
    <div className='App'>
        <BrowserRouter>
        <GetRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
