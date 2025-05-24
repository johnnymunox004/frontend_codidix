import { AppLayout } from "@/components/AppLayout";
import Image from "next/image";

export default function ServicesPage() {
  const services = [
    {
      title: "Desarrollo Web",
      description: "Creamos sitios web y aplicaciones web a medida utilizando las tecnologías más modernas como Next.js, React, y TypeScript.",
      icon: "/globe.svg",
    },
    {
      title: "Diseño UX/UI",
      description: "Diseñamos interfaces de usuario intuitivas y atractivas que mejoran la experiencia del usuario y aumentan la conversión.",
      icon: "/window.svg",
    },
    {
      title: "Soluciones E-Commerce",
      description: "Implementamos tiendas en línea seguras y escalables con todos los elementos necesarios para vender productos o servicios.",
      icon: "/file.svg",
    },
    {
      title: "SEO y Marketing Digital",
      description: "Optimizamos su presencia en línea para mejorar su visibilidad en los motores de búsqueda y aumentar el tráfico orgánico.",
      icon: "/vercel.svg",
    },
    {
      title: "Mantenimiento y Soporte",
      description: "Ofrecemos servicios de mantenimiento y soporte continuo para garantizar que su sitio web funcione sin problemas.",
      icon: "/next.svg",
    },
    {
      title: "Consultoría Tecnológica",
      description: "Asesoramos a nuestros clientes en la selección de tecnologías y estrategias para optimizar sus proyectos digitales.",
      icon: "/file.svg",
    },
  ];

  return (
    <AppLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Servicios</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una amplia gama de servicios para ayudar a su empresa a destacar en el entorno digital.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full mb-4 mx-auto">
                    <Image 
                      src={service.icon} 
                      alt={service.title}
                      width={32}
                      height={32}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{service.title}</h3>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">¿Por qué elegirnos?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Experiencia</h3>
                <p className="text-gray-600">Contamos con años de experiencia en el desarrollo de soluciones web de alta calidad.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Innovación</h3>
                <p className="text-gray-600">Utilizamos tecnologías de vanguardia para crear soluciones modernas y eficientes.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Compromiso</h3>
                <p className="text-gray-600">Nos comprometemos a entregar proyectos de alta calidad en tiempo y forma.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
