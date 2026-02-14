import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import BookList from "./components/BookList";
import { PaymentSuccess, PaymentFailed } from "./components/PaymentStatus";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<BookList />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentFailed />} />
            </Routes>
        </Router>
    );
}

export default App;
