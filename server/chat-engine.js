import { UserData } from "./user-data.js";

export class ChatEngine {
    // TODO: db

    constructor() {
        /** @type {Map<String, UserData>} */
        this.data = {};
        /** @type {Map<String, Function>} */
        this.subs = {};
    }

    publish(/** @type {String} */ userId, /** @type {String} */ msg) {
        let userData = this.getOrCreate(userId);
        userData.push(msg);
    }

    subscribe(/** @type {String} */ userId, listenerFunc) {
        let userData = this.getOrCreate(userId);
        userData.subscribe(listenerFunc);
    }

    getOrCreate(/** @type {String} */ userId) {
        /** @type {UserData} */
        let userData = this.data[userId];
        if (userData == null) {
            userData = new UserData();
            this.data[userId] = userData;
        }
        return userData;
    }
}