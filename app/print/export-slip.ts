import { SCHOOL } from "@/lib/config";

import { BLANK_ROWS, COLUMNS } from "./print-slip";

export async function createSlipWorkbook() {
  const { Workbook } = await import("exceljs");
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet("Borrowers Slip", {
    pageSetup: {
      paperSize: 9,
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 1,
      horizontalCentered: true,
    },
  });

  [28, 32, 20, 20].forEach((width, i) => {
    sheet.getColumn(i + 1).width = width;
  });

  [SCHOOL.name, SCHOOL.address, "", SCHOOL.office, "", SCHOOL.title].forEach(
    (text, i) => {
      const row = i + 1;
      sheet.mergeCells(row, 1, row, 4);
      const cell = sheet.getCell(row, 1);
      cell.value = text;
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.font = { name: "Arial", size: row === 6 ? 16 : 11, bold: row !== 2 };
      sheet.getRow(row).height = text ? 28 : 10;
    },
  );

  const header = sheet.getRow(8);
  header.values = COLUMNS;
  header.height = 36;
  for (let row = 8; row <= 8 + BLANK_ROWS; row++) {
    if (row > 8) sheet.getRow(row).height = 30;
    for (let column = 1; column <= 4; column++) {
      const cell = sheet.getCell(row, column);
      cell.font = { name: "Arial", size: 11, bold: row === 8 };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      const border = { style: "thin" as const, color: { argb: "FF1E293B" } };
      cell.border = { top: border, bottom: border, left: border, right: border };
      if (column >= 3 && row > 8) cell.numFmt = "mm/dd/yyyy";
    }
  }
  sheet.pageSetup.printArea = `A1:D${8 + BLANK_ROWS}`;
  return workbook;
}

export async function downloadSlipExcel() {
  const workbook = await createSlipWorkbook();
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([new Uint8Array(buffer)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "borrowers-slip.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
