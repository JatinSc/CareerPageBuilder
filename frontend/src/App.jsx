import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Login from "./pages/Login";
import Editor from "./pages/Editor";
import Preview from "./pages/Preview";
import ProtectedRoute from "./routes/ProtectedRoute";
import Careers from "./pages/Careers";
import Home from "./pages/Home";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        /> 
        <Route path="/preview" element={<Preview />} />
        <Route path="/:companySlug/careers" element={<Careers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
