"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { mockAlertas } from "@/data/mockData";
import Link from "next/link";
import { FiBell, FiCheck, FiEye, FiTrash2, FiAlertCircle } from "react-icons/fi";

export default function AlertasPage() {
  // Separar alertas leídas y no leídas
  const alertasPendientes = mockAlertas.filter(alerta => !alerta.leida);
  const alertasLeidas = mockAlertas.filter(alerta => alerta.leida);
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Alertas y Notificaciones</h1>
        <p className="text-gray-600">
          Gestiona tus alertas sobre eventos importantes en tus procesos judiciales.
        </p>
      </div>
      
      {/* Barra de acciones */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">
            {alertasPendientes.length} alertas sin leer
          </span>
          <span className="text-gray-300">|</span>
          <button className="text-gray-700 flex items-center text-sm">
            <FiCheck className="mr-2" /> Marcar todas como leídas
          </button>
        </div>
        
        <div className="flex items-center space-x-2">          <select 
            defaultValue="todas"
            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="todas">Todas las alertas</option>
            <option value="audiencia">Audiencias</option>
            <option value="vencimiento">Vencimientos</option>
            <option value="requerimiento">Requerimientos</option>
          </select>
        </div>
      </div>
      
      {/* Alertas sin leer */}
      {alertasPendientes.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" /> Alertas Pendientes
            </h2>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {alertasPendientes.map((alerta) => (
              <li key={alerta.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <span className="inline-block rounded-full p-1.5 bg-red-100 text-red-600">
                      <FiBell className="w-4 h-4" />
                    </span>
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800 flex items-center">
                        {alerta.tipo}
                        <span className="ml-2 bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full">
                          No leída
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">{alerta.fecha}</p>
                    </div>
                    
                    <div className="mt-1">
                      <Link 
                        href={`/dashboard/proceso/${alerta.procesoId}`}
                        className="text-indigo-600 text-sm hover:text-indigo-800"
                      >
                        Proceso {alerta.procesoRadicado}
                      </Link>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {alerta.accionSugerida}
                      </p>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-3">
                      <button className="text-sm flex items-center text-gray-500 hover:text-indigo-600">
                        <FiCheck className="mr-1" /> Marcar como leída
                      </button>
                      <button className="text-sm flex items-center text-gray-500 hover:text-indigo-600">
                        <FiEye className="mr-1" /> Ver proceso
                      </button>
                      <button className="text-sm flex items-center text-gray-500 hover:text-red-600">
                        <FiTrash2 className="mr-1" /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Alertas leídas */}
      {alertasLeidas.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiCheck className="text-green-500 mr-2" /> Alertas Leídas
            </h2>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {alertasLeidas.map((alerta) => (
              <li key={alerta.id} className="p-4 hover:bg-gray-50 transition-colors opacity-70">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <span className="inline-block rounded-full p-1.5 bg-gray-100 text-gray-500">
                      <FiBell className="w-4 h-4" />
                    </span>
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800">{alerta.tipo}</p>
                      <p className="text-xs text-gray-500">{alerta.fecha}</p>
                    </div>
                    
                    <div className="mt-1">
                      <Link 
                        href={`/dashboard/proceso/${alerta.procesoId}`}
                        className="text-indigo-600 text-sm hover:text-indigo-800"
                      >
                        Proceso {alerta.procesoRadicado}
                      </Link>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {alerta.accionSugerida}
                      </p>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-3">
                      <button className="text-sm flex items-center text-gray-500 hover:text-indigo-600">
                        <FiEye className="mr-1" /> Ver proceso
                      </button>
                      <button className="text-sm flex items-center text-gray-500 hover:text-red-600">
                        <FiTrash2 className="mr-1" /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Sin alertas */}
      {mockAlertas.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
            <FiBell className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No hay alertas</h3>
          <p className="text-gray-600">
            No tienes ninguna alerta o notificación pendiente en este momento.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
