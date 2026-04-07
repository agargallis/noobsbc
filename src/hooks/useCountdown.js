import { useEffect, useState } from 'react';

const getCountdownParts = (targetDate) => {
  const delta = new Date(targetDate).getTime() - Date.now();
  const safeDelta = Math.max(delta, 0);

  const days = Math.floor(safeDelta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safeDelta / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((safeDelta / (1000 * 60)) % 60);
  const seconds = Math.floor((safeDelta / 1000) % 60);

  return { days, hours, minutes, seconds, isLive: delta <= 0 };
};

export function useCountdown(targetDate) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownParts(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  return countdown;
}
