"use client";

import React, { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiFileText, 
  FiDownload,
  FiAlertCircle,
  FiExternalLink,
  FiSearch,
  FiFile,
  FiFilter
} from 'react-icons/fi';
import { consultarDetalleProceso, consultarActuacionesProceso, consultarDocumentosActuacion, obtenerUrlDescargaDocumento, Proceso, Actuacion, DocumentoFormateado } from '@/services/api';

interface DocumentosPageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function DocumentosPage() {
  const params = useParams();
  const id = params.id as string;
  // Get searchParams
  const searchParams = new URLSearchParams(window.location.search);
  const idActuacion = searchParams.get('idActuacion');
  
  const [proceso, setProceso] = useState<Proceso | null>(null);
  const [actuaciones, setActuaciones] = useState<Actuacion[]>([]);
  const [documentos, setDocumentos] = useState<DocumentoFormateado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroActuacion, setFiltroActuacion] = useState<string | null>(idActuacion);
  
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const respuesta = await consultarDetalleProceso(id);
        
        if (respuesta.procesos && respuesta.procesos.length > 0) {
          setProceso(respuesta.procesos[0]);
            // Cargar actuaciones
          try {
            const actuacionesData = await consultarActuacionesProceso(id);
            setActuaciones(actuacionesData);
              // Cargamos documentos para cada actuación
            const todosDocumentos: DocumentoFormateado[] = [];
            
            // Creamos un array de promesas para cargar los documentos
            const promesasDocumentos = actuacionesData.map(async (actuacion) => {
              try {
                // Usamos el idRegActuacion para consultar documentos correctamente
                const docsActuacion = await consultarDocumentosActuacion(actuacion.idRegActuacion);
                return docsActuacion;
              } catch (err) {
                console.error(`Error al cargar documentos de la actuación ${actuacion.idRegActuacion}:`, err);
                return [];
              }
            });
            
            // Esperamos a que todas las promesas se resuelvan
            const resultadosDocumentos = await Promise.all(promesasDocumentos);
            
            // Combinamos todos los documentos en un solo array
            resultadosDocumentos.forEach(docs => {
              if (Array.isArray(docs)) {
                todosDocumentos.push(...docs);
              }
            });
            
            setDocumentos(todosDocumentos);
          } catch (err) {
            console.error("Error al cargar actuaciones:", err);
            setActuaciones([]);
          }
        } else {
          notFound();
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes('404')) {
          notFound();
        } else {
          setError("Error al cargar detalles del proceso: " + (err instanceof Error ? err.message : String(err)));
        }
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
  }, [id]);
  
  if (cargando) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando documentos del proceso...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !proceso) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error al cargar documentos</p>
            <p className="text-sm">{error || "No se pudo encontrar el proceso solicitado"}</p>
            <Link href="/dashboard/consulta" className="text-red-700 underline text-sm mt-2 inline-block">
              Volver al formulario de consulta
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }
    // Verificamos que documentos sea un array
  const documentosArray = Array.isArray(documentos) ? documentos : [];
    // Aplicamos múltiples filtros si es necesario
  let documentosFiltrados = documentosArray;
    // Primero filtramos por actuación si existe el filtro
  if (filtroActuacion) {
    documentosFiltrados = documentosFiltrados.filter(
      doc => doc.idRegActuacion === parseInt(filtroActuacion)
    );
  }
  
  // Luego filtramos por texto si existe un valor
  if (filtroTexto) {
    documentosFiltrados = documentosFiltrados.filter(
      doc => doc.nombreDocumento.toLowerCase().includes(filtroTexto.toLowerCase()) || 
             (doc.tipoDocumento && doc.tipoDocumento.toLowerCase().includes(filtroTexto.toLowerCase()))
    );
  }
  
  // Ordenar por fecha más reciente
  const documentosOrdenados = [...documentosFiltrados].sort(
    (a, b) => new Date(b.fechaDocumento).getTime() - new Date(a.fechaDocumento).getTime()
  );
  
  // Función para formatear tamaño de archivo
  const formatearTamano = (tamanoBytes: number) => {
    if (tamanoBytes < 1024) return `${tamanoBytes} bytes`;
    if (tamanoBytes < 1024 * 1024) return `${(tamanoBytes / 1024).toFixed(1)} KB`;
    return `${(tamanoBytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Formatear fecha
  const formatearFecha = (fechaString: string) => {
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-CO', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (e) {
      return fechaString || "No disponible";
    }
  };  // Obtener la actuación para un documento
  const obtenerActuacion = (documento: DocumentoFormateado) => {
    const actuacion = actuaciones.find(act => act.idRegActuacion === documento.idRegActuacion);
    return actuacion ? actuacion.actuacion : "No disponible";
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/dashboard/proceso/${id}`} className="mr-4 text-gray-600 hover:text-indigo-600">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Documentos del Proceso {proceso.llaveProceso}
            </h1>
            <p className="text-gray-600">{proceso.despacho}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <a 
            href={`https://consultaprocesos.ramajudicial.gov.co:448/consultaprocesos/ConsultaJusticias21.aspx?NumRadicacion=${proceso.llaveProceso}`}
            target="_blank"
            rel="noopener noreferrer" 
            className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 font-medium py-1.5 px-3 rounded-md text-sm flex items-center"
          >
            <FiExternalLink className="mr-1.5" /> Ver en Rama Judicial
          </a>
        </div>
      </div>
      
      {/* Barra de pestañas */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex -mb-px">
          <li className="mr-1">
            <Link 
              href={`/dashboard/proceso/${id}`}
              className="inline-block py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 rounded-t-lg"
            >
              Información General
            </Link>
          </li>
          <li className="mr-1">
            <Link 
              href={`/dashboard/proceso/${id}/actuaciones`}
              className="inline-block py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 rounded-t-lg"
            >
              Actuaciones
            </Link>
          </li>
          <li className="mr-1">
            <Link 
              href={`/dashboard/proceso/${id}/documentos`}
              className="inline-block py-3 px-4 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600 rounded-t-lg active"
              aria-current="page"
            >
              Documentos
            </Link>
          </li>

        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Listado de documentos */}
        <div className="md:col-span-2">          {/* Barra de búsqueda y filtros */}
          <div className="mb-6 bg-white rounded-lg shadow">
            <div className="p-4">
              {/* Filtro de actuación activo */}
              {filtroActuacion && (
                <div className="mb-3 flex items-center">
                  <div className="bg-indigo-100 text-indigo-800 text-sm py-1 px-3 rounded-full flex items-center">
                    <FiFilter className="mr-1.5" />                    <span>
                      {actuaciones.find(a => a.idRegActuacion === parseInt(filtroActuacion))?.actuacion || 'Actuación seleccionada'}
                    </span>
                    <button 
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                      onClick={() => setFiltroActuacion(null)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              
              {/* Campo de búsqueda */}
              <div className="flex">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                    placeholder="Buscar en los documentos..."
                    value={filtroTexto}
                    onChange={(e) => setFiltroTexto(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {documentosOrdenados.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">
                {documentosArray.length > 0 
                  ? "No se encontraron documentos que coincidan con la búsqueda." 
                  : "No hay documentos disponibles para este proceso."
                }
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-800 flex items-center">
                  <FiFileText className="mr-2" /> Documentos disponibles ({documentosOrdenados.length})
                </h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documento
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actuación
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tamaño
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documentosOrdenados.map((documento) => (
                      <tr key={documento.idRegDocumento} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiFile className="mr-2 text-gray-400" />
                            <div className="text-sm font-medium text-gray-900">
                              {documento.nombreDocumento}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {documento.tipoDocumento || "Sin tipo definido"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {obtenerActuacion(documento)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatearFecha(documento.fechaDocumento)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {documento.tamanio ? formatearTamano(documento.tamanio) : "Desconocido"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">                          <a 
                            href={obtenerUrlDescargaDocumento(documento.idRegDocumento)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end"
                            download={documento.nombreDocumento}
                          >
                            <FiDownload className="mr-1" /> Descargar
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        {/* Panel lateral */}
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Resumen</h2>
            </div>
            
            <div className="p-6">              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Documentos</h3>
                  <p className="text-2xl font-semibold text-gray-800">
                    {documentosArray.length}
                    {filtroActuacion && documentosArray.length > 0 && (
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        ({documentosFiltrados.length} filtrados)
                      </span>
                    )}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Actuaciones con Documentos</h3>
                  <p className="text-gray-800">
                    {new Set(documentosArray.map(doc => doc.idRegActuacion)).size}
                  </p>
                </div>
                
                {filtroActuacion ? (
                  <div className="border-t pt-4">
                    <button
                      onClick={() => setFiltroActuacion(null)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
                    >
                      Ver todos los documentos
                    </button>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <Link 
                      href={`/dashboard/proceso/${id}/actuaciones`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
                    >
                      Ver todas las actuaciones
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
