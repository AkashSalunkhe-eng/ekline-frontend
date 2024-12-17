import logo from './logo.svg';
import './App.css';
import DocumentCenter from './components/document-center';
import DocumentViewer from './components/document-viewer';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DocumentCenter />} />
        <Route path="/document/:filename" element={<DocumentViewer />} />
      </Routes>
    </div>
  );
}

export default App;
