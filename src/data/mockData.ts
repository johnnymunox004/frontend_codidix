// Mock data para el sistema de gestión de procesos judiciales

// Tipos para la estructura de datos
export interface Proceso {
  id: string;
  radicado: string;
  juzgado: string;
  fechaInicio: string;
  estado: string;
  empresa: string;
  nit: string;
  partes: {
    demandante: string;
    demandado: string;
  };
  tipo: string;
  actuaciones: Actuacion[];
}

export interface Actuacion {
  id: string;
  fecha: string;
  descripcion: string;
  resumen?: string;
  urgencia?: 'alta' | 'media' | 'baja';
  documento?: string;
}

export interface Alerta {
  id: string;
  tipo: string;
  fecha: string;
  procesoId: string;
  procesoRadicado: string;
  accionSugerida: string;
  leida: boolean;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  empresa: string;
  nit: string;
  rol: string;
}

// Usuario actual simulado
export const currentUser: Usuario = {
  id: 'usr_123456',
  nombre: 'Juan Pérez',
  email: 'juan.perez@empresa.com',
  empresa: 'Empresa ABC S.A.S.',
  nit: '901.456.789-0',
  rol: 'abogado',
};

// Datos simulados de procesos
export const mockProcesos: Proceso[] = [
  {
    id: 'proc_001',
    radicado: '2023-00123',
    juzgado: 'Juzgado 1 Civil del Circuito',
    fechaInicio: '2023-03-15',
    estado: 'Activo',
    empresa: 'Empresa ABC S.A.S.',
    nit: '901.456.789-0',
    partes: {
      demandante: 'Empresa ABC S.A.S.',
      demandado: 'Proveedor XYZ Ltda.'
    },
    tipo: 'Ejecutivo Contractual',
    actuaciones: [
      {
        id: 'act_001_1',
        fecha: '2023-03-15',
        descripcion: 'Presentación de demanda',
        resumen: 'Se radicó demanda ejecutiva por incumplimiento contractual',
        urgencia: 'baja',
        documento: '/documentos/demanda_001.pdf'
      },
      {
        id: 'act_001_2',
        fecha: '2023-04-10',
        descripcion: 'Auto admisorio de la demanda',
        resumen: 'El juzgado admite la demanda y ordena notificar a la parte demandada',
        urgencia: 'media',
        documento: '/documentos/auto_001.pdf'
      },
      {
        id: 'act_001_3',
        fecha: '2023-05-20',
        descripcion: 'Contestación de demanda',
        resumen: 'La parte demandada presenta excepciones de mérito',
        urgencia: 'alta',
        documento: '/documentos/contestacion_001.pdf'
      }
    ]
  },
  {
    id: 'proc_002',
    radicado: '2022-00456',
    juzgado: 'Juzgado 3 Laboral del Circuito',
    fechaInicio: '2022-09-05',
    estado: 'Activo',
    empresa: 'Empresa ABC S.A.S.',
    nit: '901.456.789-0',
    partes: {
      demandante: 'Carlos Rodríguez',
      demandado: 'Empresa ABC S.A.S.'
    },
    tipo: 'Laboral - Despido injustificado',
    actuaciones: [
      {
        id: 'act_002_1',
        fecha: '2022-09-05',
        descripcion: 'Presentación de demanda',
        resumen: 'Ex empleado demanda por despido sin justa causa',
        urgencia: 'media',
        documento: '/documentos/demanda_002.pdf'
      },
      {
        id: 'act_002_2',
        fecha: '2022-10-12',
        descripcion: 'Auto admisorio de la demanda',
        resumen: 'Se admite la demanda y se fija fecha para audiencia inicial',
        urgencia: 'media',
        documento: '/documentos/auto_002.pdf'
      },
      {
        id: 'act_002_3',
        fecha: '2022-11-30',
        descripcion: 'Audiencia de conciliación',
        resumen: 'Las partes no llegaron a un acuerdo. Se fija fecha para audiencia de pruebas',
        urgencia: 'alta',
        documento: '/documentos/acta_002.pdf'
      },
      {
        id: 'act_002_4',
        fecha: '2023-02-15',
        descripcion: 'Audiencia de pruebas',
        resumen: 'Se practicaron las pruebas testimoniales y documentales',
        urgencia: 'alta',
        documento: '/documentos/audiencia_002.pdf'
      },
      {
        id: 'act_002_5',
        fecha: '2023-05-30',
        descripcion: 'Sentencia de primera instancia',
        resumen: 'Fallo favorable para el demandante. Se ordena reintegro y pago de salarios',
        urgencia: 'alta',
        documento: '/documentos/sentencia_002.pdf'
      }
    ]
  },
  {
    id: 'proc_003',
    radicado: '2023-00789',
    juzgado: 'Juzgado 5 Civil Municipal',
    fechaInicio: '2023-01-25',
    estado: 'Activo',
    empresa: 'Empresa ABC S.A.S.',
    nit: '901.456.789-0',
    partes: {
      demandante: 'Empresa ABC S.A.S.',
      demandado: 'Inquilino Local Comercial'
    },
    tipo: 'Restitución de inmueble arrendado',
    actuaciones: [
      {
        id: 'act_003_1',
        fecha: '2023-01-25',
        descripcion: 'Presentación de demanda',
        resumen: 'Se solicita la restitución del inmueble por mora en el canon de arrendamiento',
        urgencia: 'media',
        documento: '/documentos/demanda_003.pdf'
      },
      {
        id: 'act_003_2',
        fecha: '2023-02-20',
        descripcion: 'Auto admisorio',
        resumen: 'Se admite la demanda y se ordena notificación al demandado',
        urgencia: 'baja',
        documento: '/documentos/auto_003.pdf'
      }
    ]
  }
];

// Alertas simuladas
export const mockAlertas: Alerta[] = [
  {
    id: 'alerta_001',
    tipo: 'Audiencia Próxima',
    fecha: '2023-06-15',
    procesoId: 'proc_002',
    procesoRadicado: '2022-00456',
    accionSugerida: 'Preparar argumentación para audiencia de apelación',
    leida: false
  },
  {
    id: 'alerta_002',
    tipo: 'Término Vencimiento',
    fecha: '2023-06-10',
    procesoId: 'proc_001',
    procesoRadicado: '2023-00123',
    accionSugerida: 'Presentar alegatos de conclusión antes del vencimiento',
    leida: true
  },
  {
    id: 'alerta_003',
    tipo: 'Requerimiento Juzgado',
    fecha: '2023-06-05',
    procesoId: 'proc_003',
    procesoRadicado: '2023-00789',
    accionSugerida: 'Responder al requerimiento del juzgado solicitando pruebas adicionales',
    leida: false
  }
];

// Estadísticas simuladas para el dashboard
export const mockEstadisticas = {
  totalProcesosActivos: 3,
  alertasUrgentes: 2,
  proximasAudiencias: 1,
  procesosPorTipo: {
    'Ejecutivo Contractual': 1,
    'Laboral': 1,
    'Restitución': 1
  },
  estadosProcesos: {
    'Activo': 3,
    'Terminado': 0,
    'Suspendido': 0
  }
};

// Funciones de búsqueda simuladas
export const buscarProcesosPorNit = (nit: string): Proceso[] => {
  return mockProcesos.filter(proceso => proceso.nit === nit);
};

export const buscarProcesosPorEmpresa = (empresa: string): Proceso[] => {
  return mockProcesos.filter(
    proceso => proceso.empresa.toLowerCase().includes(empresa.toLowerCase())
  );
};

export const buscarProcesoPorId = (id: string): Proceso | undefined => {
  return mockProcesos.find(proceso => proceso.id === id);
};

export const buscarProcesoPorRadicado = (radicado: string): Proceso | undefined => {
  return mockProcesos.find(proceso => proceso.radicado === radicado);
};

export const obtenerAlertasPendientes = (): Alerta[] => {
  return mockAlertas.filter(alerta => !alerta.leida);
};
