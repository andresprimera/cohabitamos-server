import { BadRequestException } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { unlinkSync } from 'fs';
import { ExcelHeader } from 'src/common/interfaces';

export const utils = {
  prepareSearchDates: (date: string) => {
    const parsedStartingDate = new Date(date);

    if (isNaN(parsedStartingDate.getTime())) {
      throw new BadRequestException('Invalid date format.');
    }

    // Adjusting date to UTC-5
    const adjustedDate = new Date(
      parsedStartingDate.getTime() + 5 * 60 * 60000,
    );

    return adjustedDate;
  },
};

export const excelUtils = {
  worksheets: (worksheetNames: string[], workbook: Workbook) => {
    worksheetNames.map((worksheetName, index) => {
      const worksheet = workbook.getWorksheet(index + 1);

      if (worksheet?.name !== worksheetName) {
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
      const titles = worksheet?.getRow(1).values as string[];

      titles.shift();

      headerByWorkbook.map((header, columnIndex: number) => {
        if (header?.title !== titles[columnIndex]) {
          throw new BadRequestException(
            `Falta la columna ${header.title} de la hoja ${
              worksheetIndex + 1
            }, o las columnas están ordenadas de manera incorrecta`,
          );
        }
      });
    });

    return true;
  },
  cellTypes: (
    header: ExcelHeader,
    value: any,
    row: number,
    worksheetName: string,
  ) => {
    const castedValue: any =
      header.type === 'number' ? Number(value) : String(value);

    let error = null;

    if (header.type === 'number' && isNaN(castedValue))
      error = `En la hoja ${worksheetName}, el valor de la columna ${header.title}: ${value} no es un número válido en la fila ${row}. En caso de ser números, asegurese de que no cuente con caracteres especiales como puntos o comas.`;

    if (header.type === 'enum' && !header?.enum)
      throw new Error(
        `Enum is missing in the header definition for ${header.title} of the worksheet ${worksheetName}`,
      );

    if (
      header.type === 'enum' &&
      header.enum &&
      !header.enum.includes(castedValue)
    )
      error = `El valor ${
        header.title
      }: ${value} en la fila ${row} no es uno de los permitidos: ${header.enum.join(
        ', ',
      )}`;

    return error;
  },
  extractData: async (
    filePath: string,
    worksheetNames: string[],
    headers: ExcelHeader[][],
  ) => {
    const workbook = new Workbook();
    await workbook?.xlsx.readFile(filePath);
    unlinkSync(filePath);

    //************** VALIDATING WORKSHEETS ********************************/

    const areWorksheetsValid = excelUtils.worksheets(worksheetNames, workbook);

    //************** VALIDATING HEADERS ********************************/

    const areHeadersValid = excelUtils.headers(headers, workbook);

    //************** EXTRACTING DATA ***********************************/

    if (areWorksheetsValid && areHeadersValid) {
      let thereAreErrors = false;
      const response: any = {};

      worksheetNames.map((worksheetName, index) => {
        const worksheet = workbook?.getWorksheet(index + 1);

        let data: any = [];
        const errors: string[] = [];

        worksheet?.eachRow((row: any, rowNumber: number) => {
          if (rowNumber === 1) return; // Skipping headers

          const values = row.values;
          values.shift();

          const jsonRow: any = {};

          headers[index].map((header, index) => {
            const error = excelUtils.cellTypes(
              header,
              values[index],
              rowNumber,
              worksheetName,
            );

            if (error) {
              errors.push(error);
              thereAreErrors = true;
            }

            jsonRow[header.title] = values[index];
          });

          data.push(jsonRow);
        });

        data = errors.length > 0 ? [] : data; //NOT SENDING DATA IN CASE OF ERRORS

        response[worksheetName] = { data, errors };
      });

      return {
        worksheets: response,
        success: !thereAreErrors,
        message: thereAreErrors
          ? 'Existen errores de validación'
          : 'Documento procesado correctamente',
      };
    }
  },
};
