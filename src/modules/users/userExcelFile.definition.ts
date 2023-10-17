import { UNIT_TYPES, USER_CONDITION, DOCUMENT_TYPES } from 'src/common/enums';
import { ExcelHeader } from 'src/common/interfaces';

const worksheetNames = ['USUARIOS NUEVOS', 'ACTUALIZACION DE USUARIOS'];

const headers: ExcelHeader[][] = [
  [
    { title: 'NIT-EDIFICIO', type: 'number' },
    { title: 'NOMBRE-TORRE', type: 'string' },
    {
      title: 'TIPO-UNIDAD',
      type: 'enum',
      enum: Object.values(UNIT_TYPES),
    },
    { title: 'NUMERO', type: 'string' },
    { title: 'CONDICION', type: 'enum', enum: Object.values(USER_CONDITION) },
    { title: 'EMAIL', type: 'string' },
    { title: 'PRIMER-NOMBRE', type: 'string' },
    { title: 'PRIMER-APELLIDO', type: 'string' },
    { title: 'TELEFONO', type: 'string' },
    { title: 'WHATSAPP', type: 'string' },
    {
      title: 'TIPO-DOCUMENTO',
      type: 'enum',
      enum: Object.values(DOCUMENT_TYPES),
    },
    { title: 'NUMERO-DOCUMENTO', type: 'string' },
  ],
  [
    { title: 'NIT-EDIFICIO', type: 'number' },
    { title: 'NOMBRE-TORRE', type: 'string' },
    {
      title: 'TIPO-UNIDAD',
      type: 'enum',
      enum: Object.values(UNIT_TYPES),
    },
    { title: 'NUMERO', type: 'string' },
    { title: 'CONDICION', type: 'enum', enum: Object.values(USER_CONDITION) },
    { title: 'EMAIL', type: 'string' },
    { title: 'PRIMER-NOMBRE', type: 'string' },
    { title: 'PRIMER-APELLIDO', type: 'string' },
    { title: 'TELEFONO', type: 'string' },
    { title: 'WHATSAPP', type: 'string' },
  ],
];

export { worksheetNames, headers };
