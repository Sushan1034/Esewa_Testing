const crypto = require("crypto");

function generateSignature(message, secret) {
    return crypto
        .createHmac("sha256", secret)
        .update(message)
        .digest("base64");
}

exports.generateEsewaFormData = (order) => {
    const secretKey = process.env.ESEWA_SECRET_KEY;

    // eSewa v2 requires signature of total_amount,transaction_uuid,product_code
    const message = `total_amount=${order.amount},transaction_uuid=${order.transactionUuid},product_code=${process.env.ESEWA_PRODUCT_CODE || "EPAYTEST"}`;

    const signature = generateSignature(message, secretKey);

    return {
        amount: order.amount,
        tax_amount: 0,
        total_amount: order.amount,
        transaction_uuid: order.transactionUuid,
        product_code: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: "http://localhost:5000/api/payments/esewa/success", // Server handles verification
        failure_url: "http://localhost:5173/payment-failed", // Direct to client on failure
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature
    };
};
