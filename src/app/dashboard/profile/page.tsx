"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth, useUser } from '@clerk/nextjs';
import { currentUser as mockUser } from '@/data/mockData';
import { FiUser, FiMail, FiBriefcase, FiSettings, FiBell, FiShield } from "react-icons/fi";

export default function ProfilePage() {
  // Obtenemos el usuario de Clerk con los hooks del cliente
  const { userId } = useAuth();
  const { user } = useUser();
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Perfil de Usuario</h1>
        <p className="text-gray-600">
          Administra tu información personal y preferencias de la cuenta.
        </p>
      </div>
      
      {/* Navegación de pestañas */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex -mb-px">
          <li className="mr-1">
            <button className="inline-block py-3 px-4 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600">
              Información General
            </button>
          </li>
          <li className="mr-1">
            <button className="inline-block py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300">
              Seguridad
            </button>
          </li>
          <li className="mr-1">
            <button className="inline-block py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300">
              Notificaciones
            </button>
          </li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información del perfil */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiUser className="mr-2" /> Información Personal
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nombre"
                    defaultValue={user?.firstName || mockUser.nombre.split(' ')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Apellido"
                    defaultValue={user?.lastName || mockUser.nombre.split(' ')[1]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 cursor-not-allowed"
                    placeholder="Email"
                    defaultValue={user?.emailAddresses[0]?.emailAddress || mockUser.email}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Teléfono"
                    defaultValue={user?.phoneNumbers[0]?.phoneNumber || ""}
                  />
                </div>
              </div>
                <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol en el Sistema</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  defaultValue={mockUser.rol}
                >
                  <option value="abogado">Abogado</option>
                  <option value="asistente">Asistente Legal</option>
                  <option value="cliente">Cliente</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
          
          {/* Información de la empresa */}
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiBriefcase className="mr-2" /> Información de la Empresa
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={mockUser.empresa}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIT</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    defaultValue={mockUser.nit}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Dirección de la empresa"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel lateral */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">Acciones Rápidas</h2>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                <li>
                  <button className="w-full flex items-center py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    <FiSettings className="mr-3 text-gray-500" />
                    Configuración de la cuenta
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    <FiBell className="mr-3 text-gray-500" />
                    Preferencias de notificación
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center py-2 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    <FiShield className="mr-3 text-gray-500" />
                    Cambiar contraseña
                  </button>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Última actualización</h3>
                  <p className="text-sm text-gray-500 mt-1">24 de mayo, 2025</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700">ID de usuario</h3>
                  <p className="text-sm text-gray-500 mt-1">{userId || mockUser.id}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-6">
            <h2 className="text-indigo-800 font-medium mb-2">Información</h2>
            <p className="text-sm text-indigo-700 mb-4">
              Esta información se utilizará para gestionar tus accesos y notificaciones en el sistema de gestión judicial.
            </p>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm">
              Solicitar soporte
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
