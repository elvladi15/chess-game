/* 
The function findPieceByPosition, as its name suggests,
returns the piece object among a given pieces array that 
coincides with passed position. If no piece is found,
will return undefined.
*/
export function findPieceByPosition(position, pieces) {
  const piece = pieces.find(piece => piece?.position === position);
  return piece;
}
