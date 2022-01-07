/*
the function getForwardIncrementAndLastRow will return 
an object containing the increment of a pawn moving 1
square forward, depending on its color, and also returns
the last row of that pawn.  
 */
export function getForwardIncrementAndLastRow(isWhitePawn) {
  let forwardIncrement;
  let lastRow;

  if (isWhitePawn) {
    forwardIncrement = 1;
    lastRow = 8;
  } else {
    forwardIncrement = -1;
    lastRow = 1;
  }
  return {
    forwardIncrement,
    lastRow,
  };
}
