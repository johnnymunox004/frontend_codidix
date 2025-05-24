"use client";

import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiSend, FiX, FiMinimize2, FiMaximize2, FiUser, FiInfo } from 'react-icons/fi';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente legal virtual. Estoy aquí para ayudarte con tus procesos judiciales.',
      isUser: false,
      timestamp: new Date()
    },
    {
      id: '2',
      text: 'Puedo asistirte con información sobre tus procesos, audiencias programadas, actuaciones judiciales, documentos legales y más.',
      isUser: false,
      timestamp: new Date()
    },
    {
      id: '3',
      text: '¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll al último mensaje cuando se añade uno nuevo
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus en el input cuando se abre el chat
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === '') return;
    
    // Añadir mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    // Simular respuesta del asistente después de un tiempo
    setTimeout(() => {
      const botResponse = generateResponse(message);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000);
  };
    // Función mejorada para generar respuestas
  const generateResponse = (query: string): string => {
    query = query.toLowerCase();
    
    // Respuestas a saludos
    if (query.includes('hola') || query.includes('buenos días') || query.includes('buenas tardes') || query.includes('buenas noches')) {
      return '¡Hola! Soy tu asistente jurídico virtual. ¿En qué puedo ayudarte con tus procesos judiciales hoy?';
    } 
    
    // Respuestas relacionadas con procesos
    else if (query.includes('proceso') || query.includes('caso')) {
      if (query.includes('nuevo') || query.includes('iniciar') || query.includes('crear')) {
        return 'Para iniciar un nuevo proceso, necesitarás preparar toda la documentación pertinente. Puedes consultar con tu abogado sobre los requisitos específicos según el tipo de proceso que deseas iniciar.';
      } else if (query.includes('estado') || query.includes('situación')) {
        return 'Puedes consultar el estado actual de tus procesos en la sección "Consultar Procesos" del dashboard. Allí encontrarás información actualizada sobre cada uno de ellos.';
      } else if (query.includes('buscar') || query.includes('encontrar')) {
        return 'Para buscar un proceso específico, dirígete a la sección "Consulta de Procesos" y utiliza los filtros disponibles. Puedes buscar por radicado, demandado, demandante, juzgado o tipo de proceso.';
      } else {
        return 'Puedes consultar tus procesos en la sección "Consultar Procesos" del dashboard. Si necesitas ayuda específica con un proceso, dime su número de radicado y te proporcionaré la información disponible.';
      }
    } 
    
    // Respuestas relacionadas con audiencias y fechas
    else if (query.includes('audiencia') || query.includes('fecha') || query.includes('cita') || query.includes('juicio')) {
      if (query.includes('próxima') || query.includes('siguiente')) {
        return 'Tu próxima audiencia está programada según el calendario de la sección "Alertas y Notificaciones". Allí encontrarás la fecha, hora y juzgado donde se llevará a cabo.';
      } else if (query.includes('preparar') || query.includes('preparación')) {
        return 'Para prepararte para una audiencia, debes revisar toda la documentación relacionada con el caso y coordinar con tu abogado los puntos clave a tratar. La sección de "Actuaciones" del proceso te ayudará a estar al día.';
      } else {
        return 'Revisa la sección de "Alertas y Notificaciones" para ver tus próximas audiencias programadas. ¿Necesitas información sobre alguna audiencia específica?';
      }
    }
    
    // Respuestas relacionadas con documentos
    else if (query.includes('documento') || query.includes('archivo') || query.includes('evidencia') || query.includes('prueba')) {
      if (query.includes('subir') || query.includes('cargar') || query.includes('añadir')) {
        return 'Para cargar nuevos documentos a un proceso, debes ir a los detalles del proceso específico y usar la opción "Cargar documentos". Asegúrate de que estén en formato PDF para mejor compatibilidad.';
      } else if (query.includes('descargar') || query.includes('obtener')) {
        return 'Puedes descargar los documentos de un proceso desde la sección de detalles del mismo. Busca el icono de descarga junto al archivo que necesites.';
      } else {
        return 'Los documentos de tus procesos están disponibles en la sección de detalles de cada proceso. ¿Buscas algún documento en particular?';
      }
    }
    
    // Respuestas relacionadas con términos legales
    else if (query.includes('término') || query.includes('plazo') || query.includes('vencimiento')) {
      return 'Los términos y plazos legales son críticos en los procesos judiciales. El sistema te notificará automáticamente cuando un término esté próximo a vencer en la sección de "Alertas y Notificaciones". Recuerda que el incumplimiento de términos puede tener consecuencias procesales importantes.';
    }
    
    // Respuestas sobre actuaciones
    else if (query.includes('actuación') || query.includes('actuaciones') || query.includes('auto')) {
      return 'Las actuaciones judiciales se encuentran en la sección "Actuaciones" de cada proceso. Allí podrás ver un historial cronológico de todos los eventos procesales, resoluciones y autos emitidos por el juzgado.';
    }
    
    // Respuestas sobre alertas y notificaciones
    else if (query.includes('alerta') || query.includes('notificación') || query.includes('aviso')) {
      return 'El sistema genera alertas para eventos importantes como audiencias programadas, términos por vencer, y nuevas actuaciones. Puedes gestionarlas en la sección "Alertas y Notificaciones" del dashboard.';
    }
    
    // Respuestas generales de ayuda
    else if (query.includes('ayuda') || query.includes('cómo')) {
      if (query.includes('usar') || query.includes('utilizar') || query.includes('funciona')) {
        return 'Codidix es un sistema integral para la gestión de procesos judiciales. Navega por las diferentes secciones del dashboard para consultar tus procesos, ver actuaciones, gestionar alertas y mantener tu perfil actualizado. ¿Hay alguna función específica sobre la que necesitas ayuda?';
      } else {
        return 'Estoy aquí para asistirte con información sobre tus procesos, audiencias y actuaciones judiciales. ¿Podrías especificar más sobre lo que necesitas?';
      }
    }
    
    // Respuestas de agradecimiento
    else if (query.includes('gracias') || query.includes('agradezco')) {
      return '¡De nada! Estoy aquí para ayudarte cuando me necesites. No dudes en consultar cualquier duda legal o sobre el uso del sistema.';
    }
    
    // Respuesta por defecto
    else {
      return 'Entiendo tu consulta sobre "' + query + '". Para darte una respuesta más precisa, ¿podrías proporcionar más detalles o reformular tu pregunta? Recuerda que puedo ayudarte con información sobre tus procesos, audiencias, documentos y más.';
    }
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">      {/* Botón para abrir/cerrar chat con badge de notificación */}
      <button
        className="relative bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        onClick={toggleChat}
      >
        <FiMessageSquare className="w-6 h-6" />
        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
        <span className="sr-only">Abrir asistente legal</span>
      </button>
        {/* Ventana del chat con animación */}
      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-200 animate-slideUp"
          style={{
            animation: 'slideUp 0.3s ease-out forwards',
            transformOrigin: 'bottom right',
          }}
        >
          {/* Encabezado del chat */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full p-1 mr-2">
                <FiMessageSquare className="text-white" />
              </div>
              <h3 className="font-medium">Asistente Legal</h3>
              <div className="ml-2 flex h-2">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMinimize} 
                className="text-white hover:text-gray-200 focus:outline-none transition-transform hover:scale-110"
              >
                {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
              </button>
              <button 
                onClick={toggleChat} 
                className="text-white hover:text-gray-200 focus:outline-none transition-transform hover:scale-110"
              >
                <FiX />
              </button>
            </div>
          </div>
          
          {/* Contenido del chat */}
          {!isMinimized && (
            <>
              {/* Mensajes */}
              <div className="p-4 h-80 overflow-y-auto bg-gray-50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    {!msg.isUser && (
                      <div className="bg-indigo-100 rounded-full p-2 mr-2">
                        <FiInfo className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                    <div 
                      className={`max-w-3/4 p-3 rounded-lg ${msg.isUser 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 text-right ${msg.isUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                    {msg.isUser && (
                      <div className="bg-gray-200 rounded-full p-2 ml-2">
                        <FiUser className="w-4 h-4 text-gray-700" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-indigo-100 rounded-full p-2 mr-2">
                      <FiInfo className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
                {/* Formulario de entrada mejorado */}
              <form onSubmit={handleSend} className="border-t border-gray-200 p-3 flex">
                <input
                  type="text"
                  ref={inputRef}
                  className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Escribe tu consulta legal..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && message.trim() !== '' && handleSend(e)}
                />
                <button
                  type="submit"
                  disabled={message.trim() === ''}
                  className={`px-4 py-2 rounded-r-md flex items-center justify-center transition-colors duration-200 ${
                    message.trim() === ''
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <FiSend className={message.trim() !== '' ? 'animate-pulse' : ''} />
                </button>
              </form>
              
              {/* Sugerencias rápidas */}
              {!isTyping && (
                <div className="px-3 pb-3 flex flex-wrap gap-2">
                  {['¿Cómo consulto un proceso?', '¿Cuándo es mi próxima audiencia?', '¿Qué son las actuaciones?'].map((sugerencia, index) => (
                    <button 
                      key={index}
                      onClick={() => {
                        setMessage(sugerencia);
                        setTimeout(() => {
                          if (inputRef.current) inputRef.current.focus();
                        }, 100);
                      }}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors duration-200"
                    >
                      {sugerencia}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
