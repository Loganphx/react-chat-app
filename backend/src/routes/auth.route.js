import express from 'express';
import {checkAuth, login, logout, signup, updateProfile} from "../controllers/auth.controller.js";
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", async (req, res, next) => {
    await login(req,res);
});
router.post("/logout", async (req, res, next) => {
    await logout(req, res, next);
});
router.put("/update-profile", protectRoute, async (req, res, next) => {
    await updateProfile(req, res);
});
router.get("/check", protectRoute, async (req, res, next) => {
    await checkAuth(req,res);
});

export default router;