import { AppLayout } from "@/components/AppLayout";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <AppLayout>
      <div className="py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Bienvenido a Codidix
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Una aplicación web construida con Next.js, TypeScript, Tailwind CSS y autenticación con Clerk.
          </p>
          
          <SignedIn>
            <div className="mt-8">
              <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Ir al Dashboard
              </Link>
            </div>
          </SignedIn>
          
          <SignedOut>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-in" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/sign-up" className="bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600 font-semibold px-6 py-3 rounded-lg transition-colors">
                Registrarse
              </Link>
            </div>
          </SignedOut>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Autenticación Completa</h3>
            <p className="text-gray-600">Autenticación segura y fácil de usar con Clerk, incluyendo inicio de sesión y registro.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Next.js App Router</h3>
            <p className="text-gray-600">Estructura de proyecto moderna usando el App Router de Next.js con TypeScript.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Diseño Responsivo</h3>
            <p className="text-gray-600">Interfaz de usuario elegante y responsiva construida con Tailwind CSS.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
