import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

import add_plants from "../services/add_plant.js"
import Signin from "../controller/Signin/Signin.js"
import Signup from "../controller/Signup/Signup.js"

router.use("/Signin", Signin);
router.use("/SignUp", Signup);




const services = {
    add_plants
};


Object.entries(services).forEach(([name, service]) => {
    router.use(`/Signin/${name}`, service);
});

export default router;
