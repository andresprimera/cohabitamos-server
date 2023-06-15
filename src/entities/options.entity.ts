import { modelOptions, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: { collection: 'options' },
})
export class OptionsEntity {
  _id: Types.ObjectId;

  @prop({ required: true, default: ['Activo', 'Suspendido', 'Cerrado'] })
  accountStates: string[];

  @prop({
    required: true,
    default: ['Abierto', 'Cerrado', 'En curso', 'Esperando respuesta'],
  })
  requirementStates: string[];

  @prop({ required: true, default: ['Residente', 'Retirado', 'Visitante'] })
  status: string[];

  @prop({ required: true, default: ['Perro', 'Gato'] })
  petKind: string[];

  @prop({ required: true, default: ['Apto', 'Casa', 'Local'] })
  unitTypes: string[];

  @prop({
    required: true,
    default: ['Propietario', 'Arrendatario', 'Residente', 'Visitante'],
  })
  userConditions: string[];
}
