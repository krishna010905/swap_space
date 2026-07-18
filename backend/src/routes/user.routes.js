import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, getUserOrderHistory, getUserProfile, test, sendOTP, verifyOTP, getUserData, sendReview, changePassword} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllPreviousMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-current-password").post(verifyJWT, changeCurrentPassword)

router.route("/change-password").post(changePassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-profile").patch(
    verifyJWT,
    upload.single("profileImage"),
    updateAccountDetails
)

router.route("/user-order-history").get(verifyJWT, getUserOrderHistory)

router.route("/profile/:userId").get(verifyJWT, getUserProfile)

router.route("/test").get(test)

router.route("/sendOTP").post(sendOTP)

router.route("/verifyOTP").post(verifyOTP)

router.route("/send-message").post(verifyJWT, sendMessage);

router.route("/get-all-previous-messages").post(verifyJWT, getAllPreviousMessages);

router.route("/get-user-data/:userId").get(verifyJWT, getUserData)

router.route("/review").post(sendReview)

export default router