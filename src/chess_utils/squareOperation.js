import { COLUMNS } from "../constants";

/*
The function squareOperation returns the position after
a certain number of column and row increment have been
provided.

for example: squareOperation("e4",-3,1) will return "b5",
as -3 is provided in columnIncrement, suggests 3 columns
to the left, and 1 is provided in rowIncrement, suggests
1 row upwards.
 */
export function squareOperation(square, columnIncrement, rowIncrement) {
  let [column, row] = square;
  const columnPositionIndex = COLUMNS.indexOf(column);
  row = parseInt(row);

  if (columnPositionIndex + columnIncrement < 0 || columnPositionIndex + columnIncrement > 7)
    return;
  if (row + rowIncrement < 1 || row + rowIncrement > 8) return;
  return `${COLUMNS[columnPositionIndex + columnIncrement]}${row + rowIncrement}`;
}
