'use client'
import React, { useEffect, useRef, useState } from 'react';
import { initGame } from '../main';
import { usePlinkoStore } from '../store';

interface PhaserGame {
    destroy: (removeCanvas: boolean) => void;
}

const GAME_WIDTH = 1229;
const GAME_HEIGHT = 591;
const MOBILE_BREAKPOINT = 700;

const Game = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<PhaserGame | null>(null);
    const [scale, setScale] = useState(1);

    // Get the store methods
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
            window.removeEventListener('updateBalance', handleBalanceUpdate as EventListener);
            if (gameInstance.current) {
                gameInstance.current.destroy(true);
                gameInstance.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (window.innerWidth < MOBILE_BREAKPOINT) {
            const available = window.innerWidth - 16;
            setScale(available / GAME_WIDTH);
        }
    }, []);

    return (
        <div style={{ width: GAME_WIDTH * scale, height: GAME_HEIGHT * scale, overflow: 'hidden' }}>
            <div
                ref={gameRef}
                style={{
                    width: `${GAME_WIDTH}px`,
                    height: `${GAME_HEIGHT}px`,
                    transformOrigin: 'top left',
                    transform: `scale(${scale})`,
                }}
            />
        </div>
    );
};

export default Game;