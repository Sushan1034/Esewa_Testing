const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Order");
const { generateEsewaFormData } = require("../services/esewaService");

const router = express.Router();

router.post("/esewa/initiate", async (req, res) => {
    try {
        const { bookId, amount, userEmail } = req.body;

        const transactionUuid = uuidv4();

        const order = await Order.create({
            bookId,
            amount,
            userEmail,
            transactionUuid,
            status: "PENDING"
        });

        const formData = generateEsewaFormData(order);

        res.json({
            paymentUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
            formData
        });
    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const axios = require("axios");

router.get("/esewa/success", async (req, res) => {
    try {
        const { data } = req.query;

        if (!data) return res.status(400).send("No data provided");

        // Decode eSewa data (base64)
        const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
        console.log("Decoded eSewa Data:", decodedData);

        const { transaction_uuid, total_amount, status, product_code } = decodedData;

        if (status !== "COMPLETE") {
            return res.status(400).send("Payment not complete");
        }

        // Verify transaction with eSewa server
        const verificationResponse = await axios.get(process.env.ESEWA_VERIFY_URL, {
            params: {
                product_code: product_code,
                total_amount: total_amount,
                transaction_uuid: transaction_uuid
            }
        });

        console.log("eSewa Verification Response:", verificationResponse.data);

        if (verificationResponse.data.status !== "COMPLETE") {
            return res.status(400).send("eSewa verification failed");
        }

        const order = await Order.findOne({ transactionUuid: transaction_uuid });

        if (!order) return res.status(404).send("Order not found");

        // SECURITY check: Ensure amount matches
        if (Number(order.amount) !== Number(total_amount)) {
            return res.status(400).send("Amount mismatch");
        }

        order.status = "PAID";
        await order.save();

        res.redirect("http://localhost:5173/payment-success");
    } catch (error) {
        console.error("Error handling success callback:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/esewa/failure", async (req, res) => {
    res.redirect("http://localhost:5173/payment-failed");
});

module.exports = router;
