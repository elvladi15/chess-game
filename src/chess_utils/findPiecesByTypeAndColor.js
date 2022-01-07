/* 
The function findPiecesByTypeAndColor, as its name suggests,
returns an array of piece objects among a given pieces array that 
coincides with passed type and color. If no piece is found,
will return an empty array.
*/
export function findPiecesByTypeAndColor(type, isWhite, pieces) {
  const matchingPieces = pieces.filter(piece => piece.type === type && piece.isWhite === isWhite);
  return matchingPieces;
}
