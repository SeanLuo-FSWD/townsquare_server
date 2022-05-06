import request from "supertest";

import App from "../app";

const app = new App().app;

describe("/POST /signup", () => {
    describe("When email field is empty", () => {
        test("Should return error: Empty email field", async () => {
            const signUpData = {
                email: "",
                password: "qwF#lkejqwr",
                passwordCheck: "qwF#lkejqwr"
            };

            const response = await request(app).post("/api/user/signUp").send(signUpData);

            //{ error: "Email field cannot be empty." }
            expect(response.body.error).toEqual("Error: Email field cannot be empty.")
        })
    })

    describe("When password & PasswordCHeck field are empty", () => {
        test("Should return error: Empty password cannot be blank", async () => {
            const signUpData = {
                email: "123@gmail.com",
                password: "",
                passwordCheck: ""
            };

            const response = await request(app).post("/api/user/signUp").send(signUpData);
            //{ error: "Email field cannot be empty." }
            // Need to specify when both password && passwordCheck == empty 
            // If only one = empty, error becomes -> "Passwords do not match."
            expect(response.body.error).toEqual("Error: Password field cannot be blank.")
        })
    })

    describe("When passwords do not match", () => {
        test("Should return error: Password fields must match.", async () => {
            const signUpData = {
                email: "123@gmail.com",
                password: "",
                passwordCheck: ""
            };

            const response = await request(app).post("/api/user/signUp").send(signUpData);
            //{ error: "Email field cannot be empty." }
            // Need to specify when both password && passwordCheck == empty 
            // If only one = empty, error becomes -> "Passwords do not match."
            expect(response.body.error).toEqual("Error: Password fields must match..")
        })
    })

    describe("When validation is met and register is successful", () => {
        test("Should return status code 200", async () => {
            const signUpData = {
                email: "123@gmail.com",
                // valid = email + pass + passcheck + email != alreadyExists
                password: "Ad34567#dsg",
                passwordCheck: "Ad34567#dsg"
            };

            const response = await request(app).post("/api/user/signUp").send(signUpData);
            expect(response.statuscode).toEqual(200)
        })
    })
    
    describe("When validation is NOT met and register is NOT successful", () => {
        test("Should return status code 400", async () => {
            const signUpData = {
                email: "123@gmail.com",
                //incorrect password length = 400
                password: "Ad3456",
                passwordCheck: "Ad3456"
            };

            const response = await request(app).post("/api/user/signUp").send(signUpData);
            expect(response.statuscode).toEqual(400)
        })
    })

})

