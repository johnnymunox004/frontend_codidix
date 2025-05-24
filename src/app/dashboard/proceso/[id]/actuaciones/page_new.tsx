"use client";

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiFileText, 
  FiClock, 
  FiDownload,
  FiAlertCircle,
  FiPlus,
  FiExternalLink,
  FiSearch,
  FiCalendar
} from 'react-icons/fi';
import { consultarDetalleProceso, consultarActuacionesProceso, Proceso } from '@/services/api';

// Tipo para las actuaciones del proceso
interface Actuacion {
  idActuacion: number;
  idProceso: number;
  fechaActuacion: string;
  actuacion: string;
  anotacion: string;
  fechaRegistro: string;
  documento?: string;
}

interface ActuacionesPageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ActuacionesPage({ params }: ActuacionesPageProps) {
  const { id } = params;
  const [proceso, setProceso] = useState<Proceso | null>(null);
  const [actuaciones, setActuaciones] = useState<Actuacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");
  
  useEffect(() => {
    const cargarDetalleProceso = async () => {
      try {
        setCargando(true);
        const respuesta = await consultarDetalleProceso(id);
        
        if (respuesta.procesos && respuesta.procesos.length > 0) {
          setProceso(respuesta.procesos[0]);
          
          // Cargar actuaciones
          try {
            const actuacionesData = await consultarActuacionesProceso(id);
            setActuaciones(actuacionesData);
          } catch (err) {
            console.error("Error al cargar actuaciones:", err);
            setActuaciones([]);
          }
        } else {
          setError("No se encontró información del proceso");
        }
      } catch (err) {
        setError("Error al cargar detalles del proceso: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setCargando(false);
      }
    };
    
    cargarDetalleProceso();
  }, [id]);
  
  if (cargando) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando actuaciones del proceso...</p>
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
            <p className="font-medium">Error al cargar actuaciones</p>
            <p className="text-sm">{error || "No se pudo encontrar el proceso solicitado"}</p>
            <Link href="/dashboard/consulta" className="text-red-700 underline text-sm mt-2 inline-block">
              Volver al formulario de consulta
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Ordenar actuaciones por fecha, de la más reciente a la más antigua
  const actuacionesOrdenadas = [...actuaciones].sort(
    (a, b) => new Date(b.fechaActuacion).getTime() - new Date(a.fechaActuacion).getTime()
  );
  
  // Filtrar actuaciones por texto
  const actuacionesFiltradas = filtroTexto ? 
    actuacionesOrdenadas.filter(
      act => act.actuacion.toLowerCase().includes(filtroTexto.toLowerCase()) || 
             act.anotacion.toLowerCase().includes(filtroTexto.toLowerCase())
    ) : 
    actuacionesOrdenadas;
  
  // Agrupar actuaciones por año/mes
  const actuacionesPorFecha: Record<string, Actuacion[]> = {};
  actuacionesFiltradas.forEach(actuacion => {
    const fecha = new Date(actuacion.fechaActuacion);
    const yearMonth = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!actuacionesPorFecha[yearMonth]) {
      actuacionesPorFecha[yearMonth] = [];
    }
    actuacionesPorFecha[yearMonth].push(actuacion);
  });
  
  // Formatear el nombre del mes
  const getNombreMes = (yearMonth: string) => {
    const [year, month] = yearMonth.split('-');
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${meses[parseInt(month) - 1]} ${year}`;
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
              Actuaciones del Proceso {proceso.llaveProceso}
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
              className="inline-block py-3 px-4 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600 rounded-t-lg active"
              aria-current="page"
            >
              Actuaciones
            </Link>
          </li>
          <li className="mr-1">
            <Link 
              href={`/dashboard/proceso/${id}/documentos`}
              className="inline-block py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 rounded-t-lg"
            >
              Documentos
            </Link>
          </li>
  
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Listado de actuaciones */}
        <div className="md:col-span-2">
          {/* Barra de búsqueda */}
          <div className="mb-6 bg-white rounded-lg shadow">
            <div className="p-4 flex">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiSearch className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                  placeholder="Buscar en las actuaciones..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {actuacionesFiltradas.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">
                {actuaciones.length > 0 
                  ? "No se encontraron actuaciones que coincidan con la búsqueda." 
                  : "No hay actuaciones registradas para este proceso."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.keys(actuacionesPorFecha).sort().reverse().map((yearMonth) => (
                <div key={yearMonth} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-800 flex items-center">
                      <FiCalendar className="mr-2" /> {getNombreMes(yearMonth)}
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {actuacionesPorFecha[yearMonth].map((actuacion) => (
                      <div key={actuacion.idActuacion} className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-800">
                            {actuacion.actuacion}
                          </h3>
                          <span className="text-sm text-gray-500">{formatearFecha(actuacion.fechaActuacion)}</span>
                        </div>
                        
                        {actuacion.anotacion && (
                          <p className="text-gray-600 mb-4 mt-2">{actuacion.anotacion}</p>
                        )}
                        
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Registrado el {formatearFecha(actuacion.fechaRegistro)}
                          </span>
                          
                          {/* Acciones */}
                          <div className="flex space-x-2">
                            {actuacion.documento && (
                              <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                                <FiDownload className="mr-1" /> Documento
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Panel lateral */}
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Resumen</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Actuaciones</h3>
                  <p className="text-2xl font-semibold text-gray-800">{actuaciones.length}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Última Actualización</h3>
                  <p className="text-gray-800">
                    {proceso.fechaUltimaActuacion ? formatearFecha(proceso.fechaUltimaActuacion) : 'N/A'}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <a 
                    href={`https://consultaprocesos.ramajudicial.gov.co:448/consultaprocesos/ConsultaJusticias21.aspx?NumRadicacion=${proceso.llaveProceso}`}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
                  >
                    <FiExternalLink className="mr-1.5" /> Ver en Rama Judicial
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
