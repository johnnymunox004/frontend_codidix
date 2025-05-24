import { AppLayout } from "@/components/AppLayout";

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Acerca de Nosotros</h1>
          
          <div className="prose lg:prose-lg">
            <p className="text-lg text-gray-700 mb-6">
              Bienvenido a la página Acerca de Codidix. Somos una empresa dedicada a crear soluciones web innovadoras y eficientes para nuestros clientes.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Nuestra Misión</h2>
            <p className="text-gray-700 mb-6">
              Nuestra misión es proporcionar soluciones tecnológicas que ayuden a nuestros clientes a alcanzar sus objetivos comerciales. Nos enfocamos en crear aplicaciones web modernas, seguras y escalables.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Nuestro Equipo</h2>
            <p className="text-gray-700 mb-6">
              Contamos con un equipo de profesionales altamente calificados en desarrollo web, diseño de interfaz de usuario y experiencia de usuario. Estamos comprometidos con la excelencia y la satisfacción del cliente.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Tecnologías</h2>
            <p className="text-gray-700 mb-6">
              Utilizamos las tecnologías más modernas para crear nuestras soluciones, incluyendo:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
              <li>Next.js para aplicaciones web rápidas y optimizadas para SEO</li>
              <li>TypeScript para un código más mantenible y libre de errores</li>
              <li>Tailwind CSS para diseños responsivos y elegantes</li>
              <li>Clerk para autenticación segura y fácil de implementar</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
