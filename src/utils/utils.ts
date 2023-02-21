import { readBinaryFile, writeBinaryFile } from "@tauri-apps/api/fs";
import { open, save } from "@tauri-apps/api/dialog";
import { read, utils, write } from "xlsx";
import _ from "lodash";

import { File, ProcessFile, IGraftState } from "../interfaces/interfaces";
import { createSecureContext } from "tls";

import { Store } from "tauri-plugin-store-api";

// const filters = [
//   { name: "Excel Binary Workbook", extensions: ["xlsb"] },
//   { name: "Excel Workbook", extensions: ["xlsx"] },
//   { name: "Excel 97-2004 Workbook", extensions: ["xls"] },
//   // ... other desired formats ...
// ];

// async function saveFile(wb) {
//   /* show save file dialog */
//   const selected = await save({
//     title: "Save to Spreadsheet",
//     filters
//   });

//   /* Generate workbook */
//   const bookType = selected.slice(selected.lastIndexOf(".") + 1);
//   const d = write(wb, { type: "buffer", bookType });

//   /* save data to file */
//   await writeBinaryFile(selected, d);
// }

// async function openFile() {
//   /* show open file dialog */
//   const selected = await open({
//     title: "Open Spreadsheet",
//     multiple: false,
//     directory: false,
//     filters
//   });

//   /* read data into a Uint8Array */
//   const d = await readBinaryFile(selected);

//   /* parse with SheetJS */
//   const wb = read(d);
//   return wb;
// }

const COLORS = [
  "#ff549d",
  "#5612eb",
  "#47f5fa",
  "#b9bdab",
  "#78a15e",
  "#f61978",
  "#dca460",
  "#9d94e0",
  "#86e4a4",
  "#b8ffc0",
  "#ffbe1e",
  "#d65936",
  "#618374",
  "#c97871",
  "#9027e7",
  "#feb300",
  "#922f82",
  "#417f97",
  "#4153d2",
  "#eb87f5",
];

const COLUMNS_IMPEDANCE = ["Time", "Frequency", "Module", "Fase", "ZR", "ZI"];

const COLUMNS_VOLTAMETER = ["Time", "Voltage", "Current"];

export { COLORS, COLUMNS_IMPEDANCE, COLUMNS_VOLTAMETER };
