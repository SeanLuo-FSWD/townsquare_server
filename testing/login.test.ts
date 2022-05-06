import request from "supertest";
import { MongoClient } from "mongodb";

import App from "../app";
import * as database from "../src/util/database.util"

const app = new App().app;

describe("POST /login", () => {
    // let connection;
    let db;

    beforeAll(async () => {
        await database.connectDB()
        db = database.getDB()
        // connection = await MongoClient.connect(glo)
    })

    beforeEach(() => {
        db.drop("test_townsqua")
    })

    describe("given the correct data posted to the server", () => {
        test("should respond with 200 status code", async () => {
            const userData = {
                email: "kjohnthan.engi@gmail.com",
                password: "123"
            };

            const response = await request(app).post("/api/user/login").send(userData);
            expect(response.statusCode).toEqual(200);

            db.collection("Users").findOne({ email: userData.email });
            expect(response.body.email).toEqual(userData.email);
            expect(response.body.email).toEqual(userData.email);
        })

        // test("should have json as the content-type in the response", async () => {
        //     const userData = {
        //         email: "123@gmail.com",
        //         password: "123"
        //     };

        //     const response = await request(app).post("/login").send(userData);
        //     expect(response.header["content-type"]).toEqual(expect.stringContaining("json"));
        // })
    })

    // describe("given the wrong data posted to the server", () => {
    //     test("should respond with 400 status code", async () => {
    //         const userData = {
    //             email: "123@gmail.com",
    //             password: "321"
    //         };

    //         const response = await request(app).post("/login").send(userData);
    //         expect(response.statusCode).toEqual(400);
    //     });

    //     test("should have json as the content-type in the response", async () => {
    //         const response = await request(app).post("/login").send(userData);
    //         expect(response.header["content-type"]).toEqual(expect.stringContaining("json"));
    //     })

    //     test("should have a string that explain the error", async () => {
    //         const userData = {
    //             email: "123@gmail.com",
    //             password: "321"
    //         }

    //         //pass {error: "some error"}

    //         const response = await request(app).post("/login").send(userData);
    //         expect(typeof response.body.error).toBe("string");
    //     })
    // })
})