import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Login from "./pages/Login";
import Editor from "./pages/Editor";
import Preview from "./pages/Preview";
import ProtectedRoute from "./routes/ProtectedRoute";
import Careers from "./pages/Careers";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#0f172a', // slate-900
            color: '#e2e8f0', // slate-200
            border: '1px solid #1e293b', // slate-800
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#3b82f6', // blue-500
              secondary: '#fff',
            },
            style: {
              border: '1px solid #1e293b', // slate-800
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#fff',
            },
            style: {
              border: '1px solid #7f1d1d', // red-900/50 approx
            }
          },
        }}
      />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
