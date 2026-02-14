export const PaymentSuccess = () => (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1 style={{ color: "green" }}>Payment Successful!</h1>
        <p>Thank you for your purchase.</p>
        <a href="/">Go back to Store</a>
    </div>
);

export const PaymentFailed = () => (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1 style={{ color: "red" }}>Payment Failed!</h1>
        <p>Something went wrong. Please try again.</p>
        <a href="/">Go back to Store</a>
    </div>
);
