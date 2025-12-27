const BaseException = require('./BaseException');

class ValidationException extends BaseException {
    constructor(message, field = null) {
        super(message, 400);
        this.field = field;
    }
}

class NotFoundException extends BaseException {
    constructor(resource, identifier = null) {
        const message = identifier 
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        super(message, 404);
        this.resource = resource;
        this.identifier = identifier;
    }
}

class ConflictException extends BaseException {
    constructor(message) {
        super(message, 409);
    }
}

class UnauthorizedException extends BaseException {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

class ForbiddenException extends BaseException {
    constructor(message = 'Access forbidden') {
        super(message, 403);
    }
}

class ServerException extends BaseException {
    constructor(message = 'Internal server error') {
        super(message, 500);
    }
}

module.exports = {
    BaseException,
    ValidationException,
    NotFoundException,
    ConflictException,
    UnauthorizedException,
    ForbiddenException,
    ServerException
};
