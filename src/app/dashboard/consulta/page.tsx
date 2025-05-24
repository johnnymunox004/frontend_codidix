"use client";

import { useState } from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import { FiSearch, FiFilter, FiFile } from "react-icons/fi";
import Link from 'next/link';

export default function ConsultaPage() {
  const [tipoBusqueda, setTipoBusqueda] = useState('radicado');
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Consulta de Procesos</h1>
        <p className="text-gray-600">
          Busca procesos judiciales por diferentes criterios.
        </p>
      </div>
      
      {/* Formulario de  llaa búsqueda */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de búsqueda</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={tipoBusqueda}
              onChange={(e) => setTipoBusqueda(e.target.value)}
            >
              <option value="radicado">Radicado</option>
              <option value="demandado">Demandado</option>
              <option value="demandante">Demandante</option>
              <option value="juzgado">Juzgado</option>
              <option value="tipo">Tipo de proceso</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Términos de búsqueda</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Ingrese el ${tipoBusqueda}`}
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <Link 
              href="/dashboard/consulta/resultados"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
            >
              <FiSearch className="mr-2" /> Buscar
            </Link>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center border-t pt-6">
          <button className="text-gray-600 hover:text-indigo-600 text-sm flex items-center">
            <FiFilter className="mr-2" /> Filtros avanzados
          </button>
          
          <div className="flex space-x-4">
            <button className="text-indigo-600 hover:text-indigo-800 text-sm">
              Guardar consulta
            </button>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm">
              Cargar consulta guardada
            </button>
          </div>
        </div>
      </div>
      
      {/* Consultas rápidas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Consultas Rápidas</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/dashboard/consulta/resultados" className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <FiFile className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-800">Procesos Activos</h3>
              </div>
              <p className="text-sm text-gray-600">
                Todos los procesos activos ordenados por fecha de actualización.
              </p>
            </Link>
            
            <Link href="/dashboard/consulta/resultados" className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-green-100 p-2 mr-3">
                  <FiFile className="text-green-600" />
                </div>
                <h3 className="font-medium text-gray-800">Procesos donde soy Demandante</h3>
              </div>
              <p className="text-sm text-gray-600">
                Todos los procesos donde la empresa es demandante.
              </p>
            </Link>
            
            <Link href="/dashboard/consulta/resultados" className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-red-100 p-2 mr-3">
                  <FiFile className="text-red-600" />
                </div>
                <h3 className="font-medium text-gray-800">Procesos donde soy Demandado</h3>
              </div>
              <p className="text-sm text-gray-600">
                Todos los procesos donde la empresa es demandada.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
