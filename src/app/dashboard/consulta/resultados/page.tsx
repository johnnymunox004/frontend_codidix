"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { mockProcesos } from "@/data/mockData";
import Link from "next/link";
import { FiFilter, FiDownload, FiChevronRight, FiClock, FiFileText } from "react-icons/fi";

export default function ResultadosConsultaPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resultados de Consulta</h1>
        <p className="text-gray-600">
          Se encontraron {mockProcesos.length} procesos que coinciden con tu búsqueda.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="text-gray-700 flex items-center text-sm font-medium">
            <FiFilter className="mr-2" /> Filtrar
          </button>
          <span className="text-gray-300">|</span>
          <div className="flex items-center">
            <span className="text-gray-600 text-sm mr-2">Ordenar por:</span>            <select 
              defaultValue="fecha_desc"
              className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="fecha_desc">Fecha (más reciente)</option>
              <option value="fecha_asc">Fecha (más antigua)</option>
              <option value="radicado">Radicado</option>
              <option value="estado">Estado</option>
            </select>
          </div>
        </div>
        
        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
          <FiDownload className="mr-2" /> Exportar resultados
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full">
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 text-left py-3.5 px-4 text-sm font-medium text-gray-700">
              <div className="col-span-2">Radicado</div>
              <div className="col-span-3">Juzgado</div>
              <div className="col-span-2">Tipo</div>
              <div className="col-span-2">Fecha Inicio</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-2 text-center">Acciones</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockProcesos.map((proceso) => (
              <div key={proceso.id} className="grid grid-cols-12 text-left py-4 px-4 text-sm text-gray-700 hover:bg-gray-50">
                <div className="col-span-2 font-medium text-indigo-600">{proceso.radicado}</div>
                <div className="col-span-3 truncate" title={proceso.juzgado}>{proceso.juzgado}</div>
                <div className="col-span-2">{proceso.tipo.split(" - ")[0]}</div>
                <div className="col-span-2">{proceso.fechaInicio}</div>
                <div className="col-span-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {proceso.estado}
                  </span>
                </div>
                <div className="col-span-2 flex justify-center space-x-2">
                  <Link
                    href={`/dashboard/proceso/${proceso.id}`}
                    className="text-gray-600 hover:text-indigo-600"
                    title="Ver detalles del proceso"
                  >
                    <FiFileText />
                  </Link>
                  <Link
                    href={`/dashboard/proceso/${proceso.id}/actuaciones`}
                    className="text-gray-600 hover:text-indigo-600"
                    title="Ver actuaciones"
                  >
                    <FiClock />
                  </Link>
                  <Link
                    href={`/dashboard/proceso/${proceso.id}`}
                    className="text-gray-600 hover:text-indigo-600"
                    title="Ver proceso completo"
                  >
                    <FiChevronRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{mockProcesos.length}</span> de <span className="font-medium">{mockProcesos.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Anterior</span>
                  Anterior
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Siguiente</span>
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
