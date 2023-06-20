import { UserMsg } from "./msg.js";

export class UserData {
    constructor() {
        /** @type {Array<UserMsg>} */
        this.msgs = [];
        this.notify = function (msg) {};
    }
    push(/** @type {UserMsg} */ msg) {
        this.msgs.push(msg);
        this.notify(msg);
    }
    subscribe(callback) {
        let oldSub = this.notify;
        this.notify = function(msg) {
            oldSub(msg);
            callback(msg);
        }
    }
}