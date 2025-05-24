"use client";

import React, { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
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
  FiDownload,
  FiAlertCircle,
  FiExternalLink
} from 'react-icons/fi';
import { consultarDetalleProceso, consultarActuacionesProceso, Proceso, Actuacion } from '@/services/api';

interface ProcesoDetalleProps {
  params: {
    id: string;
  };
}

export default function ProcesoDetallePage() {
  const params = useParams();
  const id = params.id as string;
  const [proceso, setProceso] = useState<Proceso | null>(null);
  const [actuaciones, setActuaciones] = useState<Actuacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const cargarDetalleProceso = async () => {      try {
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
            // No interrumpimos la carga del proceso si las actuaciones fallan
            setActuaciones([]);
          }
        } else {
          // Utilizamos notFound() para manejar el caso donde no se encuentra el proceso
          notFound();
        }
      } catch (err) {
        // Verificamos si es un error 404 para mostrar notFound
        if (err instanceof Error && err.message.includes('404')) {
          notFound();
        } else {
          setError("Error al cargar detalles del proceso: " + (err instanceof Error ? err.message : String(err)));
        }
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
          <p className="mt-4 text-gray-600">Cargando detalles del proceso...</p>
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
            <p className="font-medium">Error al cargar detalles del proceso</p>
            <p className="text-sm">{error || "No se pudo encontrar el proceso solicitado"}</p>
            <Link href="/dashboard/consulta" className="text-red-700 underline text-sm mt-2 inline-block">
              Volver al formulario de consulta
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }
    // Verificar que actuaciones sea un array antes de trabajar con él
  const actuacionesArray = Array.isArray(actuaciones) ? actuaciones : [];
  
  // Ordenar actuaciones por fecha, de la más reciente a la más antigua
  const actuacionesOrdenadas = [...actuacionesArray].sort(
    (a, b) => new Date(b.fechaActuacion).getTime() - new Date(a.fechaActuacion).getTime()
  );
  
  const ultimaActuacion = actuacionesOrdenadas.length > 0 ? actuacionesOrdenadas[0] : null;
  
  // Extraer demandante y demandado de sujetosProcesales
  const extraerPartes = (sujetosProcesales: string) => {
    // Intentamos dividir los sujetos por |
    const partes = sujetosProcesales.split('|').map(parte => parte.trim());
    
    if (partes.length >= 2) {
      const demandante = partes[0].replace(/^Demandante:/i, '').trim();
      const demandado = partes[1].replace(/^Demandado:/i, '').trim();
      return { demandante, demandado };
    }
    
    // Si no podemos dividir claramente, usamos todo como demandante
    return { 
      demandante: sujetosProcesales, 
      demandado: "No especificado" 
    };
  };
  
  const { demandante, demandado } = extraerPartes(proceso.sujetosProcesales || "");
  
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
          <Link href="/dashboard/consulta/resultados" className="mr-4 text-gray-600 hover:text-indigo-600">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Proceso {proceso.llaveProceso}
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
          <button className="bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-1.5 px-3 rounded-md text-sm">
            Guardar
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
                      <FiMap className="mr-1 text-gray-400" /> Despacho
                    </h3>
                    <p className="text-gray-800">{proceso.despacho}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiMap className="mr-1 text-gray-400" /> Departamento
                    </h3>
                    <p className="text-gray-800">{proceso.departamento}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiBriefcase className="mr-1 text-gray-400" /> Llave del Proceso
                    </h3>
                    <p className="text-gray-800">{proceso.llaveProceso}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiTag className="mr-1 text-gray-400" /> Estado
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {proceso.esPrivado ? "Privado" : "Público"}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiCalendar className="mr-1 text-gray-400" /> Fecha Proceso
                    </h3>
                    <p className="text-gray-800">{formatearFecha(proceso.fechaProceso)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiCalendar className="mr-1 text-gray-400" /> Última Actuación
                    </h3>
                    <p className="text-gray-800">{formatearFecha(proceso.fechaUltimaActuacion)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      <FiUser className="mr-1 text-gray-400" /> Sujetos Procesales
                    </h3>
                    <p className="text-gray-800 text-sm">
                      <span className="font-medium">Demandante:</span> {demandante}<br/>
                      <span className="font-medium">Demandado:</span> {demandado}
                    </p>
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
                      {ultimaActuacion.actuacion}
                    </h3>
                    <span className="text-sm text-gray-500">{formatearFecha(ultimaActuacion.fechaActuacion)}</span>
                  </div>
                  {ultimaActuacion.anotacion && (
                    <p className="text-gray-600 mb-4">{ultimaActuacion.anotacion}</p>
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
                  <p className="text-2xl font-semibold text-gray-800">{actuaciones.length}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Última Actualización</h3>
                  <p className="text-gray-800">
                    {formatearFecha(proceso.fechaUltimaActuacion)}
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
                <a 
                  href={`https://consultaprocesos.ramajudicial.gov.co:448/consultaprocesos/ConsultaJusticias21.aspx?NumRadicacion=${proceso.llaveProceso}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <FiExternalLink className="mr-1.5" /> Ver en Rama Judicial
                </a>
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
