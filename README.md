# extended-promises
Extended API for working with a collection of promises.
***
### Promise.every
An equivalent of Promise.all. 
* **Params**:
    * an array of promises
* **Returns**:
    * a fulfilled promise with a results array of the promises in the same order, if every promise was fulfilled
    * a rejected promise with the reason for the first rejected promise

### Promise.some
* **Params**:
    * an array of promises
* **Returns**:
    * a fulfilled promise with an array that contains the result or null value of the promises in the same order, if at least one of the promises was fulfilled
    * a rejected promise, if all the promises were rejected

### Promise.none
* **Params**:
    * an array of promises
* **Returns**:
    * a fulfilled promise with an array that contains reasons in the same order, if all the promises were rejected
    * a rejected promise, if at least one of the promises was fulfilled

### Promise.first
* **Params**:
    * an array of promises
* **Returns**:
    * a fulfilled promise with the result of the first fulfilled promise
    * a rejected promise with an array of reasons, if all the promises were rejected

### Promise.last
* **Params**:
    * an array of promises
* **Returns**:
    * a fulfilled promise with the result of the last fulfilled promise
    * a rejected promise with an array of reasons, if all the promises were rejected

### Promise.filter
* **Params**:
    * an array of promises
    * a predicate function
* **Returns**:
    * a fulfilled promise with an array of filtered promises, if all the promises have been fulfilled
    * a rejected promise with the reason for the first rejected promise

### Promise.map
* **Params**:
    * an array of promises
    * a transformation function
* **Returns**:
    * a fulfilled promise with an array of transformed promises, if all the promises have been fulfilled
    * a rejected promise with the reason for the first rejected promise