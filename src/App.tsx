import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { AdminAuthProvider } from './admin/AdminAuthContext'
import AdminGuard from './admin/AdminGuard'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminModulePlaceholder from './admin/AdminModulePlaceholder'
import Home from './pages/Home'
import Empresa from './pages/Empresa'
import Servicios from './pages/Servicios'
import Proyectos from './pages/Proyectos'
import ProyectoDetail from './pages/ProyectoDetail'
import Licitaciones from './pages/Licitaciones'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contacto from './pages/Contacto'
import Privacidad from './pages/Privacidad'
import Terminos from './pages/Terminos'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresa" element={<Empresa />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/proyectos/:id" element={<ProyectoDetail />} />
          <Route path="/licitaciones" element={<Licitaciones />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="proyectos" element={<AdminModulePlaceholder />} />
              <Route path="servicios" element={<AdminModulePlaceholder />} />
              <Route path="blog" element={<AdminModulePlaceholder />} />
              <Route path="licitaciones" element={<AdminModulePlaceholder />} />
              <Route path="empresa" element={<AdminModulePlaceholder />} />
              <Route path="inicio" element={<AdminModulePlaceholder />} />
              <Route path="contacto" element={<AdminModulePlaceholder />} />
              <Route path="medios" element={<AdminModulePlaceholder />} />
              <Route path="consultas" element={<AdminModulePlaceholder />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}
