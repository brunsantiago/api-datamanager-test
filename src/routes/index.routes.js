//import { Router } from "express";
const Router = require("express").Router;
//import { index, ping } from "../controllers/index.rotes.js";
const { index, ping } = require("../controllers/index.rotes.js")

const router = Router();

router.get("/", index);

router.get("/ping", ping);

//export default router;
module.exports = router;
