import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import DemosPage from './pages/DemosPage.tsx'
import CloudIDEPage from './pages/CloudIDEPage.tsx'
import CodeReviewPage from './pages/CodeReviewPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/ide" element={<CloudIDEPage />} />
        <Route path="/code-review" element={<CodeReviewPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

