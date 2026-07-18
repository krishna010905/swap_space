import { Router } from "express";
import {addProduct, getProductById, getAllProducts, updateProduct} from "../controllers/product.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/add-product").post(
    verifyJWT,
    upload.fields([
        {
            name: "images",
            maxCount: 4
        }
    ]),
    addProduct
)

router.route("/get-product/:productId").get(getProductById);

router.route("/update-product/:productId").patch(
    verifyJWT,
    upload.fields([
        {
            name: "images",
            maxCount: 4
        }
    ]),
    updateProduct
);

router.route("/get-all-products").get(getAllProducts);


export default router