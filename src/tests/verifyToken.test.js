const jwt = require('jsonwebtoken'); // Import the jwt module
const {verifyToken} = require('../helpers/middlewares');

// Mock the necessary dependencies
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn()
}));

describe('verifyToken', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer someToken'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return status 403 with "No token provided" message if no authorization header is provided', async () => {
        req.headers.authorization = undefined;

        await verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ auth: false, message: 'No token provided.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return status 403 with "No token provided" message if token is not present', async () => {
        req.headers.authorization = 'Bearer';

        await verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith({ auth: false, message: 'No token provided.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return status 401 with "Bad Auth" message if jwt.verify returns an error', async () => {
        const error = new Error('Some error');
        jwt.verify.mockImplementationOnce((token, secret, callback) => {
            callback(error);
        });

        await verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Bad Auth');
        expect(next).not.toHaveBeenCalled();
    });

    it('should return status 403 with "Please, verify your email!" message if user is not verified', async () => {
        jwt.verify.mockImplementationOnce((token, secret, callback) => {
            callback(null, { isVerified: false });
        });

        await verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Please, verify your email!' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if jwt.verify returns no error and user is verified', async () => {
        jwt.verify.mockImplementationOnce((token, secret, callback) => {
            callback(null, { isVerified: true });
        });

        await verifyToken(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});

