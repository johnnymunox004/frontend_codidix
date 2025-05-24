import Link from 'next/link';
import { FiAlertCircle } from 'react-icons/fi';
import DashboardLayout from '@/components/DashboardLayout';

export default function NotFound() {
  return (
    <DashboardLayout>
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded-lg mb-6 flex flex-col items-center text-center">
        <FiAlertCircle className="text-red-500 text-4xl mb-4" />
        <h2 className="text-xl font-semibold text-red-800 mb-2">Documentos no encontrados</h2>
        <p className="text-red-700 mb-4">
          No se encontraron documentos para el proceso judicial solicitado. Verifique el número de proceso e intente nuevamente.
        </p>
        <Link 
          href="/dashboard/consulta" 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
        >
          Volver a consultas
        </Link>
      </div>
    </DashboardLayout>
  );
}
