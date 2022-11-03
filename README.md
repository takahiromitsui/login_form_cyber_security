
# Secure Login Form API

[Secure Login Form API](https://cyber-security-form-frontend.vercel.app) has been developed for the secure Login form([Github](https://github.com/takahiromitsui/cyber-security-form-frontend) and [App](https://cyber-security-form-frontend.vercel.app/)). The purpose of this API is to demonstrate security implmentation for the Login form and keep things as simple as possible.


## Security
- [JWT token](https://www.npmjs.com/package/jsonwebtoken) implmentation
- Secuirty headers by [helmet](https://github.com/helmetjs/helmet)
- Route protection(ref: src/middleware/isAuth.ts)
- Sanitasation of inputs and validation(ref: src/middleware/validation.ts)
- CORS/White list(ref: src/helpers/app.ts)
- Monitor valunerability by [sonarCloud](https://sonarcloud.io)

## Deployment
This API has been hosted on Heroku server [here](https://security-login-restapi.herokuapp.com). If you try to send requests to the hosted API by postman, you'll be denied because of CORS. Only [Secure Login Frontnd](https://cyber-security-form-frontend.vercel.app) can connect to the hosted API.
## Prerequisites
You need to install the following things to be able to run this project on your own hardware:

1. [nodeJS](https://nodejs.org/en/download/) (v16.14.0 recommended)
2. [MongoDB instance](https://www.mongodb.com/basics/create-database)
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file (you can copy and paste .env.example)

`NODE_ENV`=> This variable should be blank and be overwritten on package.json

`JWT_SECRET`=> Enter random string, which is needed for encryption and decryption of JWT.

`PORT`=> If you leave this variable empty, this API will be exported on PORT=80.

`DB_USER`=> This API uses MongoDB. After creating your MongoDB database, pass your username here.

`DB_PASSWORD`=> Pass your MongoDB password.

`POSSIBLE_ORIGIN_URL1`, `POSSIBLE_ORIGIN_URL2`, `POSSIBLE_ORIGIN_URL3`=> These URLs are allowed to access to this API(whitelist). You need these variables for production(`npm start`).
## Run Locally

Clone the project

```bash
  git clone https://github.com/takahiromitsui/login_form_cyber_security.git
```

Install dependencies

```bash
  npm install
```

Start the development server

```bash
  npm run dev
```

Start the production server
```bash
  npm run build
  npm start
```
## API Reference

#### Get Landing oage

```http
  GET /
```

#### Put sign up

```http
  PUT /auth/signup
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. email address |
| `password`      | `string` | **Required**. password(should be 12 letters long at least and include at least one lower letter, upper letter, digit, special character) |

#### Post login

```http
  PUT /auth/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. email address |
| `password`      | `string` | **Required**. password(should be 12 letters long at least and include at least one lower letter, upper letter, digit, special character) |


#### Get user information

```http
  GET /user/info
```
This route is protected. You cannot access this route unless your client has valid JWT token. It fetches `email` and `date of creation`.