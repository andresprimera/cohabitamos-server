import { BadRequestException } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { ExcelHeader } from 'src/common/interfaces';

export const excelValidate = {
  worksheets: (worksheetNames: string[], workbook: Workbook) => {
    worksheetNames.map((worksheetName, index) => {
      const worksheet = workbook.getWorksheet(index + 1);

      if (worksheet.name !== worksheetName) {
        throw new BadRequestException(
          `Falta la hoja llamada ${worksheetName}, o el archivo está ordenado de manera incorrecta`,
        );
      }
    });
    return true;
  },
  headers: (headers: ExcelHeader[][], workbook: Workbook) => {
    headers.map((headerByWorkbook, worksheetIndex: number) => {
      const worksheet = workbook.getWorksheet(worksheetIndex + 1);
      const titles = worksheet.getRow(1).values as string[];

      titles.shift();

      headerByWorkbook.map((header, columnIndex: number) => {
        if (header.title !== titles[columnIndex]) {
          throw new BadRequestException(
            `Falta la columna ${header.title} de la hoja ${worksheetIndex}, o las columnas están ordenadas de manera incorrecta`,
          );
        }
      });
    });

    return true;
  },
  cellTypes: (header: ExcelHeader, value: any, row: number) => {
    const castedValue: any =
      header.type === 'number' ? Number(value) : String(value);

    let error = null;

    if (header.type === 'number' && isNaN(castedValue))
      error = `El valor de la columna ${header.title}: ${value} no es un número válido en la fila ${row}. En caso de ser números, asegurese de que no cuente con caracteres especiales como puntos o comas.`;

    return error;
  },
};
