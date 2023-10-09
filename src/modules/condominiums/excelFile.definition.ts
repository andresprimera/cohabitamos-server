import { UNIT_TYPES } from 'src/common/enums';
import { ExcelHeader } from 'src/common/interfaces';

const worksheetNames = ['DATOS DE COPROPIEDAD', 'TORRES', 'UNIDADES'];

const headers: ExcelHeader[][] = [
  [
    { title: 'NOMBRE', type: 'string' },
    { title: 'DIRECCION', type: 'string' },
    { title: 'NIT', type: 'number' },
    { title: 'DIGITO-VERIFICACION', type: 'number' },
    { title: 'TELEFONO', type: 'string' },
    { title: 'CORREO-ADMINISTRACION', type: 'string' },
    { title: 'CANTIDAD-DE-TORRES', type: 'number' },
    { title: 'CANTIDAD-DE-UNIDADES', type: 'number' },
  ],
  [
    { title: 'NOMBRE-TORRE', type: 'string' },
    { title: 'CANTIDAD-DE-UNIDADES', type: 'number' },
  ],
  [
    { title: 'NOMBRE-TORRE', type: 'string' },
    {
      title: 'TIPO-UNIDAD',
      type: 'enum',
      enum: Object.values(UNIT_TYPES),
    },
    { title: 'NUMERO', type: 'string' },
  ],
];

export { worksheetNames, headers };
