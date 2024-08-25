export const removeFirst = <T,>(shots: T[]) => {
    if (shots.length == 0) return [];
    const [, ...rest] = shots;
    return rest;
}
