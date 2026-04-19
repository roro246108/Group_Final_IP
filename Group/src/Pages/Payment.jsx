import { useState } from "react";
import visaimg from "../assets/Images/visa4.png";
import img from "../assets//Images/PaymentFormPage.jpg";

export default function PaymentPage() {

  
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  const handleCardNumber = (e) => {
    const value = e.target.value;
    setCardNumber(value);
    if (/[^0-9]/.test(value)) setError("Card number must contain numbers only.");
    else setError("");
  };

  const handleName = (e) => {
    const value = e.target.value;
    setName(value);
    if (/[^a-zA-Z\s]/.test(value)) setError("Name must contain letters only.");
    else setError("");
  };

  const handleExpiry = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2, 4);
    setExpiry(value);
  };

  const handleCVV = (e) => {
    const value = e.target.value;
    setCvv(value);
    if (/[^0-9]/.test(value)) setError("CVV must contain numbers only.");
    else if (value.length > 4) setError("CVV cannot exceed 4 digits.");
    else setError("");
  };

  const handlePayment = () => {
    if (!cardNumber || !expiry || !cvv || !name || !email || !phone) {
      setError("Please fill in all fields first.");
      return;
    }
    setError("");
    alert("Payment successful");
  };

  return (
    <div className="min-h-screen w-full bg-[#edf7ff] flex items-center justify-center py-20">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">

        {/* IMAGE */}
        <div className="md:w-1/2">
          <img
            src={img}
            alt="Room"
            className="w-full h-full object-cover"
          />
        </div>

        {/* FORM */}
        <div className="md:w-1/2 bg-white p-12 flex flex-col justify-center text-[#1e3a8a]">

          <h2 className="text-3xl font-bold mb-8 text-center ">
            Payment Details
          </h2>

          <h3 className="font-semibold mb-3 text-lg">
            Personal Information
          </h3>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={handleName}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            className="w-full border p-3 rounded-lg mb-6"
          />

          <h3 className="font-semibold mb-3 text-lg">
            Card Details
          </h3>

          {/*  Bigger logo */}
          <img 
            src={visaimg} 
            alt="Card Logos" 
            className="w-[280px] h-auto mb-4"
          />

          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={handleCardNumber}
            className="w-full border p-3 rounded-lg mb-4 "
          />

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="MM / YY"
              value={expiry}
              onChange={handleExpiry}
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={handleCVV}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          <button
            onClick={handlePayment}
            className="w-full bg-[#edf7ff] text-blue-800 py-3 rounded-xl hover:bg-[#1e3a8a] hover:text-white transition duration-300"
          >
            Confirm Payment
          </button>

        </div>
      </div>
    </div>
  );
}