export enum ROLE {
  SUPER_ADMIN = 'superadmin',
  ADMIN = 'administrador',
  USER = 'usuario',
  OPERATOR = 'operador',
}
export enum DOC_TYPE {
  CC = 'CÉDULA DE CIUDADANÍA',
  CE = 'CÉDULA DE EXTRANJERÍA',
  PA = 'PASAPORTE',
  TI = 'TARJETA DE IDENTIDAD',
  PTP = 'PERMISO TEMPORAL DE PERMANENCIA',
  UNASSIGNED = '',
}

export enum STATUS {
  VISITOR = 'Visitante',
  PERMANENT = 'Residente',
  RETIRED = 'Retirado',
}

export enum ACCOUNT_STATUS {
  ACTIVE = 'Activo',
  SUSPENDED = 'Suspendido',
  CLOSED = 'Cerrado',
}

export enum USER_CONDITION {
  OWNER = 'Propietario',
  TENANT = 'Arrendatario',
  RESIDENT = 'Residente',
}

export enum REQUIREMENT_STATE {
  OPEN = 'Abierto',
  CLOSED = 'Cerrado',
  IN_PROGRESS = 'En curso',
  ON_HOLD = 'Esperando respuesta',
}

export enum VISITOR_CONDITION {
  MAIN_GUEST = 'Responsable',
  AUTHORIZED = 'Autorizado',
  HOME_ASSISTANT = 'Asistente de hogar',
  RELATIVE = 'Familiar / Amigo',
  PROVIDER = 'Proveedor',
}
