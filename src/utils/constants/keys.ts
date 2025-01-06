export interface PlayerKeys {
  moveUp: string;
  moveDown: string;
  moveLeft: string;
  moveRight: string;
  confirmationButton: string;
}

export const PLAYER_KEYS: Record<'player1' | 'player2', PlayerKeys> = {
  player1: {
    moveUp: 'ArrowUp',
    moveDown: 'ArrowDown',
    moveLeft: 'ArrowLeft',
    moveRight: 'ArrowRight',
    confirmationButton: 'Enter',
  },
  player2: {
    moveUp: 'q', // 'q' key
    moveDown: 'w', // 'w' key
    moveLeft: 'a', // 'a' key
    moveRight: 'z', // 'z' key
    confirmationButton: 't', // 't' key
  },
};
