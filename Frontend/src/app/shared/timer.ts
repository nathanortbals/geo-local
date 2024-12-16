import { interval, map, Observable, startWith, takeWhile } from 'rxjs';

export const createTimer = (targetTime: Date): Observable<number> => {
  const target = targetTime.getTime();

  const getRemainingTime = () => {
    const now = new Date().getTime();

    const remainingTimeInSeconds = Math.max(
      Math.floor((target - now) / 1000),
      0,
    );

    return remainingTimeInSeconds;
  };

  return interval(1000).pipe(
    startWith(getRemainingTime()),
    map(() => getRemainingTime()),
    takeWhile((seconds) => seconds > 0, true),
  );
};
