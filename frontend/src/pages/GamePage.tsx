import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
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

const GamePage: React.FC = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [state, setState] = useState<PublicState>({ players: [], poolSize: 0 });
    const [rack, setRack] = useState<string[]>([]);
    const [username] = useState(localStorage.getItem('username') || 'Player');

    useEffect(() => {
        const s = io('http://localhost:3000');
        setSocket(s);

        s.on('connect', () => {
            console.log('Connected:', s.id);
            s.emit('join', username);
        });

        s.on('state', (data: PublicState) => {
            setState(data);
        });

        s.on('privateState', (data: { rack: string[] }) => {
            setRack(data.rack);
        });

        return () => {
            s.disconnect();
        };
    }, [username]);

    const handlePeel = () => {
        socket?.emit('peel');
    };

    const handleDump = (letter: string) => {
        socket?.emit('dump', { letter });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#fff8bd',
                p: 2,
                fontFamily: '"JetBrains Mono", monospace',
            }}
        >
            <Typography variant='h4' sx={{ mb: 2 }}>
                Game Page - {username}
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Typography variant='h6'>Players in game:</Typography>
                {state.players.map((p) => (
                    <Typography key={p.id}>
                        {p.name} - {p.rackSize} tiles
                    </Typography>
                ))}
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant='h6'>Your Rack:</Typography>
                <Stack direction='row' spacing={1}>
                    {rack.map((tile, i) => (
                        <Button key={i} variant='outlined' onClick={() => handleDump(tile)}>
                            {tile}
                        </Button>
                    ))}
                </Stack>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Button variant='contained' onClick={handlePeel}>
                    Peel (Draw 1 Tile)
                </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography>Tiles remaining in pool: {state.poolSize}</Typography>
            </Box>
        </Box>
    );
};

export default GamePage;