export class ExpressError extends Error {
    constructor(statusCode, mesaage) {
        super();
        this.statusCode = statusCode;
        this.message = mesaage;
    }
}