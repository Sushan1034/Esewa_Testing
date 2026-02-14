import axios from "axios";

const books = [
    { id: "1", name: "Atomic Habits", price: 500 },
    { id: "2", name: "Deep Work", price: 700 },
];

export default function BookList() {
    const handleBuy = async (book: any) => {
        try {
            const res = await axios.post("http://localhost:5000/api/payments/esewa/initiate", {
                bookId: book.id,
                amount: book.price,
                userEmail: "test@gmail.com"
            });

            const { paymentUrl, formData } = res.data;

            // Create a form dynamically and submit it
            const form = document.createElement("form");
            form.method = "POST";
            form.action = paymentUrl;

            Object.keys(formData).forEach(key => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = formData[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Payment initiation failed. Please try again.");
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Book Store</h1>
            <div style={{ display: "flex", gap: "20px" }}>
                {books.map(book => (
                    <div key={book.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
                        <h3>{book.name}</h3>
                        <p>Rs {book.price}</p>
                        <button
                            onClick={() => handleBuy(book)}
                            style={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                padding: "8px 16px",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
