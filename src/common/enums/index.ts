export enum ROLE {
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
