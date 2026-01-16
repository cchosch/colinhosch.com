/**
 * @param classes class names to combine
 * @returns class names separated by a space
 */
export const cC = (...classes: (string | undefined)[]): string => {
    return classes.filter(v => v).join(" ");
};
