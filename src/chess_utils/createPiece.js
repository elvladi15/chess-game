export function createPiece(type, position, isWhite) {
  return {
    type,
    position,
    isWhite,
    didMove: false,
    availableSquares: [],
  };
}
