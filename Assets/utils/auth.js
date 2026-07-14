import { permisos } from "../data/permisos";

export function getUsuarioActual() {
  const data = localStorage.getItem("usuarioActual");
  return data ? JSON.parse(data) : null;
}

export function tienePermiso(usuario, accion) {
  if (!usuario || !usuario.rol) return false;
  return permisos[usuario.rol]?.includes(accion) ?? false;
}