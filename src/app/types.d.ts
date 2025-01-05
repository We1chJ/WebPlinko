declare module './main' {
    export function initGame(container: HTMLDivElement): {
        destroy: (removeCanvas: boolean) => void;
    };
}