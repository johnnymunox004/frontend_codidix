"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { FiFilter, FiDownload, FiChevronRight, FiClock, FiFileText, FiAlertCircle } from "react-icons/fi";
import { consultarProcesosPorNombre, consultarProcesosPorRadicado, Proceso, ProcesosResponse } from "@/services/api";

export default function ResultadosConsultaPage() {
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo") || "nombreRazonSocial";
  const termino = searchParams.get("termino") || "";
  const tipoPersona = searchParams.get("tipoPersona") || "jur";
  const codificacionDespacho = searchParams.get("codificacionDespacho") || "05001";
  
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
        setError("");
        
        let response;
        if (tipo === "nombreRazonSocial") {
          response = await consultarProcesosPorNombre(
            termino, 
            tipoPersona as 'nat' | 'jur', 
            true, 
            codificacionDespacho, 
            pagina
          );
        } else {
          response = await consultarProcesosPorRadicado(
            termino, 
            true, 
            codificacionDespacho, 
            pagina
          );
        }
        
        setResultados(response);
      } catch (err) {
        setError("Error al consultar los procesos: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setCargando(false);
      }
    };
    
    buscarProcesos();
  }, [tipo, termino, tipoPersona, codificacionDespacho, pagina]);
  
  // Función para ordenar procesos
  const procesosProcesados = () => {
    if (!resultados || !resultados.procesos) return [];
    
    const procesos = [...resultados.procesos];
    
    switch (ordenarPor) {
      case "fecha_desc":
        return procesos.sort((a, b) => new Date(b.fechaUltimaActuacion).getTime() - new Date(a.fechaUltimaActuacion).getTime());
      case "fecha_asc":
        return procesos.sort((a, b) => new Date(a.fechaUltimaActuacion).getTime() - new Date(b.fechaUltimaActuacion).getTime());
      case "radicado":
        return procesos.sort((a, b) => a.llaveProceso.localeCompare(b.llaveProceso));
      default:
        return procesos;
    }
  };
  
  // Navegar a página
  const irAPagina = (nuevaPagina: number) => {
    if (nuevaPagina < 1 || (resultados && nuevaPagina > resultados.paginacion.cantidadPaginas)) {
      return;
    }
    setPagina(nuevaPagina);
  };
  
  // Extraer tipo de proceso de los sujetos procesales
  const extraerTipoProceso = (sujetos: string): string => {
    // Lógica simple: si contiene la palabra "demandante" o "demandado", es un juicio
    // Esta lógica puede ser mejorada para detectar tipos específicos de procesos
    if (sujetos.toLowerCase().includes("demandante") || sujetos.toLowerCase().includes("demandado")) {
      return "Proceso Judicial";
    }
    return "Otro";
  };
  
  // Extraer demandante y demandado de los sujetos procesales
  const extraerPartes = (sujetos: string) => {
    const partes: { demandante: string, demandado: string } = { demandante: "", demandado: "" };
    
    if (!sujetos) return partes;
    
    const demandanteMatch = sujetos.match(/Demandante[^:]*:\s*([^|]+)/i);
    const demandadoMatch = sujetos.match(/Demandado[^:]*:\s*([^|]+)/i);
    
    if (demandanteMatch && demandanteMatch[1]) {
      partes.demandante = demandanteMatch[1].trim();
    }
    
    if (demandadoMatch && demandadoMatch[1]) {
      partes.demandado = demandadoMatch[1].trim();
    }
    
    return partes;
  };
  
  const formatearFecha = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-CO');
    } catch {
      return fechaStr;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resultados de Consulta</h1>
        <p className="text-gray-600">
          {cargando ? "Buscando procesos..." : 
           error ? "Error en la consulta" :
           resultados ? `Se encontraron ${resultados.paginacion.cantidadRegistros} procesos que coinciden con tu búsqueda.` :
           "No hay resultados disponibles."}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 flex items-center text-sm font-medium">
            <FiFilter className="mr-2" /> Filtrar
          </button>
          <span className="text-gray-300">|</span>
          <div className="flex items-center">
            <span className="text-gray-600 text-sm mr-2">Ordenar por:</span>
            <select 
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="fecha_desc">Fecha (más reciente)</option>
              <option value="fecha_asc">Fecha (más antigua)</option>
              <option value="radicado">Radicado</option>
            </select>
          </div>
        </div>
        
        <button 
          disabled={!resultados || resultados.procesos.length === 0}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center disabled:opacity-50"
        >
          <FiDownload className="mr-2" /> Exportar resultados
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error al realizar la consulta</p>
            <p className="text-sm">{error}</p>
            <Link href="/dashboard/consulta" className="text-red-700 underline text-sm mt-2 inline-block">
              Volver al formulario de consulta
            </Link>
          </div>
        </div>
      )}
      
      {cargando ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Consultando procesos judiciales...</p>
        </div>
      ) : (
        !error && resultados && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="min-w-full">
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 text-left py-3.5 px-4 text-sm font-medium text-gray-700">
                  <div className="col-span-2">Radicado</div>
                  <div className="col-span-3">Juzgado</div>
                  <div className="col-span-2">Sujetos</div>
                  <div className="col-span-2">Fecha Actualización</div>
                  <div className="col-span-1">Departamento</div>
                  <div className="col-span-2 text-center">Acciones</div>
                </div>
              </div>
              
              {procesosProcesados().length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {procesosProcesados().map((proceso: Proceso) => (
                    <div key={proceso.idProceso} className="grid grid-cols-12 text-left py-4 px-4 text-sm text-gray-700 hover:bg-gray-50">
                      <div className="col-span-2 font-medium text-indigo-600">{proceso.llaveProceso}</div>
                      <div className="col-span-3 truncate" title={proceso.despacho}>{proceso.despacho}</div>
                      <div className="col-span-2 truncate" title={proceso.sujetosProcesales}>
                        {extraerPartes(proceso.sujetosProcesales).demandante || "No especificado"}
                      </div>
                      <div className="col-span-2">{formatearFecha(proceso.fechaUltimaActuacion)}</div>
                      <div className="col-span-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {proceso.departamento}
                        </span>
                      </div>                      <div className="col-span-2 flex justify-center space-x-2">
                        <Link
                          href={`/dashboard/proceso/${proceso.idProceso}`}
                          className="text-gray-600 hover:text-indigo-600"
                          title="Ver detalles del proceso"
                          prefetch={false}
                        >
                          <FiFileText />
                        </Link>
                        <Link
                          href={`/dashboard/proceso/${proceso.idProceso}/actuaciones`}
                          className="text-gray-600 hover:text-indigo-600"
                          title="Ver actuaciones procesales"
                          prefetch={false}
                        >
                          <FiClock />
                        </Link>
                        <a
                          href={`https://consultaprocesos.ramajudicial.gov.co:448/consultaprocesos/ConsultaJusticias21.aspx?NumRadicacion=${proceso.llaveProceso}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-indigo-600"
                          title="Ver proceso en la Rama Judicial"
                        >
                          <FiChevronRight />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No se encontraron procesos que coincidan con la búsqueda.
                </div>
              )}
            </div>
            
            {resultados && resultados.paginacion && resultados.paginacion.cantidadPaginas > 0 && (
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{(pagina - 1) * resultados.paginacion.registrosPagina + 1}</span> a{" "}
                      <span className="font-medium">
                        {Math.min(pagina * resultados.paginacion.registrosPagina, resultados.paginacion.cantidadRegistros)}
                      </span>{" "}
                      de <span className="font-medium">{resultados.paginacion.cantidadRegistros}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button 
                        onClick={() => irAPagina(pagina - 1)}
                        disabled={pagina === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Anterior</span>
                        Anterior
                      </button>
                      
                      {/* Mostrar página actual y algunas páginas adyacentes */}
                      {[...Array(Math.min(5, resultados.paginacion.cantidadPaginas))].map((_, i) => {
                        let pageNum;
                        if (resultados.paginacion.cantidadPaginas <= 5) {
                          pageNum = i + 1;
                        } else if (pagina <= 3) {
                          pageNum = i + 1;
                        } else if (pagina >= resultados.paginacion.cantidadPaginas - 2) {
                          pageNum = resultados.paginacion.cantidadPaginas - 4 + i;
                        } else {
                          pageNum = pagina - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => irAPagina(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              pagina === pageNum ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            } text-sm font-medium`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button 
                        onClick={() => irAPagina(pagina + 1)}
                        disabled={pagina === resultados.paginacion.cantidadPaginas}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Siguiente</span>
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </DashboardLayout>
  );
}
