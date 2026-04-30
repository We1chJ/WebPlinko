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
    const wrapperRef = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<PhaserGame | null>(null);
    const [scale, setScale] = useState(1);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;

    const changeBalance = usePlinkoStore(state => state.changeBalance);

    useEffect(() => {
        if (typeof window !== 'undefined' && gameRef.current && !gameInstance.current) {
            gameInstance.current = initGame(gameRef.current);
        }
        const handleBalanceUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            const change = Number(customEvent.detail.changeAmount);
            changeBalance(change);
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
        const updateScale = () => {
            if (!wrapperRef.current) return;
            if (window.innerWidth < MOBILE_BREAKPOINT) {
                // Scale by height to fill the container, crop sides
                const availH = wrapperRef.current.clientHeight || window.innerHeight;
                const scaleByH = availH / GAME_HEIGHT;
                const scaleByW = window.innerWidth / GAME_WIDTH;
                setScale(Math.max(scaleByH, scaleByW) * 0.85);
            } else {
                setScale(1);
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        const observer = new ResizeObserver(updateScale);
        if (wrapperRef.current) observer.observe(wrapperRef.current);

        return () => {
            window.removeEventListener('resize', updateScale);
            observer.disconnect();
        };
    }, []);

    if (isMobile) {
        return (
            <div ref={wrapperRef} style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', padding: '8px', boxSizing: 'border-box' }}>
                <div
                    ref={gameRef}
                    style={{
                        width: `${GAME_WIDTH}px`,
                        height: `${GAME_HEIGHT}px`,
                        transformOrigin: 'center center',
                        transform: `scale(${scale})`,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% -50%',
                    }}
                />
            </div>
        );
    }

    return <div ref={gameRef} style={{ width: '1229px', height: '591px' }} />;
};

export default Game;
