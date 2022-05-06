# API Documentation

[Firebase Documentation](https://firebase.google.com/docs/firestore/)

- - -

## Feature list

- - -

### User API

#### __Sign Up__

Method & Path: __POST__ /api/user/signup

Usage: Allow user to sign up and register a new account
Request DataType:

- email: string
- password: string

Response:

- 200 - { message: "success" }
- 400 - { message: "User already exists." }

#### __Log In__

Method & Path: __POST__ /api/user/login

Usage: Allow user to log in if account exists
Request DataType:

- email: string
- password: string

Response:

- 200 - { message: "authenticated" }
- 400 - { message: "Your login is invalid. Please try again" }
- 404 - { message: "User not found" }
- 500 - { message: "Login Error." }

#### __Log Out__

Method & Path: __GET__ /api/user/logout

Usage: Allow user to log out if currently logged in
Request DataType:

- NA

Response:

- 200 - { message: "logout" }

### Post API

#### __createPost__

Method & Path: __POST__ /api/post/

Usage: Allow user to create a new post
Request DataType:

- text: string
- images: `[ "<image public ur>" ]`

Response:

- 200 - { message: "success" }
- 400 - { message: Error Message }

#### __deletePost__

Method & Path: __POST__ /api/post/

Usage: Allow user to delete posts they own
Request DataType:

- postId: string

Response:

- 200 - { message: "Success" }
- 400 - { message: Error Message }
