
import express from "express"
import { config } from "dotenv";
config({path:"./config/dev.config.env"})
import { initiateApp } from "./src/initiate-apps.js";

const app=express()
initiateApp(app,express)

