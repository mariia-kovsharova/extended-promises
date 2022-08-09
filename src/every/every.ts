declare global {
    interface PromiseConstructor {
        /**
          * @description an equivalent of Promise.all
          * @param promises an array of promises to process
          * @returns 
          * * a fulfilled promise with a result array of the promises in the same order, if every promise has been fulfilled
          * * a rejected promise with the reason for the first rejected promise
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