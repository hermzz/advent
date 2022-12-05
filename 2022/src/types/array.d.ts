interface Array<T> {
    chunks<T>(this: T[], size: number): T[][];
}