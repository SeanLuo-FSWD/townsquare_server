import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import sessionMiddlware from "./session.middleware";
import dotenv from "dotenv";
dotenv.config();

module.exports = (app) => {
  // app.use(cors());
  console.log("init middlewares");
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("tiny"));
  //need to be cleanedup for deployment
  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT,
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    })
  );
  app.set("trust proxy", 1);
  app.use(sessionMiddlware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static("public"));
};
