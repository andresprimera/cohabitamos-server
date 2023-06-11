import { prop, modelOptions, mongoose } from '@typegoose/typegoose';
import { Severity } from '@typegoose/typegoose';

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
}

@modelOptions({
  schemaOptions: { collection: 'users', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class UserEntity {
  @prop({
    unique: true,
  })
  uid: string;
  @prop({})
  firtsName: string;
  @prop({})
  lastName: string;
  @prop({
    default: false,
  })
  active: boolean;
  @prop({ enum: ROLE, default: ROLE.USER })
  role: ROLE;
  @prop()
  account: string;
  @prop({
    trim: true,
    lowercase: true,
  })
  email: string;
  @prop({
    default: [],
  })
  phone: string[] | [];
  @prop()
  whatsapp: string;
  @prop({ enum: DOC_TYPE })
  docType: DOC_TYPE;
  @prop({})
  docNumber?: string;
  @prop({})
  nationality?: string;
}
