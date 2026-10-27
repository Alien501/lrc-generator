const pad = (n: number, len = 2) => n.toString().padStart(len, "0");

// 1:05
export const formatClock = (time: number) => `${Math.floor(time / 60)}:${pad(Math.floor(time % 60))}`;

// LRC timestamp, kept identical to the previous output format.
export const formatLrcTime = (time: number) => {
  const totalMs = Math.round(time * 1000);
  const min = Math.floor(totalMs / 60_000);
  const sec = Math.floor(totalMs / 1000) % 60;
  const msec = totalMs % 1000;
  return `${pad(min)}:${pad(sec)}.${pad(msec, 3)}`;
};