import crypto from 'crypto';

/**
 * Generates a short hex OTP, e.g. "a3f9c1b2" (8 hex characters).
 * Easy to copy/paste manually, short-lived, single-use (enforced in the DB).
 */
export function generateOtp() {
    return crypto.randomBytes(4).toString('hex');
}
