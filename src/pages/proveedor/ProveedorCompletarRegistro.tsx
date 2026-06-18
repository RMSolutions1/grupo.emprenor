import { useProveedorAuth } from '../../proveedor/ProveedorAuthContext'
import ProveedorRegistroForm from './ProveedorRegistroForm'

export default function ProveedorCompletarRegistro() {
  const { user } = useProveedorAuth()
  return <ProveedorRegistroForm mode="complete" defaultEmail={user?.email ?? ''} />
}
