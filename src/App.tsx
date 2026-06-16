import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import ScrollToTop from './components/ScrollToTop'
import { ContentProvider } from './context/ContentContext'
import { AdminAuthProvider } from './admin/AdminAuthContext'
import AdminGuard from './admin/AdminGuard'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminProyectos from './admin/AdminProyectos'
import AdminServicios from './admin/AdminServicios'
import AdminBlog from './admin/AdminBlog'
import AdminLicitaciones from './admin/AdminLicitaciones'
import AdminConsultas from './admin/AdminConsultas'
import AdminContacto from './admin/AdminContactoPage'
import AdminInicio from './admin/AdminInicioPage'
import AdminEmpresa from './admin/AdminEmpresaPage'
import AdminMedios from './admin/AdminMedios'
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
      <ContentProvider>
        <AdminAuthProvider>
          <ScrollToTop />
          <Analytics />
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
                <Route path="proyectos" element={<AdminProyectos />} />
                <Route path="servicios" element={<AdminServicios />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="licitaciones" element={<AdminLicitaciones />} />
                <Route path="empresa" element={<AdminEmpresa />} />
                <Route path="inicio" element={<AdminInicio />} />
                <Route path="contacto" element={<AdminContacto />} />
                <Route path="medios" element={<AdminMedios />} />
                <Route path="consultas" element={<AdminConsultas />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider>
      </ContentProvider>
    </BrowserRouter>
  )
}
