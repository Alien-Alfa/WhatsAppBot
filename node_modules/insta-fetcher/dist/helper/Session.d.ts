import { csrfToken, session_id } from "../types";
export declare const getCsrfToken: () => Promise<csrfToken>;
/**
 * get session id using login method
 * @param {username} username instagram username
 * @param {password} password instagram password
 * @returns {session_id} session id
 */
export declare const getSessionId: (username: string, password: string) => Promise<session_id>;
