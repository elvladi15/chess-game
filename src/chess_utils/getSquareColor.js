import { COLUMNS } from "../constants";

/*
The function getSquareColor gets the square color,
can either be dark square or light square, the color
itself is determined by the squareColor object.

Also receives column and row of the position and determine
square color based on parity of both column and row.
 */
export function getSquareColor([column, row], squareColor) {
  row = parseInt(row);
  const evenRow = row % 2 === 0;
  const evenColumn = COLUMNS.indexOf(column) % 2 === 0;

  return {
    isWhite: evenRow === evenColumn,
    color: evenRow === evenColumn ? squareColor.white : squareColor.black,
  };
}
