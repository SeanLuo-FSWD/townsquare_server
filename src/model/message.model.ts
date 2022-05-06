import { getDB } from "../util/database.util";

class MessageModel {
    private _db = getDB();
    private _userId: string;
    private _target: string;
    private _text: string;
    private _createdAt: number;

    constructor(userId, msgObject: { target: string, text: string }) {
        this._userId = userId;
        this._target = msgObject.target;
        this._text = msgObject.text;
        this._createdAt = Date.now();
    }

    public create = async () => {
        const newMessage = {
            userId: this._userId,
            target: this._target,
            text: this._text,
            createdAt: this._createdAt
        }

        await this._db.collection("message").insertOne(newMessage);
        return newMessage;
    }
}

export default MessageModel;