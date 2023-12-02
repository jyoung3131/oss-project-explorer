import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectForm from './components/ProjectFormPage/ProjectForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProjectForm />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
