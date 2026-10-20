// Datos iniciales deterministas para la demostración.
// Sin valores aleatorios: identificadores y fechas fijas en el código.

import { STORAGE_KEY } from './constants'

export const SEED_REQUESTS = [
  {
    id: 'req-001',
    title: 'Revisión de cuenta corporativa',
    description:
      'Solicito la revisión de los datos de mi cuenta corporativa porque el nombre del departamento aparece incorrecto en las facturas.',
    category: 'Facturación',
    priority: 'Media',
    status: 'Pendiente',
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-01-05T09:00:00.000Z',
  },
  {
    id: 'req-002',
    title: 'Error al iniciar sesión',
    description:
      'Desde la última actualización la aplicación muestra un error al iniciar sesión con usuario corporativo. Adjunto los pasos para reproducirlo.',
    category: 'Técnico',
    priority: 'Alta',
    status: 'En progreso',
    createdAt: '2026-01-06T10:30:00.000Z',
    updatedAt: '2026-01-08T14:15:00.000Z',
  },
  {
    id: 'req-003',
    title: 'Solicito acceso al repositorio',
    description:
      'Necesito acceso de lectura al repositorio del equipo de datos para consultar la documentación técnica del proyecto de integración.',
    category: 'Acceso',
    priority: 'Baja',
    status: 'Pendiente',
    createdAt: '2026-01-07T08:45:00.000Z',
    updatedAt: '2026-01-07T08:45:00.000Z',
  },
  {
    id: 'req-004',
    title: 'Consulta sobre factura de enero',
    description:
      'Quisiera una copia detallada de la factura de enero porque faltan por desglosar dos líneas de servicios contratados el 12 del mes.',
    category: 'Facturación',
    priority: 'Media',
    status: 'Completada',
    createdAt: '2026-01-10T11:20:00.000Z',
    updatedAt: '2026-01-12T16:40:00.000Z',
  },
  {
    id: 'req-005',
    title: 'Duda general sobre horarios',
    description:
      'Me gustaría conocer el horario de atención durante los días festivos del primer trimestre para planificar las consultas del equipo.',
    category: 'General',
    priority: 'Baja',
    status: 'Completada',
    createdAt: '2026-01-09T15:10:00.000Z',
    updatedAt: '2026-01-10T09:05:00.000Z',
  },
]

// Colección nueva cada vez que se ejecuta, para que el restablecimiento
// sea idempotente y no comparta referencias con el estado en memoria.
export function buildSeedRequests() {
  return SEED_REQUESTS.map((request) => ({ ...request }))
}

export { STORAGE_KEY }
