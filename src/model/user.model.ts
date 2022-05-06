import { getDB } from "../util/database.util";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import FilterHelper from "./_filter.helper";

class UserModel {
  private _db = getDB();
  private _email: string;
  private _password: string;
  private _avatar: string;
  private _username: string;
  private _emailVerified: boolean;
  private _createdAt: string;
  private _age: number | undefined;
  private _gender: string | undefined;
  private _location: string | undefined;
  private saltRounds: number = 10;

  constructor(input) {
    this._email = input.email;
    this._password = input.password;
    this._username = input.username;
    this._emailVerified = false;
    this._avatar =
      "https://res.cloudinary.com/depk87ok3/image/upload/v1619723749/defaultProfilePhoto-min_zdwber.png";
    this._createdAt = new Date().toString();
  }

  static async updateLastLogin(id: any) {
    const database = getDB();

    try {
      await database.collection("user").updateOne(
        {
          _id: new ObjectId(id),
        },
        { $currentDate: { lastLogin: true } }
      );
    } catch (error) {
      throw new Error("Error updating login timestamp");
    }
  }

  static async getPeople(filter: any, userId: string) {
    let desired_users: any = [];

    const filterHelper = new FilterHelper("user", filter, userId);

    if (filter.applied) {
      desired_users = filterHelper.applyFilter();
    } else {
      const database = getDB();
      desired_users = await database
        .collection("user")
        .find()
        .sort({ lastLogin: -1, _id: -1 })
        .toArray();
    }

    return desired_users;
  }
  static async removeFirstTime(userId) {
    const query = { _id: new ObjectId(userId) };
    const database = getDB();
    await database.collection("user").updateOne(query, {
      $set: {
        firstTime: false,
      },
    });
  }

  public async isExisted() {
    const user = await this._db
      .collection("user")
      .findOne({ email: this._email });
    return Boolean(user);
  }

  public async create() {
    const passwordHash = await bcrypt.hash(this._password, this.saltRounds);

    const result = await this._db.collection("user").insertOne({
      email: this._email,
      password: passwordHash,
      username: this._username,
      avatar: this._avatar,
      emailVerified: this._emailVerified,
      age: this._age,
      gender: this._gender,
      location: this._location,
      createdAt: this._createdAt,
      firstTime: true,
    });

    return {
      email: this._email,
      userId: result.insertedId,
    };
  }

  static async getUserById(userId: string) {
    const database = getDB();
    const user = await database
      .collection("user")
      .findOne({ _id: new ObjectId(userId) });
    if (user) {
      return {
        userId,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        gender: user.gender,
        location: user.location,
        age: user.age,
      };
    }
    return null;
  }

  static async getByEmailAndPassword(email: string, password: string) {
    const database = getDB();
    let user = await database.collection("user").findOne({ email });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return {
        email: user.email,
        userId: user._id.toString(),
        username: user.username,
        avatar: user.avatar,
        age: user.age,
        gender: user.gender,
        location: user.location,
        emailVerified: user.emailVerified,
        firstTime: user.firstTime,
      };
    }
    return null;
  }

  static async verifyUserByEmail(userId) {
    const database = getDB();
    const query = { _id: new ObjectId(userId) };
    const result = await database.collection("user").updateOne(query, {
      $set: {
        emailVerified: true,
      },
    });

    return true;
  }

  static updateProfile = async (userId, updates) => {
    if (updates && Object.keys(updates).length !== 0) {
      if (updates.age) {
        updates.age = parseInt(updates.age);
      }

      const database = getDB();
      await database.collection("user").updateOne(
        {
          _id: new ObjectId(userId),
        },
        {
          $set: updates,
        }
      );
    }

    return "success";
  };

  static updateUserAvatar = async (userId, newAvatarLink) => {
    const database = getDB();
    await database.collection("user").updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: {
          avatar: newAvatarLink,
        },
      }
    );
    return "success";
  };
}

export default UserModel;
