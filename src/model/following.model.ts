import { getDB } from "../util/database.util";

class FollowingModel {
    private _userId: string;
    private _followingUserId: string;
    private _db = getDB();
    constructor(userId, followingUserId) {
        this._userId = userId;
        this._followingUserId = followingUserId;
    }

    public toggleFollowing = async () => {
        const isFollowing = await this._db.collection("following").findOne({ 
            userId: this._userId,
            followingUserId : this._followingUserId
        });

        if (isFollowing) {
            await this._db.collection("following").deleteOne({
                userId: this._userId,
                followingUserId: this._followingUserId
            });
        } else {
            await this._db.collection("following").insertOne({
                userId: this._userId,
                followingUserId: this._followingUserId
            });
        }
        return isFollowing? "unfollowed" : "followed";
    }
    
    static getFollowingUsers = async (userId) => {
        const database = getDB()
        const followingUsers = await database.collection("following").find({
            userId
        }).toArray();
        return followingUsers;
    }
}

export default FollowingModel;