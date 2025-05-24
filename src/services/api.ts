// Tipos para la respuesta de la API de consulta de procesos judiciales
export interface ProcesosResponse {
  tipoConsulta: string;
  procesos: Proceso[];
  parametros: Parametros;
  paginacion: Paginacion;
}

export interface Proceso {
  idProceso: number;
  idConexion: number;
  llaveProceso: string;
  fechaProceso: string;
  fechaUltimaActuacion: string;
  despacho: string;
  departamento: string;
  sujetosProcesales: string;
  esPrivado: boolean;
  cantFilas: number;
}

// Tipo para las actuaciones del proceso
export interface Actuacion {
  idRegActuacion: number;
  idActuacion?: number; // Campo usado anteriormente, mantenemos por compatibilidad
  llaveProceso: string;
  consActuacion: number;
  fechaActuacion: string;
  actuacion: string;
  anotacion: string;
  fechaInicial?: string | null;
  fechaFinal?: string | null;
  fechaRegistro: string;
  codRegla?: string;
  conDocumentos: boolean;
  cant?: number;
  documento?: string; // Campo usado anteriormente, mantenemos por compatibilidad
}

export interface Parametros {
  numero: string | null;
  nombre: string | null;
  tipoPersona: string | null;
  idSujeto: string | null;
  ponente: string | null;
  claseProceso: string | null;
  codificacionDespacho: string | null;
  soloActivos: boolean;
}

export interface Paginacion {
  cantidadRegistros: number;
  registrosPagina: number;
  cantidadPaginas: number;
  pagina: number;
  paginas: any;
}

// URL base de la API
const API_BASE_URL = 'https://consultaprocesos.ramajudicial.gov.co:448/api/v2';

/**
 * Consulta procesos por nombre o razón social
 * @param nombre Nombre o razón social a consultar
 * @param tipoPersona Tipo de persona (nat: natural, jur: jurídica)
 * @param soloActivos Filtrar solo procesos activos
 * @param codificacionDespacho Código del despacho
 * @param pagina Número de página
 * @returns Promesa con la respuesta de procesos
 */
export async function consultarProcesosPorNombre(
  nombre: string, 
  tipoPersona: 'nat' | 'jur' = 'jur',
  soloActivos: boolean = true,
  codificacionDespacho: string = '05001',
  pagina: number = 1
): Promise<ProcesosResponse> {
  const url = new URL(`${API_BASE_URL}/Procesos/Consulta/NombreRazonSocial`);
  url.searchParams.append('nombre', nombre);
  url.searchParams.append('tipoPersona', tipoPersona);
  url.searchParams.append('SoloActivos', soloActivos.toString());
  url.searchParams.append('codificacionDespacho', codificacionDespacho);
  url.searchParams.append('pagina', pagina.toString());

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Error al consultar procesos: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Consulta procesos por NIT
 * @param nit Número de NIT a consultar
 * @param soloActivos Filtrar solo procesos activos
 * @param codificacionDespacho Código del despacho
 * @param pagina Número de página
 * @returns Promesa con la respuesta de procesos
 */
export async function consultarProcesosPorNIT(
  nit: string,
  soloActivos: boolean = true,
  codificacionDespacho: string = '05001',
  pagina: number = 1
): Promise<ProcesosResponse> {
  // Para la consulta por NIT, usamos la misma API de nombre pero con el NIT como parámetro
  return consultarProcesosPorNombre(nit, 'jur', soloActivos, codificacionDespacho, pagina);
}

/**
 * Consulta procesos por número de radicado
 * @param numero Número de radicado
 * @param soloActivos Filtrar solo procesos activos
 * @param codificacionDespacho Código del despacho
 * @param pagina Número de página
 * @returns Promesa con la respuesta de procesos
 */
export async function consultarProcesosPorRadicado(
  numero: string,
  soloActivos: boolean = true,
  codificacionDespacho: string = '05001',
  pagina: number = 1
): Promise<ProcesosResponse> {
  const url = new URL(`${API_BASE_URL}/Procesos/Consulta/NumeroRadicacion`);
  url.searchParams.append('numero', numero);
  url.searchParams.append('SoloActivos', soloActivos.toString());
  url.searchParams.append('codificacionDespacho', codificacionDespacho);
  url.searchParams.append('pagina', pagina.toString());

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Error al consultar procesos: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Consulta los detalles de un proceso específico por su ID
 * @param idProceso ID del proceso a consultar
 * @returns Promesa con la respuesta del detalle del proceso
 */
export async function consultarDetalleProceso(
  idProceso: number | string
): Promise<ProcesosResponse> {
  const url = new URL(`${API_BASE_URL}/Proceso/Detalle/${idProceso}`);
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Error al consultar detalle del proceso: ${response.status} ${response.statusText}`);
  }

  // La API devuelve un objeto Proceso directamente, lo envolvemos en un ProcesosResponse
  const proceso = await response.json();
  
  // Creamos una respuesta en formato ProcesosResponse para mantener consistencia
  const procesosResponse: ProcesosResponse = {
    tipoConsulta: "DetalleProceso",
    procesos: [proceso],
    parametros: {
      numero: proceso.llaveProceso,
      nombre: null,
      tipoPersona: null,
      idSujeto: null,
      ponente: null,
      claseProceso: null,
      codificacionDespacho: null,
      soloActivos: false
    },
    paginacion: {
      cantidadRegistros: 1,
      registrosPagina: 1,
      cantidadPaginas: 1,
      pagina: 1,
      paginas: null
    }
  };

  return procesosResponse;
}

/**
 * Consulta las actuaciones de un proceso por su ID
 * @param idProceso ID del proceso a consultar
 * @returns Promesa con las actuaciones del proceso
 */
export async function consultarActuacionesProceso(
  idProceso: number | string
): Promise<Actuacion[]> {
  const url = new URL(`${API_BASE_URL}/Proceso/Actuaciones/${idProceso}`);
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Error al consultar actuaciones: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Aseguramos que siempre devuelva un array
  if (!data) return [];
  return Array.isArray(data) ? data : [];
}

/**
 * Consulta los documentos de una actuación por su ID
 * @param idRegActuacion ID de la actuación para consultar sus documentos
 * @returns Promesa con los documentos de la actuación
 */
export interface Documento {
  idRegDocumento: number;
  idConexion: number;
  consActuacion: number;
  guidDocumento_SXXIW: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  fechaCarga: string;
}

/**
 * Mapea la respuesta de la API a nuestra estructura interna
 * para mantener compatibilidad con el código existente
 */
export interface DocumentoFormateado {
  idRegDocumento: number;
  idRegActuacion: number;
  nombreDocumento: string;
  fechaDocumento: string;
  tipoDocumento: string;
  tamanio: number;
  descripcionOriginal: string;
}

export async function consultarDocumentosActuacion(
  idRegActuacion: number | string
): Promise<DocumentoFormateado[]> {
  const url = new URL(`${API_BASE_URL}/Proceso/DocumentosActuacion/${idRegActuacion}`);
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Error al consultar documentos: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json() as Documento[];
  
  // Aseguramos que siempre devuelva un array
  if (!data) return [];
  
  // Mapear el formato de la API a nuestro formato interno
  return (Array.isArray(data) ? data : []).map(doc => {
    // Extraer tamaño del campo descripción si está disponible
    let tamanio = 0;
    const tamanoMatch = doc.descripcion.match(/tamaño: ([0-9.]+) KB/i);
    if (tamanoMatch && tamanoMatch[1]) {
      tamanio = parseFloat(tamanoMatch[1]) * 1024; // Convertir KB a bytes
    }
    
    return {
      idRegDocumento: doc.idRegDocumento,
      idRegActuacion: doc.consActuacion,
      nombreDocumento: doc.nombre,
      fechaDocumento: doc.fechaCarga,
      tipoDocumento: doc.tipo,
      tamanio: tamanio,
      descripcionOriginal: doc.descripcion
    };
  });
}

/**
 * Genera la URL para descargar un documento
 * @param idRegDocumento ID del documento a descargar
 * @returns URL para descargar el documento
 */
export function obtenerUrlDescargaDocumento(idRegDocumento: number | string): string {
  return `${API_BASE_URL}/Descarga/Documento/${idRegDocumento}`;
}

/**
 * Referencias de URLs de API:
 * https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Proceso/Detalle/198167821
 * https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Proceso/Actuaciones/198167821
 * https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Proceso/DocumentosActuacion/1715845581
 * https://consultaprocesos.ramajudicial.gov.co:448/api/v2/Descarga/Documento/789551141
 */