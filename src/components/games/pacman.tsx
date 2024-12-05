'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type Position = { x: number; y: number };

const Pacman = () => {
  const router = useRouter();
  // Références pour le canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dimensions du jeu
  const canvasWidth = 1000;
  const canvasHeight = 600;
  const gridSize = 40;
  const pacmanSize = 20;
  const pacmanSpeed = 10;

  // États pour gérer la taille des Pacmans
  const [currentHalfSizeP1, setCurrentHalfSizeP1] = useState(pacmanSize / 1.75); // Initiale
  const [currentHalfSizeP2, setCurrentHalfSizeP2] = useState(pacmanSize / 1.75); // Initiale

  // État pour les entités
  const [maze, setMaze] = useState<number[][]>([]);
  const [pacman1, setPacman1] = useState<
    Position & { dirX: number; dirY: number }
  >({
    x: Math.floor(60 / gridSize) * gridSize + gridSize / 2,
    y: Math.floor(canvasHeight / 2 / gridSize) * gridSize + gridSize / 2,
    dirX: 0,
    dirY: 0,
  });

  const [pacman2, setPacman2] = useState<
    Position & { dirX: number; dirY: number }
  >({
    x: Math.floor((canvasWidth - 60) / gridSize) * gridSize + gridSize / 2,
    y: Math.floor(canvasHeight / 2 / gridSize) * gridSize + gridSize / 2,
    dirX: 0,
    dirY: 0,
  });
  const [points, setPoints] = useState<Position[]>([]);
  const [score, setScore] = useState({ player1: 0, player2: 0 });

  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  // Génération du labyrinthe
  const generateMaze = useCallback((): number[][] => {
    const rows = Math.floor(canvasHeight / gridSize);
    const cols = Math.floor(canvasWidth / gridSize);
    const newMaze = Array.from({ length: cols }, () => Array(rows).fill(1));

    const carvePath = (x: number, y: number) => {
      const directions = [
        { x: 0, y: -1 }, // Haut
        { x: 1, y: 0 }, // Droite
        { x: 0, y: 1 }, // Bas
        { x: -1, y: 0 }, // Gauche
      ];
      directions.sort(() => Math.random() - 0.5); // Mélange aléatoire

      for (const dir of directions) {
        const nx = x + dir.x * 2;
        const ny = y + dir.y * 2;

        if (
          nx > 0 &&
          ny > 0 &&
          nx < cols &&
          ny < rows &&
          newMaze[nx][ny] === 1
        ) {
          newMaze[x + dir.x][y + dir.y] = 0; // Casser le mur
          newMaze[nx][ny] = 0; // Casser le mur adjacent
          carvePath(nx, ny);
        }
      }
    };

    // Point de départ
    newMaze[1][1] = 0;
    carvePath(1, 1);

    // Ajout de ponts entre les chemins
    const addBridges = (maze: number[][], bridgeCount: number) => {
      let addedBridges = 0;

      while (addedBridges < bridgeCount) {
        // Sélection aléatoire d'un mur potentiel
        const x = Math.floor(Math.random() * cols);
        const y = Math.floor(Math.random() * rows);

        // Vérifier que c'est un mur et qu'il connecte deux couloirs
        if (
          maze[x][y] === 1 &&
          ((maze[x - 1]?.[y] === 0 && maze[x + 1]?.[y] === 0) || // Vertical
            (maze[x]?.[y - 1] === 0 && maze[x]?.[y + 1] === 0)) // Horizontal
        ) {
          maze[x][y] = 0; // Supprimer le mur pour créer un pont
          addedBridges++;
        }
      }
    };

    // Ajoute des ponts après la génération
    const bridgeCount = Math.floor((rows * cols) / 20); // Nombre de ponts basé sur la taille du labyrinthe
    addBridges(newMaze, bridgeCount);

    // Vérification de la connexion complète
    if (!isMazeFullyConnected(newMaze)) {
      return generateMaze(); // Si le labyrinthe n'est pas connecté, régénérer
    }

    return newMaze;
  }, []); // Stable grâce à useCallback

  // Vérifie la connexion complète du labyrinthe
  const isMazeFullyConnected = (maze: number[][]): boolean => {
    const rows = maze[0].length;
    const cols = maze.length;
    const visited = Array.from({ length: cols }, () => Array(rows).fill(false));

    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];

    const dfs = (x: number, y: number) => {
      if (
        x < 0 ||
        y < 0 ||
        x >= cols ||
        y >= rows ||
        visited[x][y] ||
        maze[x][y] === 1
      )
        return;
      visited[x][y] = true;
      for (const dir of directions) {
        dfs(x + dir.x, y + dir.y);
      }
    };

    dfs(1, 1);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (maze[i][j] === 0 && !visited[i][j]) return false;
      }
    }
    return true;
  };

  // Position libre aléatoire
  const getRandomFreePosition = (maze: number[][]): Position => {
    while (true) {
      const x = Math.floor(Math.random() * maze.length);
      const y = Math.floor(Math.random() * maze[0].length);
      if (maze[x][y] === 0) {
        return {
          x: x * gridSize + gridSize / 2,
          y: y * gridSize + gridSize / 2,
        };
      }
    }
  };

  const getFreePositionInColumn = (
    maze: number[][],
    column: number,
  ): Position => {
    while (true) {
      const y = Math.floor(Math.random() * maze[0].length);
      if (maze[column][y] === 0) {
        return {
          x: column * gridSize + gridSize / 2,
          y: y * gridSize + gridSize / 2,
        };
      }
    }
  };

  const generatePoints = useCallback(
    (maze: number[][], count: number): Position[] => {
      const points: Position[] = [];

      const isValidPosition = (x: number, y: number): boolean => {
        const distanceToPacman1 = Math.hypot(x - pacman1.x, y - pacman1.y);
        const distanceToPacman2 = Math.hypot(x - pacman2.x, y - pacman2.y);

        if (distanceToPacman1 < pacmanSize || distanceToPacman2 < pacmanSize) {
          return false; // Trop proche de Pac-Man
        }

        return !points.some((point) => point.x === x && point.y === y);
      };

      for (let i = 0; i < count; i++) {
        let newPoint: Position;
        do {
          newPoint = getRandomFreePosition(maze);
        } while (!isValidPosition(newPoint.x, newPoint.y));

        points.push(newPoint);
      }

      return points;
    },
    [pacman1.x, pacman1.y, pacman2.x, pacman2.y], // Dépend des positions de Pac-Man
  );

  const updatePacmanPosition = useCallback(() => {
    setPacman1((prev) => {
      const nextX = prev.x + prev.dirX * pacmanSpeed;
      const nextY = prev.y + prev.dirY * pacmanSpeed;

      const canMoveX = !checkCollision(nextX, prev.y, maze, currentHalfSizeP1);
      const canMoveY = !checkCollision(prev.x, nextY, maze, currentHalfSizeP1);

      // Si collision, résoudre l'emplacement
      const { x, y } = checkCollision(prev.x, prev.y, maze, currentHalfSizeP1)
        ? resolveOverlap(prev.x, prev.y, maze, currentHalfSizeP1)
        : { x: prev.x, y: prev.y };

      return {
        ...prev,
        x: canMoveX ? nextX : x,
        y: canMoveY ? nextY : y,
      };
    });

    setPacman2((prev) => {
      const nextX = prev.x + prev.dirX * pacmanSpeed;
      const nextY = prev.y + prev.dirY * pacmanSpeed;

      const canMoveX = !checkCollision(nextX, prev.y, maze, currentHalfSizeP2);
      const canMoveY = !checkCollision(prev.x, nextY, maze, currentHalfSizeP2);

      // Si collision, résoudre l'emplacement
      const { x, y } = checkCollision(prev.x, prev.y, maze, currentHalfSizeP2)
        ? resolveOverlap(prev.x, prev.y, maze, currentHalfSizeP2)
        : { x: prev.x, y: prev.y };

      return {
        ...prev,
        x: canMoveX ? nextX : x,
        y: canMoveY ? nextY : y,
      };
    });
  }, [maze, pacmanSpeed, currentHalfSizeP1, currentHalfSizeP2]);

  const checkPointsCollection = useCallback(() => {
    setPoints((prevPoints) => {
      const remainingPoints = prevPoints.filter((point) => {
        const distanceToPacman1 = Math.hypot(
          point.x - pacman1.x,
          point.y - pacman1.y,
        );
        const distanceToPacman2 = Math.hypot(
          point.x - pacman2.x,
          point.y - pacman2.y,
        );

        let pointCollected = false;

        if (distanceToPacman1 < pacmanSize / 1.5) {
          setScore((prevScore) => ({
            ...prevScore,
            player1: prevScore.player1 + 1,
          }));
          pointCollected = true;
        }

        if (distanceToPacman2 < pacmanSize / 1.5) {
          setScore((prevScore) => ({
            ...prevScore,
            player2: prevScore.player2 + 1,
          }));
          pointCollected = true;
        }

        return !pointCollected;
      });

      return remainingPoints;
    });
  }, [pacman1.x, pacman1.y, pacman2.x, pacman2.y]);

  const checkCollision = (
    x: number,
    y: number,
    maze: number[][],
    currentHalfSize: number,
  ): boolean => {
    // Coordonner les bords de Pac-Man avec la taille actuelle
    const left = Math.floor((x - currentHalfSize) / gridSize);
    const right = Math.floor((x + currentHalfSize) / gridSize);
    const top = Math.floor((y - currentHalfSize) / gridSize);
    const bottom = Math.floor((y + currentHalfSize) / gridSize);

    // Vérifie si Pac-Man touche un mur
    if (maze[left] && maze[left][top] === 1) return true;
    if (maze[right] && maze[right][top] === 1) return true;
    if (maze[left] && maze[left][bottom] === 1) return true;
    if (maze[right] && maze[right][bottom] === 1) return true;

    return false;
  };

  const resolveOverlap = (
    x: number,
    y: number,
    maze: number[][],
    currentHalfSize: number,
  ): Position => {
    const left = Math.floor((x - currentHalfSize) / gridSize);
    const right = Math.floor((x + currentHalfSize) / gridSize);
    const top = Math.floor((y - currentHalfSize) / gridSize);
    const bottom = Math.floor((y + currentHalfSize) / gridSize);

    // Repositionner dans un couloir libre
    if (maze[left]?.[top] === 0)
      return {
        x: left * gridSize + gridSize / 2,
        y: top * gridSize + gridSize / 2,
      };
    if (maze[right]?.[top] === 0)
      return {
        x: right * gridSize + gridSize / 2,
        y: top * gridSize + gridSize / 2,
      };
    if (maze[left]?.[bottom] === 0)
      return {
        x: left * gridSize + gridSize / 2,
        y: bottom * gridSize + gridSize / 2,
      };
    if (maze[right]?.[bottom] === 0)
      return {
        x: right * gridSize + gridSize / 2,
        y: bottom * gridSize + gridSize / 2,
      };

    // Si aucune position valide trouvée, retourner la position actuelle (cas extrême)
    return { x, y };
  };

  // Appeler cette fonction lorsque le jeu commence
  const startGame = () => {
    setGameStarted(true);
  };

  // Vérification de fin de partie
  const checkGameEnd = useCallback(() => {
    if (
      score.player1 !== 0 &&
      score.player2 !== 0 &&
      gameStarted &&
      points.length === 0 &&
      !gameEnded
    ) {
      setGameEnded(true);
      router.push('/serve-drinks'); // Redirection en cas de victoire
    }
  }, [
    score.player1,
    score.player2,
    gameStarted,
    points.length,
    gameEnded,
    router,
  ]);

  // Dessine le jeu
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Dessiner le labyrinthe
    maze.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 1) {
          ctx.fillStyle = 'black';
          ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
        }
      });
    });

    // Dessiner les points
    ctx.fillStyle = 'black';
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, pacmanSize / 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Dessiner Pac-Man 1
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman1.x, pacman1.y, currentHalfSizeP1 * 1.75, 0, Math.PI * 2);
    ctx.fill();

    // Dessiner Pac-Man 2
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(pacman2.x, pacman2.y, currentHalfSizeP2 * 1.75, 0, Math.PI * 2);
    ctx.fill();
  }, [maze, points, pacman1, pacman2, currentHalfSizeP1, currentHalfSizeP2]);

  // Gestion des touches
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'z':
        setPacman1((prev) => ({ ...prev, dirX: 0, dirY: -1 }));
        break;
      case 's':
        setPacman1((prev) => ({ ...prev, dirX: 0, dirY: 1 }));
        break;
      case 'q':
        setPacman1((prev) => ({ ...prev, dirX: -1, dirY: 0 }));
        break;
      case 'd':
        setPacman1((prev) => ({ ...prev, dirX: 1, dirY: 0 }));
        break;

      case 'ArrowUp':
        setPacman2((prev) => ({ ...prev, dirX: 0, dirY: -1 }));
        break;
      case 'ArrowDown':
        setPacman2((prev) => ({ ...prev, dirX: 0, dirY: 1 }));
        break;
      case 'ArrowLeft':
        setPacman2((prev) => ({ ...prev, dirX: -1, dirY: 0 }));
        break;
      case 'ArrowRight':
        setPacman2((prev) => ({ ...prev, dirX: 1, dirY: 0 }));
        break;

      case 'e': // Si la touche E est enfoncée, réduire la taille de Pacman 1
        setCurrentHalfSizeP1(pacmanSize / 2.25);
        break;

      case 'i': // Si la touche I est enfoncée, réduire la taille de Pacman 2
        setCurrentHalfSizeP2(pacmanSize / 2.25);
        break;
    }
  };

  // Arrêter le mouvement lorsque la touche est relâchée
  const handleKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'z':
      case 's':
      case 'q':
      case 'd':
        setPacman1((prev) => ({ ...prev, dirX: 0, dirY: 0 }));
        break;

      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        setPacman2((prev) => ({ ...prev, dirX: 0, dirY: 0 }));
        break;

      case 'e': // Si la touche E est relâchée, revenir à la taille normale pour Pacman 1
        setCurrentHalfSizeP1(pacmanSize / 1.75);
        break;

      case 'i': // Si la touche I est relâchée, revenir à la taille normale pour Pacman 2
        setCurrentHalfSizeP2(pacmanSize / 1.75);
        break;
    }
  };

  useEffect(() => {
    // Génère le labyrinthe et récupère les positions de départ pour Pac-Man
    const newMaze = generateMaze();
    setMaze(newMaze);

    const pacman1StartPosition = getFreePositionInColumn(newMaze, 2); // Colonne 2 pour le joueur 1
    setPacman1({
      ...pacman1StartPosition,
      dirX: 0,
      dirY: 0,
    });

    const pacman2StartPosition = getFreePositionInColumn(
      newMaze,
      newMaze.length - 2,
    ); // Avant-dernière colonne pour le joueur 2
    setPacman2({
      ...pacman2StartPosition,
      dirX: 0,
      dirY: 0,
    });

    setPoints(generatePoints(newMaze, 39)); // 39 points à générer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Exécuter une seule fois

  // Utilisation du cycle de jeu
  useEffect(() => {
    const interval = setInterval(() => {
      updatePacmanPosition();
      checkPointsCollection();
      drawGame();
      startGame();
      checkGameEnd();
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [updatePacmanPosition, checkPointsCollection, drawGame, checkGameEnd]); // Utiliser uniquement des fonctions stables

  // Gestion des événements de clavier
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div>
      <div className='score'>
        <p>P1 Score: {score.player1 * 5}</p>
        <p>P2 Score: {score.player2 * 5}</p>
      </div>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
};

export default Pacman;
