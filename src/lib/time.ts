const pad = (n: number, len = 2) => n.toString().padStart(len, "0");

// 1:05
export const formatClock = (time: number) => `${Math.floor(time / 60)}:${pad(Math.floor(time % 60))}`;

// LRC timestamp, kept identical to the previous output format.
export const formatLrcTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    const msec = Math.floor((time % 1) * 100);
    return `${pad(min)}:${pad(sec)}.${pad(msec, 3)}`;
};
