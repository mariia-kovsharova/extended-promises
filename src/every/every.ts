declare global {
    interface PromiseConstructor {
        /**
         * @description equivalent of Promise.all
         * @param promises the array of promises to process
         * @returns 
         * * fulfilled promise with the array of results of promises in the same order, if every promise has been fulfilled
         * * rejected promise with the reason of the first rejected promise
         */
        every<T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T> | unknown>;
    }
}

if (!Promise.every) {
    Promise.every = function <T>(promises: ReadonlyArray<Promise<T> | PromiseLike<T>>): Promise<ReadonlyArray<T> | unknown> {
        // Top-level main promise
        return new Promise<ReadonlyArray<T>>((resolve, reject) => {
            const len = promises.length;
            const reducedPromise = promises.reduce(
                (
                    fulfilledPromises: Promise<Array<T>>,
                    currentPromise: Promise<T> | PromiseLike<T>,
                    index: number
                ): Promise<Array<T>> => {
                    const trustedPromise = Promise.resolve(currentPromise);
                    return trustedPromise
                        /**
                         * If the promise successfully fulfilled, add its result to fulfilled array
                         */
                        .then((value: T) => {
                            return fulfilledPromises.then((previousFulfilledArray: Array<T>) => {
                                previousFulfilledArray[index] = value;
                                return previousFulfilledArray;
                            });
                        })
                        /**
                         * Or reject main promise with the reason
                         */
                        .catch((reason: unknown) => {
                            reject(reason);
                            /**
                             * Nevertheless we have to return fulfilled array not modified
                             * to avoid reduce error
                             */
                            return fulfilledPromises;
                        })
                },
                Promise.resolve<Array<T>>(new Array(len))
            );

            reducedPromise.then((resultArray: ReadonlyArray<T>) => {
                /**
                 * If we are here that means all the promises have been fulfilled
                 * and here we get the accumulated array of values
                 */
                resolve(resultArray);
            });
        })
    }
}

export default global;