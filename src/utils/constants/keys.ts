export interface PlayerKeys {
  moveLeft: string;
  moveRight: string;
  confirmationButton: string;
}

export const PLAYER_KEYS: Record<'player1' | 'player2', PlayerKeys> = {
  player1: {
    moveLeft: 'ArrowLeft',
    moveRight: 'ArrowRight',
    confirmationButton: 'Enter',
  },
  player2: {
    moveLeft: 'a', // 'a' key
    moveRight: 'z', // 'z' key
    confirmationButton: 't', // 't' key
  },
};
