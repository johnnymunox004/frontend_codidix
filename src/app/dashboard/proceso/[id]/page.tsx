"use client";

import { notFound } from 'next/navigation';
import { buscarProcesoPorId } from '@/data/mockData';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiFileText, 
  FiClock, 
  FiUser,
  FiCalendar,
  FiMap,
  FiBriefcase,
  FiTag,
  FiDownload
} from 'react-icons/fi';

interface ProcesoDetalleProps {
  params: {
    id: string;
  };
}

export default function ProcesoDetallePage({ params }: ProcesoDetalleProps) {
  const { id } = params;
  const proceso = buscarProcesoPorId(id);
  
  if (!proceso) {
    notFound();
  }
  
  // Ordenar actuaciones por fecha, de la más reciente a la más antigua
  const actuacionesOrdenadas = [...proceso.actuaciones].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
  
  const ultimaActuacion = actuacionesOrdenadas[0];
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard/consulta/resultados" className="mr-4 text-gray-600 hover:text-indigo-600">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Proceso {proceso.radicado}
            </h1>
            <p className="text-gray-600">{proceso.juzgado}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 font-medium py-1.5 px-3 rounded-md text-sm flex items-center">
            <FiDownload className="mr-1.5" /> Descargar
          </button>
          <button className="bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-1.5 px-3 rounded-md text-sm">
            Editar
          </button>
        </div>
      </div>
      
      {/* Barra de pestañas */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex -mb-px">
          <li className="mr-1">
            <Link 
              href={`/dashboard/proceso/${id}`}
              className="inline-block py-3 px-4 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600 rounded-t-lg active"
              aria-current="page"
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
        {/* Información principal */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiFileText className="mr-2" /> Información del Proceso
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiMap className="mr-1 text-gray-400" /> Juzgado
                    </h3>
                    <p className="text-gray-800">{proceso.juzgado}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiBriefcase className="mr-1 text-gray-400" /> Tipo de Proceso
                    </h3>
                    <p className="text-gray-800">{proceso.tipo}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiTag className="mr-1 text-gray-400" /> Estado
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {proceso.estado}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiCalendar className="mr-1 text-gray-400" /> Fecha Inicio
                    </h3>
                    <p className="text-gray-800">{proceso.fechaInicio}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiUser className="mr-1 text-gray-400" /> Demandante
                    </h3>
                    <p className="text-gray-800">{proceso.partes.demandante}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiUser className="mr-1 text-gray-400" /> Demandado
                    </h3>
                    <p className="text-gray-800">{proceso.partes.demandado}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Última actuación */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiClock className="mr-2" /> Última Actuación
              </h2>
            </div>
            
            <div className="p-6">
              {ultimaActuacion ? (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">
                      {ultimaActuacion.descripcion}
                    </h3>
                    <span className="text-sm text-gray-500">{ultimaActuacion.fecha}</span>
                  </div>
                  {ultimaActuacion.resumen && (
                    <p className="text-gray-600 mb-4">{ultimaActuacion.resumen}</p>
                  )}
                  {ultimaActuacion.documento && (
                    <div className="mt-2">
                      <Link 
                        href={ultimaActuacion.documento} 
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                      >
                        <FiDownload className="mr-1" /> Descargar documento
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No hay actuaciones registradas para este proceso.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Panel lateral */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Resumen</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Actuaciones</h3>
                  <p className="text-2xl font-semibold text-gray-800">{proceso.actuaciones.length}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Última Actualización</h3>
                  <p className="text-gray-800">
                    {ultimaActuacion ? ultimaActuacion.fecha : 'N/A'}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <Link 
                    href={`/dashboard/proceso/${id}/actuaciones`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
                  >
                    Ver todas las actuaciones <FiArrowLeft className="ml-1 transform rotate-180 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-6">
            <h2 className="text-indigo-800 font-medium mb-2">Acciones Rápidas</h2>
            <ul className="space-y-2">
              <li>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                  Agregar nueva actuación
                </button>
              </li>
              <li>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                  Subir documento
                </button>
              </li>
              <li>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                  Agregar nota
                </button>
              </li>
              <li>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                  Marcar alerta
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
