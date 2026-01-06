import React, { useEffect, useState } from 'react';
import { socket } from '../socket';
import { Box, Button, Typography, Stack } from '@mui/material';

type PlayerState = {
    id: string;
    name: string;
    rackSize: number;
};

type PublicState = {
    players: PlayerState[];
    poolSize: number;
};

type TilePlacement = { letter: string; x: number; y: number };

const BOARD_SIZE = 15;

const GamePage: React.FC = () => {
    const [state, setState] = useState<PublicState>({ players: [], poolSize: 0 });
    const [rack, setRack] = useState<string[]>([]);
    const [placements, setPlacements] = useState<TilePlacement[]>([]);
    const [board, setBoard] = useState<Record<string, string>>({});
    const [username] = useState(localStorage.getItem('username') || 'Player');
    const [feedback, setFeedback] = useState<string>('');

    useEffect(() => {;
        if (!socket.connected) {
            socket.connect();
        }

        setRack(['A', 'P', 'P', 'L',' E']);

        socket.on('connect', () => {
            console.log('Connected:', socket.id);
            const username = localStorage.getItem('username') || 'Player';
            socket.emit('join', username);
        });

        socket.on('state', (data: PublicState) => {
            setState(data);
        });

        socket.on('privateState', (data: { rack: string[]; board: Record<string, string> }) => {
            setRack(data.rack);
            setBoard(data.board);
        });

        socket.on('playResult', (data: { success: boolean; reason?: string }) => {
            if (!data.success && data.reason) {
                setFeedback(data.reason);
            } else {
                setFeedback('');
            }
        });

        return () => {
            socket.off('connect');
            socket.off('state');
            socket.off('privateState');
            socket.off('playResult');
        };
    }, []);

    // drag handlers
    const handleDragStart = (letter: string, index: number) => (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('letter', letter);
        e.dataTransfer.setData('rackIndex', index.toString());
    };

    const handleDrop = (x: number, y: number) => (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const letter = e.dataTransfer.getData('letter');
        const rackIndex = Number(e.dataTransfer.getData('rackIndex'));

        if (board[`${x},${y}`] || placements.find(p => p.x === x && p.y === y)) return;

        setPlacements([...placements, { letter, x, y }]);
        setRack(prev => prev.filter((_, i) => i !== rackIndex));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // submit placed tiles to backend
    const handleSubmit = () => {
        if (placements.length === 0) return;
        socket?.emit('playWord', { placements });
        setPlacements([]);
        setFeedback('');
    };

    const handlePeel = () => {
        socket?.emit('peel');
    };

    const handleDump = (letter: string) => {
        socket?.emit('dump', { letter });
    };

    return (
        <Box 
            sx= {{ 
                minHeight: '100vh', 
                p: 2, 
                bgcolor: '#fff8bd', 
                fontFamily: '"JetBrains Mono", monospace' 
            }}
        >
            <Typography
                variant="h4" 
                sx= {{ mb: 2 }}
            >
                Game Page - {username}
            </Typography>

        <Typography 
            variant="h6"
        >
            Players:
        </Typography>

        {state.players.map(p => (
            <Typography 
                key={p.id}>{p.name} - {p.rackSize} tiles
            </Typography>
        ))}

        <Typography 
            variant="h6" 
            sx= {{
                 mt: 2 
            }}
        >
            Your Rack:
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {rack.map((tile, i) => (
            <Box
                key={i}
                draggable
                onDragStart={handleDragStart(tile, i)}
                sx= {{
                width: 40,
                height: 40,
                bgcolor: '#ffe066',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                border: '1px solid #362023',
                borderRadius: 2,
                cursor: 'grab',
                }}
            >
                {tile}
            </Box>
        ))}
        </Stack>

        <Typography 
            variant="h6" 
            sx= {{ 
                mt: 2 
            }}
        >
            Board:
        </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 40px)`,
          gap: 1,
          mb: 2,
        }}
      >
        {Array.from({ length: BOARD_SIZE }).map((_, y) =>
          Array.from({ length: BOARD_SIZE }).map((_, x) => {
            const key = `${x},${y}`;
            const placedTile = placements.find(p => p.x === x && p.y === y)?.letter;
            return (
              <Box
                key={key}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#fff3c4',
                  border: '1px solid #362023',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}
                onDrop={handleDrop(x, y)}
                onDragOver={handleDragOver}
              >
                {placedTile || board[key]}
              </Box>
            );
          })
        )}
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>Submit Move</Button>
        <Button variant="contained" onClick={handlePeel}>Peel</Button>
      </Stack>

      <Typography 
      sx= {{ 
        mb: 1 
        }}
        >
            Tiles remaining: {state.poolSize}
        </Typography>
      {feedback && <Typography color="error">{feedback}</Typography>}
    </Box>
  );
};


export default GamePage;