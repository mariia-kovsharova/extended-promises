export { };

declare global {
    interface PromiseConstructor {
        /**
        * 
        * @param promises the array of promises to process
        * @returns 
        * * a fulfilled promise with an array that contains the result or null value of the promises in the same order, if at least one of the promises was fulfilled
        * * a rejected promise, if all the promises were rejected
        */
        some<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T | null> | unknown>;
    }
}

if (!Promise.some) {
    Promise.some = function <T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T | null> | unknown> {
        // Top-level promise
        return new Promise((resolve, reject) => {
            const len = promises.length;
            let fulfilledCount = 0;

            const reducedPromise = promises.reduce(
                (
                    processedPromises: Promise<Array<T | null>>,
                    currentPromise: Promise<T> | PromiseLike<T>,
                    index: number
                ): Promise<Array<T | null>> => {
                    const trustedPromise = Promise.resolve(currentPromise);

                    return trustedPromise
                        .then((value: T) => {
                            fulfilledCount += 1;

                            return processedPromises.then((previousProcessed: Array<T | null>) => {
                                previousProcessed[index] = value;
                                return previousProcessed;
                            })
                        })
                        .catch((_reason: unknown) => {
                            return processedPromises.then((previousProcessed: Array<T | null>) => {
                                previousProcessed[index] = null;
                                return previousProcessed;
                            })
                        })
                },
                Promise.resolve<Array<T | null>>(new Array(len))
            );

            reducedPromise.then((values: Array<T | null>) => {
                if (!fulfilledCount) {
                    reject()
                } else {
                    resolve(values)
                }
            })
        });
    }
}
