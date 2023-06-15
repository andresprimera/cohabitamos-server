import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class CreateOptionDto {
  @prop({ required: true, default: ['Activo', 'Suspendido', 'Cerrado'] })
  ACCOUNT_STATES: string[];

  @prop({
    required: true,
    default: ['Abierto', 'Cerrado', 'En curso', 'Esperando respuesta'],
  })
  REQUIREMENT_STATE: string[];

  @prop({ required: true, default: ['Residente', 'Retirado', 'Visitante'] })
  STATUS: string[];

  @prop({ required: true, default: ['Perro', 'Gato'] })
  PET_KIND: string[];

  @prop({ required: true, default: ['Apto', 'Casa', 'Local'] })
  UNIT_TYPES: string[];

  @prop({
    required: true,
    default: ['Propietario', 'Arrendatario', 'Residente', 'Visitante'],
  })
  USER_CONDITIONS: string[];
}
