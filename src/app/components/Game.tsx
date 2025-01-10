'use client'
import React, { useEffect, useRef } from 'react';
import { initGame } from '../main';

interface PhaserGame {
    destroy: (removeCanvas: boolean) => void;
}

const Game = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<PhaserGame | null>(null);

    useEffect(() => {
        // if this is complaining, it can be ignored. It is due to javascript converted to typescript
        if (typeof window !== 'undefined' && gameRef.current && !gameInstance.current) {
            gameInstance.current = initGame(gameRef.current);
        }

        return () => {
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
            }
        };
    }, []);

    return <div ref={gameRef} className="w-full h-full" />;
};

export default Game;