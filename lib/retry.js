const wait = time => new Promise((resolve) => setTimeout(resolve, time));
const retryOperation = (operation,  operationName = 'Operation', retries = 1e4, delayInMs = 5000) => new Promise((resolve, reject) => {
    return operation()
        .then(resolve)
        .catch((reason) => {
            console.log(`${operationName} failed!`, reason);

            if (retries > 0) {
                console.log(`Retrying ${operationName} in ${delayInMs}ms ...`);

                return wait(delayInMs)
                    .then(retryOperation.bind(null, operation, operationName, retries - 1, delayInMs))
                    .then(resolve)
                    .catch(reject);
            }
            return reject(reason);
        });
});

module.exports = retryOperation;
