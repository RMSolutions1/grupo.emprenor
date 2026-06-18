import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { ContentProvider } from './context/ContentContext'
import { AdminAuthProvider } from './admin/AdminAuthContext'
import { ProveedorAuthProvider } from './proveedor/ProveedorAuthContext'
import AdminGuard from './admin/AdminGuard'
import ProveedorGuard from './proveedor/ProveedorGuard'
import { ProveedorPublicGuard } from './proveedor/ProveedorGuard'
import ProveedorSessionGuard from './proveedor/ProveedorSessionGuard'

const Home = lazy(() => import('./pages/Home'))
const Empresa = lazy(() => import('./pages/Empresa'))
const Servicios = lazy(() => import('./pages/Servicios'))
const Proyectos = lazy(() => import('./pages/Proyectos'))
const ProyectoDetail = lazy(() => import('./pages/ProyectoDetail'))
const Licitaciones = lazy(() => import('./pages/Licitaciones'))
const LicitacionDetail = lazy(() => import('./pages/LicitacionDetail'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Contacto = lazy(() => import('./pages/Contacto'))
const Privacidad = lazy(() => import('./pages/Privacidad'))
const Terminos = lazy(() => import('./pages/Terminos'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const AdminLogin = lazy(() => import('./admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'))
const AdminProyectos = lazy(() => import('./admin/AdminProyectos'))
const AdminServicios = lazy(() => import('./admin/AdminServicios'))
const AdminBlog = lazy(() => import('./admin/AdminBlog'))
const AdminLicitaciones = lazy(() => import('./admin/AdminLicitaciones'))
const AdminConsultas = lazy(() => import('./admin/AdminConsultas'))
const AdminProveedores = lazy(() => import('./admin/AdminProveedores'))
const ProveedorRegistro = lazy(() => import('./pages/proveedor/ProveedorRegistro'))
const ProveedorLogin = lazy(() => import('./pages/proveedor/ProveedorLogin'))
const ProveedorPendiente = lazy(() => import('./pages/proveedor/ProveedorPendiente'))
const ProveedorCompletarRegistro = lazy(() => import('./pages/proveedor/ProveedorCompletarRegistro'))
const ProveedorLayout = lazy(() => import('./proveedor/ProveedorLayout'))
const ProveedorDashboard = lazy(() => import('./pages/proveedor/ProveedorDashboard'))
const ProveedorLicitaciones = lazy(() => import('./pages/proveedor/ProveedorLicitaciones'))
const ProveedorMisOfertas = lazy(() => import('./pages/proveedor/ProveedorMisOfertas'))
const AdminContacto = lazy(() => import('./admin/AdminContactoPage'))
const AdminInicio = lazy(() => import('./admin/AdminInicioPage'))
const AdminEmpresa = lazy(() => import('./admin/AdminEmpresaPage'))
const AdminMedios = lazy(() => import('./admin/AdminMedios'))
const AdminPaginas = lazy(() => import('./admin/AdminPaginasPage'))

function PageLoader() {
  return (
    <div className="min-h-screen bg-background-50">
      <div className="h-8 bg-primary-950" />
      <div className="h-20 bg-background-50 border-b border-background-200 animate-pulse" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-6">
        <div className="h-4 w-32 bg-background-200 rounded animate-pulse" />
        <div className="h-12 w-2/3 max-w-xl bg-background-200 rounded animate-pulse" />
        <div className="h-5 w-1/2 max-w-md bg-background-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <AdminAuthProvider>
          <ProveedorAuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Lazy><Home /></Lazy>} />
            <Route path="/empresa" element={<Lazy><Empresa /></Lazy>} />
            <Route path="/servicios" element={<Lazy><Servicios /></Lazy>} />
            <Route path="/proyectos" element={<Lazy><Proyectos /></Lazy>} />
            <Route path="/proyectos/:id" element={<Lazy><ProyectoDetail /></Lazy>} />
            <Route path="/licitaciones" element={<Lazy><Licitaciones /></Lazy>} />
            <Route path="/licitaciones/:id" element={<Lazy><LicitacionDetail /></Lazy>} />
            <Route path="/blog" element={<Lazy><Blog /></Lazy>} />
            <Route path="/blog/:id" element={<Lazy><BlogPost /></Lazy>} />
            <Route path="/contacto" element={<Lazy><Contacto /></Lazy>} />
            <Route path="/privacidad" element={<Lazy><Privacidad /></Lazy>} />
            <Route path="/terminos" element={<Lazy><Terminos /></Lazy>} />

            <Route path="/proveedor">
              <Route element={<ProveedorPublicGuard />}>
                <Route path="registro" element={<Lazy><ProveedorRegistro /></Lazy>} />
                <Route path="login" element={<Lazy><ProveedorLogin /></Lazy>} />
              </Route>
              <Route element={<ProveedorSessionGuard />}>
                <Route path="pendiente" element={<Lazy><ProveedorPendiente /></Lazy>} />
                <Route path="completar-registro" element={<Lazy><ProveedorCompletarRegistro /></Lazy>} />
              </Route>
              <Route element={<ProveedorGuard />}>
                <Route element={<Lazy><ProveedorLayout /></Lazy>}>
                  <Route index element={<Lazy><ProveedorDashboard /></Lazy>} />
                  <Route path="licitaciones" element={<Lazy><ProveedorLicitaciones /></Lazy>} />
                  <Route path="mis-ofertas" element={<Lazy><ProveedorMisOfertas /></Lazy>} />
                </Route>
              </Route>
            </Route>

            <Route path="/acceso" element={<Lazy><AdminLogin /></Lazy>} />
            <Route path="/admin/login" element={<Lazy><AdminLogin /></Lazy>} />
            <Route path="/admin" element={<AdminGuard />}>
              <Route element={<Lazy><AdminLayout /></Lazy>}>
                <Route index element={<Lazy><AdminDashboard /></Lazy>} />
                <Route path="proyectos" element={<Lazy><AdminProyectos /></Lazy>} />
                <Route path="servicios" element={<Lazy><AdminServicios /></Lazy>} />
                <Route path="blog" element={<Lazy><AdminBlog /></Lazy>} />
                <Route path="licitaciones" element={<Lazy><AdminLicitaciones /></Lazy>} />
                <Route path="empresa" element={<Lazy><AdminEmpresa /></Lazy>} />
                <Route path="inicio" element={<Lazy><AdminInicio /></Lazy>} />
                <Route path="contacto" element={<Lazy><AdminContacto /></Lazy>} />
                <Route path="paginas" element={<Lazy><AdminPaginas /></Lazy>} />
                <Route path="medios" element={<Lazy><AdminMedios /></Lazy>} />
                <Route path="consultas" element={<Lazy><AdminConsultas /></Lazy>} />
                <Route path="proveedores" element={<Lazy><AdminProveedores /></Lazy>} />
              </Route>
            </Route>

            <Route path="*" element={<Lazy><NotFound /></Lazy>} />
          </Routes>
          </ProveedorAuthProvider>
        </AdminAuthProvider>
      </ContentProvider>
    </BrowserRouter>
  )
}
