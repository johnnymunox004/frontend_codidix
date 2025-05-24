"use client";

import { notFound } from 'next/navigation';
import { buscarProcesoPorId } from '@/data/mockData';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiFileText, 
  FiClock, 
  FiDownload,
  FiAlertCircle,
  FiPlus
} from 'react-icons/fi';

interface ActuacionesPageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ActuacionesPage({ params }: ActuacionesPageProps) {
  const { id } = params;
  const proceso = buscarProcesoPorId(id);
  
  if (!proceso) {
    notFound();
  }
  
  // Ordenar actuaciones por fecha, de la más reciente a la más antigua
  const actuacionesOrdenadas = [...proceso.actuaciones].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
  
  // Agrupar actuaciones por año/mes
  const actuacionesPorFecha: Record<string, typeof actuacionesOrdenadas> = {};
  actuacionesOrdenadas.forEach(actuacion => {
    const fecha = new Date(actuacion.fecha);
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
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/dashboard/proceso/${id}`} className="mr-4 text-gray-600 hover:text-indigo-600">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Actuaciones del Proceso {proceso.radicado}
            </h1>
            <p className="text-gray-600">{proceso.juzgado}</p>
          </div>
        </div>
        
        <button className="bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-1.5 px-3 rounded-md text-sm flex items-center">
          <FiPlus className="mr-1.5" /> Agregar Actuación
        </button>
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
          <li className="mr-1">
            <Link 
              href={`/dashboard/proceso/${id}/notas`}
              className="inline-block py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 rounded-t-lg"
            >
              Notas
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de actuaciones */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiClock className="mr-2" /> Línea de Tiempo de Actuaciones
              </h2>
              <div className="flex items-center space-x-2">                <select 
                  defaultValue="todos"
                  className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="todos">Todas las actuaciones</option>
                  <option value="importantes">Actuaciones importantes</option>
                  <option value="audiencias">Audiencias</option>
                </select>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {Object.entries(actuacionesPorFecha).map(([yearMonth, actuaciones]) => (
                <div key={yearMonth} className="p-6">
                  <h3 className="font-medium text-gray-500 mb-4">{getNombreMes(yearMonth)}</h3>
                  <div className="space-y-6">
                    {actuaciones.map((actuacion) => (
                      <div key={actuacion.id} className="relative pl-8">
                        <div className="absolute top-1 left-0 rounded-full bg-indigo-100 p-1">
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        </div>
                        
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-800 flex items-center">
                              {actuacion.urgencia === 'alta' && (
                                <FiAlertCircle className="text-red-500 mr-1.5" title="Urgente" />
                              )}
                              {actuacion.descripcion}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {new Date(actuacion.fecha).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </span>
                          </div>
                          
                          {actuacion.resumen && (
                            <p className="text-gray-600 mb-3">{actuacion.resumen}</p>
                          )}
                          
                          {actuacion.documento && (
                            <div className="mt-3">
                              <Link 
                                href={actuacion.documento} 
                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                              >
                                <FiDownload className="mr-1" /> Descargar documento
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Panel lateral */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Clasificación</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-700">Actuaciones por Urgencia</h3>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-red-600">Alta</span>
                        <span className="text-xs text-gray-500">
                          {proceso.actuaciones.filter(a => a.urgencia === 'alta').length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-red-500 h-1.5 rounded-full" 
                          style={{ 
                            width: `${(proceso.actuaciones.filter(a => a.urgencia === 'alta').length / proceso.actuaciones.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-yellow-600">Media</span>
                        <span className="text-xs text-gray-500">
                          {proceso.actuaciones.filter(a => a.urgencia === 'media').length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-yellow-500 h-1.5 rounded-full" 
                          style={{ 
                            width: `${(proceso.actuaciones.filter(a => a.urgencia === 'media').length / proceso.actuaciones.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-green-600">Baja</span>
                        <span className="text-xs text-gray-500">
                          {proceso.actuaciones.filter(a => a.urgencia === 'baja').length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ 
                            width: `${(proceso.actuaciones.filter(a => a.urgencia === 'baja').length / proceso.actuaciones.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Documentos Disponibles</h3>
                  <p className="text-xl font-semibold text-gray-800">
                    {proceso.actuaciones.filter(a => a.documento).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-6">
            <h2 className="text-indigo-800 font-medium mb-2">Acciones</h2>
            <ul className="space-y-2">
              <li>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                  <FiPlus className="mr-1.5" /> Agregar nueva actuación
                </button>
              </li>
              <li>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                  <FiFileText className="mr-1.5" /> Generar informe de actuaciones
                </button>
              </li>
              <li>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                  <FiDownload className="mr-1.5" /> Exportar actuaciones
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
