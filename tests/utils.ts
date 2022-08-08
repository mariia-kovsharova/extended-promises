export interface IPromiseData<T> {
    value: T;
    timeout?: number;
}

export function resolvePromise<T>(value: T, timeout: number = 300): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), timeout);
    })
}

export function rejectPromise<T>(reason: T, timeout: number = 300): Promise<T> {
    return new Promise((_resolve, reject) => {
        setTimeout(() => reject(reason), timeout);
    })
}