"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiFilter, FiDownload, FiChevronRight, FiClock, FiFileText, FiAlertCircle } from "react-icons/fi";
import { consultarProcesosPorNombre, consultarProcesosPorRadicado, Proceso, ProcesosResponse } from "@/services/api";

// Changed to default export for better compatibility
export default function ResultadosConsulta() {
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo") || "nombreRazonSocial";
  const termino = searchParams.get("termino") || "";
  const tipoPersona = searchParams.get("tipoPersona") || "jur";
  const codificacionDespacho = searchParams.get("codificacionDespacho") || "05001";
  
  // Keep the rest of the component unchanged
  const [pagina, setPagina] = useState(1);
  const [resultados, setResultados] = useState<ProcesosResponse | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("fecha_desc");
  
  useEffect(() => {
    const buscarProcesos = async () => {
      if (!termino) {
        setError("No se proporcionó un término de búsqueda");
        setCargando(false);
        return;
      }
      
      try {
        setCargando(true);
        let respuesta;
        
        if (tipo === "nombreRazonSocial") {
          respuesta = await consultarProcesosPorNombre(termino, tipoPersona, pagina);
        } else {
          respuesta = await consultarProcesosPorRadicado(termino, pagina);
        }
        
        setResultados(respuesta);
      } catch (err) {
        setError("Error al buscar procesos: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setCargando(false);
      }
    };
    
    buscarProcesos();
  }, [termino, tipo, tipoPersona, pagina]);
  
  // Function to render process status
  const renderEstadoProceso = (fechaUltimaActuacion: string) => {
    try {
      const fechaActuacion = new Date(fechaUltimaActuacion);
      const hoy = new Date();
      const diferenciaDias = Math.floor((hoy.getTime() - fechaActuacion.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diferenciaDias <= 30) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
            Activo
          </span>
        );
      } else if (diferenciaDias <= 90) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <span className="w-1.5 h-1.5 mr-1.5 bg-yellow-500 rounded-full"></span>
            Seguimiento
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <span className="w-1.5 h-1.5 mr-1.5 bg-gray-500 rounded-full"></span>
            Inactivo
          </span>
        );
      }
    } catch (e) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Desconocido
        </span>
      );
    }
  };
  
  // Function to format dates
  const formatearFecha = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return fechaStr || "No disponible";
    }
  };
  
  // Function to get time ago from date
  const tiempoDesde = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);
      const ahora = new Date();
      const diferencia = ahora.getTime() - fecha.getTime();
      
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const meses = Math.floor(dias / 30);
      const años = Math.floor(dias / 365);
      
      if (años > 0) {
        return `${años} año${años > 1 ? 's' : ''}`;
      } else if (meses > 0) {
        return `${meses} mes${meses > 1 ? 'es' : ''}`;
      } else if (dias > 0) {
        return `${dias} día${dias > 1 ? 's' : ''}`;
      } else {
        return "hoy";
      }
    } catch (e) {
      return "fecha desconocida";
    }
  };
  
  // Handle sorting
  const procesos = resultados?.procesos || [];
  const sortedProcesos = [...procesos].sort((a, b) => {
    if (ordenarPor === "fecha_desc") {
      return new Date(b.fechaUltimaActuacion).getTime() - new Date(a.fechaUltimaActuacion).getTime();
    } else if (ordenarPor === "fecha_asc") {
      return new Date(a.fechaUltimaActuacion).getTime() - new Date(b.fechaUltimaActuacion).getTime();
    }
    return 0;
  });
  
  // UI for loading state
  if (cargando) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Buscando procesos...</p>
      </div>
    );
  }
  
  // UI for error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
        <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Error en la consulta</p>
          <p className="text-sm">{error}</p>
          <Link href="/dashboard/consulta" className="text-red-700 underline text-sm mt-2 inline-block">
            Volver al formulario de consulta
          </Link>
        </div>
      </div>
    );
  }
  
  // UI for no results
  if (resultados && (!resultados.procesos || resultados.procesos.length === 0)) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <FiAlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>No se encontraron procesos que coincidan con los criterios de búsqueda.</p>
          </div>
          <div className="mt-6">
            <Link href="/dashboard/consulta" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Volver a consultar
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Main UI
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Resultados de la búsqueda
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Se encontraron {resultados?.paginacion.total} procesos para "{termino}"
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="fecha_desc">Más recientes primero</option>
              <option value="fecha_asc">Más antiguos primero</option>
            </select>
          </div>
          
          <Link href="/dashboard/consulta" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Nueva consulta
          </Link>
        </div>
      </div>
      
      {/* Lista de procesos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {sortedProcesos.map((proceso) => (
            <li key={proceso.idProceso}>
              <Link href={`/dashboard/proceso/${proceso.idProceso}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-indigo-600 truncate">{proceso.llaveProceso}</p>
                      </div>
                      <div className="mt-1">
                        <p className="line-clamp-1 text-sm text-gray-900">
                          {proceso.sujetosProcesales}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      {renderEstadoProceso(proceso.fechaUltimaActuacion)}
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <FiFileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {proceso.despacho}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>
                        Última actuación <span className="font-medium">{tiempoDesde(proceso.fechaUltimaActuacion)}</span> atrás
                      </p>
                      <FiChevronRight className="flex-shrink-0 ml-2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Paginación */}
        {resultados?.paginacion && resultados.paginacion.total > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagina(Math.max(1, pagina - 1))}
                disabled={pagina === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${pagina === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                Anterior
              </button>
              <button
                onClick={() => setPagina(pagina + 1)}
                disabled={!resultados.paginacion.hayMasPaginas}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${!resultados.paginacion.hayMasPaginas ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{(pagina - 1) * 10 + 1}</span> a <span className="font-medium">{Math.min(pagina * 10, resultados.paginacion.total)}</span> de <span className="font-medium">{resultados.paginacion.total}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagina(Math.max(1, pagina - 1))}
                    disabled={pagina === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${pagina === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Anterior</span>
                    &larr;
                  </button>
                  
                  {Array.from({ length: Math.min(5, Math.ceil(resultados.paginacion.total / 10)) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPagina(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border ${pageNumber === pagina ? 'bg-indigo-50 border-indigo-500 text-indigo-600 z-10' : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'} text-sm font-medium`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  {resultados.paginacion.total > 50 && (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                  )}
                  
                  <button
                    onClick={() => setPagina(pagina + 1)}
                    disabled={!resultados.paginacion.hayMasPaginas}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${!resultados.paginacion.hayMasPaginas ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Siguiente</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Named export for compatibility with current imports
export { ResultadosConsulta };
