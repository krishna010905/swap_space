import { Router } from "express";
import { placeOrder, cancelOrder, getProductOrders, acceptOrder, rejectOrder, getProductAllOrders} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/place-order").post(verifyJWT, placeOrder);

router.route("/cancel-order").post(verifyJWT, cancelOrder);

router.route("/product-orders/:productId").get(verifyJWT, getProductOrders);

router.route("/accept-order").post(verifyJWT, acceptOrder);

router.route("/reject-order").post(verifyJWT, rejectOrder);

router.route("/product-all-orders/:productId").get(verifyJWT, getProductAllOrders);

export default router;