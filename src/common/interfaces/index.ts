export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  path: string;
}

export interface ExcelHeader {
  title: string;
  type: string;
  enum?: string[];
}
