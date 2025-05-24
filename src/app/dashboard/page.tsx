"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth, useUser } from "@clerk/nextjs";
import { currentUser as mockCurrentUser, mockEstadisticas, mockProcesos, mockAlertas } from "@/data/mockData";
import Link from "next/link";
import { 
  FiFile, 
  FiBell, 
  FiCalendar, 
  FiTrendingUp, 
  FiAlertCircle,
  FiClock
} from "react-icons/fi";

export default function DashboardPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  
  // Obtener las últimas actuaciones
  const ultimasActuaciones = mockProcesos
    .flatMap(proceso => 
      proceso.actuaciones.map(actuacion => ({
        ...actuacion,
        procesoId: proceso.id,
        procesoRadicado: proceso.radicado,
        juzgado: proceso.juzgado
      }))
    )
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5);
  
  // Obtener alertas no leídas
  const alertasPendientes = mockAlertas.filter(alerta => !alerta.leida);
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Panel Principal</h1>
        <p className="text-gray-600">
          Bienvenido, {user?.firstName || mockCurrentUser.nombre}. Aquí tienes un resumen de tus procesos judiciales.
        </p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FiFile className="text-blue-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Procesos Activos</p>
            <h3 className="text-xl font-bold text-gray-800">{mockEstadisticas.totalProcesosActivos}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-red-100 p-3 mr-4">
            <FiAlertCircle className="text-red-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Alertas Urgentes</p>
            <h3 className="text-xl font-bold text-gray-800">{mockEstadisticas.alertasUrgentes}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FiCalendar className="text-green-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Próximas Audiencias</p>
            <h3 className="text-xl font-bold text-gray-800">{mockEstadisticas.proximasAudiencias}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FiClock className="text-purple-500 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Actuaciones Recientes</p>
            <h3 className="text-xl font-bold text-gray-800">{ultimasActuaciones.length}</h3>
          </div>
        </div>
      </div>
      
      {/* Gráfica de procesos por tipo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiTrendingUp className="mr-2" /> Distribución de Procesos
          </h2>
          <div className="space-y-4">
            {Object.entries(mockEstadisticas.procesosPorTipo).map(([tipo, cantidad]) => (
              <div key={tipo}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{tipo}</span>
                  <span className="text-sm text-gray-600">{cantidad}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(cantidad / mockEstadisticas.totalProcesosActivos) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Alertas recientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiBell className="mr-2" /> Alertas Recientes
            </h2>
            <Link href="/dashboard/alertas" className="text-sm text-indigo-600 hover:text-indigo-800">
              Ver todas
            </Link>
          </div>
          
          {alertasPendientes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {alertasPendientes.map((alerta) => (
                <li key={alerta.id} className="py-3">
                  <div className="flex items-start">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-2 mt-1 whitespace-nowrap">
                      {alerta.tipo}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Proceso {alerta.procesoRadicado}
                      </p>
                      <p className="text-xs text-gray-500">{alerta.accionSugerida}</p>
                      <p className="text-xs text-gray-400 mt-1">Fecha: {alerta.fecha}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No hay alertas pendientes.</p>
          )}
        </div>
      </div>
      
      {/* Últimas actuaciones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Actuaciones Recientes</h2>
            <Link href="/dashboard/consulta" className="text-sm text-indigo-600 hover:text-indigo-800">
              Ver todos los procesos
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {ultimasActuaciones.map((actuacion) => (
            <div key={actuacion.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <Link 
                    href={`/dashboard/proceso/${actuacion.procesoId}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Proceso {actuacion.procesoRadicado}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">{actuacion.juzgado}</p>
                </div>
                <span className="text-xs text-gray-500">{actuacion.fecha}</span>
              </div>
              <p className="mt-2 text-sm text-gray-800">{actuacion.descripcion}</p>
              {actuacion.resumen && (
                <p className="mt-1 text-xs text-gray-600">{actuacion.resumen}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
