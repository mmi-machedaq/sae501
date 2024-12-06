'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    canvas: HTMLCanvasElement;
  }
}

const TIME_LIMIT = 60;

const Pong = () => {
  const router = useRouter();
  const [gameEnded, setGameEnded] = useState(false);

  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [timer, setTimer] = useState({ timerdisplay: 0 });

  useEffect(() => {
    const canvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Variables for the ball
    let ballX = canvasWidth / 2;
    let ballY = canvasHeight / 2;
    const initialBallSpeed = 4;
    let ballSpeedX = initialBallSpeed;
    let ballSpeedY = initialBallSpeed;

    // Variables for the paddles
    const paddleWidth = 10;
    const paddleHeight = 80;

    // Left paddle
    let paddleLeftY = canvasHeight / 2 - paddleHeight / 2;
    const paddleLeftX = 30;

    // Right paddle
    let paddleRightY = canvasHeight / 2 - paddleHeight / 2;
    const paddleRightX = canvasWidth - 40;

    // Paddle speed
    const paddleSpeed = 6;
    let paddleLeftDirection = 0;
    let paddleRightDirection = 0;

    // Score variables
    let player1Score = 0;
    let player2Score = 0;

    // Timer variables
    let timeRemaining = TIME_LIMIT;
    let timerInterval: NodeJS.Timeout | null = null;
    let isOvertime = false;

    // Handle keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z') paddleLeftDirection = -1;
      if (e.key === 's') paddleLeftDirection = 1;
      if (e.key === 'ArrowUp') paddleRightDirection = -1;
      if (e.key === 'ArrowDown') paddleRightDirection = 1;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'z' || e.key === 's') paddleLeftDirection = 0;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
        paddleRightDirection = 0;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Update paddle positions
    const updatePaddlePosition = () => {
      paddleLeftY += paddleLeftDirection * paddleSpeed;
      paddleRightY += paddleRightDirection * paddleSpeed;

      paddleLeftY = Math.max(
        0,
        Math.min(canvasHeight - paddleHeight, paddleLeftY),
      );
      paddleRightY = Math.max(
        0,
        Math.min(canvasHeight - paddleHeight, paddleRightY),
      );
    };

    // Update ball position
    const updateBallPosition = () => {
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      if (ballY <= 0 || ballY >= canvasHeight) {
        ballSpeedY *= -1;
      }

      if (
        ballX <= paddleLeftX + paddleWidth &&
        ballY >= paddleLeftY &&
        ballY <= paddleLeftY + paddleHeight
      ) {
        ballSpeedX *= -1;
        ballX = paddleLeftX + paddleWidth;
        accelerateBall();
      }

      if (
        ballX >= paddleRightX - paddleWidth &&
        ballY >= paddleRightY &&
        ballY <= paddleRightY + paddleHeight
      ) {
        ballSpeedX *= -1;
        ballX = paddleRightX - paddleWidth;
        accelerateBall();
      }

      if (ballX <= 0) {
        player2Score++;
        resetBall();
      } else if (ballX >= canvasWidth) {
        player1Score++;
        resetBall();
      }
    };

    // Accelerate ball
    const accelerateBall = () => {
      ballSpeedX *= 1.05;
      ballSpeedY *= 1.05;
    };

    // Reset ball position
    const resetBall = () => {
      ballX = canvasWidth / 2;
      ballY = canvasHeight / 2;
      if (!isOvertime) {
        ballSpeedX = initialBallSpeed * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = initialBallSpeed * (Math.random() > 0.5 ? 1 : -1);
      }
    };

    // Draw field
    const drawField = () => {
      ctx.fillStyle = '#DAECFB';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.strokeStyle = '#6A6760';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2, 0);
      ctx.lineTo(canvasWidth / 2, canvasHeight);
      ctx.stroke();
    };

    // Draw paddle
    const drawPaddle = (x: number, y: number) => {
      ctx.fillStyle = '#1f1607';
      ctx.fillRect(x, y, paddleWidth, paddleHeight);
    };

    // Draw ball
    const drawBall = (x: number, y: number) => {
      ctx.fillStyle = '#1f1607';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    // Check for game end
    const checkGameEnd = () => {
      if (timeRemaining <= 0 && !gameEnded) {
        isOvertime = true;
        if (player1Score !== player2Score) {
          clearInterval(timerInterval!); // Stop the timer
          setGameEnded(true);
          storeScores();
          router.push('/serve-drinks-1');
        }
      }
    };

    // Store scores in localStorage
    const storeScores = () => {
      localStorage.setItem('player1Score', player1Score.toString());
      localStorage.setItem('player2Score', player2Score.toString());
    };

    // Gérer les scores
    const DisplayScores = () => {
      setScore({ player1: player1Score, player2: player2Score });
    };

    // Gérer les scores
    const DisplayTimer = () => {
      setTimer({ timerdisplay: timeRemaining });
    };

    // Main game loop
    const gameLoop = () => {
      if (gameEnded) return;

      drawField();
      drawPaddle(paddleLeftX, paddleLeftY);
      drawPaddle(paddleRightX, paddleRightY);
      drawBall(ballX, ballY);

      DisplayScores();
      DisplayTimer();

      updatePaddlePosition();
      updateBallPosition();

      requestAnimationFrame(gameLoop);
    };

    // Timer countdown
    const startTimer = () => {
      timerInterval = setInterval(() => {
        timeRemaining--;
        checkGameEnd();
      }, 1000);
    };

    // Start the game
    startTimer();
    gameLoop();

    return () => {
      // Cleanup on component destruction
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [router, gameEnded]);

  return (
    <div>
      <div className='score'>
        <p>P1 Score: {score.player1}</p>
        <p>Timer: {timer.timerdisplay}s</p>
        <p>P2 Score: {score.player2}</p>
      </div>
      <canvas id='pongCanvas' width={1000} height={600}></canvas>
    </div>
  );
};

export default Pong;
