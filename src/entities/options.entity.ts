import { Severity, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { collection: 'options' },
  options: { allowMixed: Severity.ALLOW },
})
export class OptionsEntity {
  @prop({ default: ['Activo', 'Suspendido', 'Cerrado'] })
  ACCOUNT_STATES: string[];

  @prop({
    default: ['Abierto', 'Cerrado', 'En curso', 'Esperando respuesta'],
  })
  REQUIREMENT_STATE: string[];

  @prop({ default: ['Residente', 'Retirado', 'Visitante'] })
  STATUS: string[];

  @prop({ default: ['Perro', 'Gato'] })
  PET_KIND: string[];

  @prop({ default: ['Apto', 'Casa', 'Local'] })
  UNIT_TYPES: string[];

  @prop({
    default: ['Propietario', 'Arrendatario', 'Residente', 'Visitante'],
  })
  USER_CONDITIONS: string[];

  @prop({
    default: [
      'Cédula de Ciudadanía',
      'Cédula de Extranjería',
      'Pasaporte',
      'Permiso Especial',
    ],
  })
  DOCUMENT_TYPES: string[];
}
