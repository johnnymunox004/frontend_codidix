import { AppLayout } from "@/components/AppLayout";

export default function ContactPage() {
  return (
    <AppLayout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Contacto</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ¿Tienes alguna pregunta o necesitas ayuda con tu proyecto? No dudes en contactarnos.
            </p>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-indigo-600 text-white p-8">
                <h2 className="text-2xl font-semibold mb-4">Información de contacto</h2>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Dirección:</p>
                    <p className="mt-1">Calle Principal 123, Ciudad Ejemplo, País</p>
                  </div>
                  <div>
                    <p className="font-medium">Teléfono:</p>
                    <p className="mt-1">+1 (123) 456-7890</p>
                  </div>
                  <div>
                    <p className="font-medium">Email:</p>
                    <p className="mt-1">info@codidix.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Horario de atención:</p>
                    <p className="mt-1">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3 p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Envíanos un mensaje</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Asunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                    >
                      Enviar mensaje
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
