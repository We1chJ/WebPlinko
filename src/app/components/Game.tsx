'use client'
import React, { useEffect, useRef } from 'react';
import { initGame } from '../main';
import { usePlinkoStore } from '../store';

interface PhaserGame {
    destroy: (removeCanvas: boolean) => void;
}

const Game = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<PhaserGame | null>(null);

    // Get the store methods
    const balance = usePlinkoStore(state => state.balance);
    const changeBalance = usePlinkoStore(state => state.changeBalance);

    useEffect(() => {
        if (typeof window !== 'undefined' && gameRef.current && !gameInstance.current) {
            gameInstance.current = initGame(gameRef.current);
        }
        const handleBalanceUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const change = Number(customEvent.detail.changeAmount);
            changeBalance(change);
            // console.log('Balance update event received');
        };

        window.addEventListener('updateBalance', handleBalanceUpdate as EventListener);

        return () => {
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
            }
        };
    }, []);

    return <div ref={gameRef} className="w-full h-full" />;
};

export default Game;