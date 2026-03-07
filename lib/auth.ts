import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export function signToken(payload: object, expiresIn: string | number = '7d'): string {
    return jwt.sign(payload, JWT_SECRET!, { expiresIn });
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET!);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

export function getUserId(req: Request): string {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { userId: string };

    if (!decoded || !decoded.userId) {
        throw new Error('Invalid token payload');
    }

    return decoded.userId;
}
