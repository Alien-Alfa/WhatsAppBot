import { session_id } from '../types';
export declare class CookieHandler {
    session_id: session_id;
    constructor(session_id?: string);
    /**
     * save session id to local directory
     * @param session_id session id
     * @returns
     */
    save: (session_id?: string) => void;
    /**
     * update with new cookie if last cookie got error, e.g account locked mybe
     * @param {String} session_id
     * @returns
     */
    update: (session_id?: string) => void;
    /**
     * to check if cookies.txt stored in local dir
     * @returns {boolean} true if file has stored in local dir
     */
    check: () => boolean;
    /**
     * get a session id
     * @returns session id
     */
    get: () => string;
}
