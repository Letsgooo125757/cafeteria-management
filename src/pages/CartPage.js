import React, { useState } from 'react';
import './CartPage.css';
import { Link } from 'react-router-dom';

function CartPage ({ cartItems, onRemoveItem}) {
    const [checkoutStep, setCheckoutStep] = useState('cart');
    const [mpesaNumber, setMpesaNumber] = useState('');
    const [visaDetails, setVisaDetails] = useState ({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardHolderName: ''
    });
    const [checkoutMessage, setCheckoutMessage] = useState('');

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
    };

    const handleRemove = (itemId) => {
        console.log("Removing item:", itemId);
        if(onRemoveItem) {
            onRemoveItem(itemId);
        } else {
            console.error("onRemoveItem function is not provided to the Cartpage.");
        }
    }

    const handleProceedToCheckout = () => {
        setCheckoutStep('options');
        setCheckoutMessage('');
    };

    const handlePaymentOptionSelect = (method) => {
        if (method === 'mpesa') {
            setCheckoutStep('mpesaInput');
        } else if (method === 'visa') {
            setCheckoutStep('visaInput');
        }
    };

    const handleMpesaSubmit = (event) => {
        event.preventDefault();
        if (!/^(07|01)\d{8}$/.test(mpesaNumber)) {
            setCheckoutMessage('Please enter a valid Safaricom number (e.g., 07XXXXXXXX or 01XXXXXXXX).');
            return;
        }
        console.log('Initiating M-Pesa paymment for:', mpesaNumber);
        setCheckoutStep('mpesaPrompt');
        setCheckoutMessage('Processing M-Pesa payment... Please check your phone and enter your M-Pesa PIN when prompted.');
        setTimeout(() => {
            console.log('M-Pesa payment simulation complete.');
            setCheckoutStep('complete');
            setCheckoutMessage(`M-Pesa Payment successful! Thank you for your order. (Simulated M-Pesa for ${mpesaNumber})`);
        }, 5000);
    };

    const handleVisaInputChange = (event) => {
        const { name, value } = event.target;
        setVisaDetails(prev => ({ ...prev, [name]: value}));
    };

    const handleVisaSubmit = (event) => {
        event.preventDefault();
        if (!visaDetails.cardNumber || !visaDetails.expiryDate || !visaDetails.cardHolderName) {
            setCheckoutMessage('Please fill in all Visa card details.');
            return;
        }
        console.log('Processing Visa payment with details:', visaDetails);
        setCheckoutStep('processing');
        setCheckoutMessage('Processing Visa payment... Please wait.');
        setTimeout(() => {
            console.log('Visa payment simulation complete.');
            setCheckoutStep('complete');
            setCheckoutMessage('Visa Payment successful! Thank you for your order. (Simulated Visa)');
        }, 3000);
    };

    const handleBack = () => {
        setCheckoutStep('options');
        setCheckoutMessage('');
    }

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={item._id ? `${item._id}-${index}` : index} className="cart-item">
                            {item.name} - KSH {item.price}
                            {checkoutStep === 'cart' && <button onClick={() => handleRemove(item._id)} className="remove-button">Remove</button>}
                        </li>
                    ))}
                </ul>
                <hr />
                <h3>Total: KSH {calculateTotal()}</h3>
                {checkoutStep === 'cart' && (
                    <button onClick={handleProceedToCheckout} className="checkout-button">Proceed To Checkout</button>
                )}

                {checkoutStep === 'options' && (
                    <div className="payment-options">
                        <h4>Select Payment Method</h4>
                        <button onClick={() => handlePaymentOptionSelect('mpesa')} className="payment-button mpesa">Pay with M-Pesa</button>
                        <button onClick={() => handlePaymentOptionSelect('visa')} className="payment-button visa">Pay with Visa Card</button>
                        <button onClick={() => setCheckoutStep('cart')} className="back-button">Back to Cart</button>
                    </div>
                )}

                {checkoutStep === 'mpesaInput' && (
                    <form onSubmit={handleMpesaSubmit} className="mpesa-form">
                        <h4>Enter M-Pesa Number</h4>
                        <label htmlFor="mpesaNumber">Safaricom Phone Number:</label>
                        <input
                          type="tel"
                          id="mpesaNumber"
                          value={mpesaNumber}
                          onChange={(e) => setMpesaNumber(e.target.value)}
                          placeholder="e.g., 0712345678"
                          required
                        />
                        <div className="form-actions">
                            <button type="submit" className="payment-button mpesa">Initiate M-Pesa Payment</button>
                            <button type="button" onClick={handleBack} className="back-button">Back</button>
                        </div>
                        {checkoutMessage && <p className="checkout-message error">{checkoutMessage}</p>}
                    </form>
                )}

                {checkoutStep === 'visaInput' && (
                    <form onSubmit={handleVisaSubmit} className="visa-form">
                        <h4>Enter Visa Card Details</h4>
                        <div className="form-group">
                            <label htmlFor="cardHolderName">CardHolder Name:</label>
                            <input type="text" id="cardHolderName" name="cardHolderName" value={visaDetails.cardHolderName} onChange={handleVisaInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cardNumber">Card Number:</label>
                            <input type="text" id="cardNumber" name="cardNumber" inputMode="numeric" pattern="[0-9\s]{13,19}" autoComplete='"cc-number' maxLength="19" placeholder="xxxx xxxx xxxx xxxx" value={visaDetails.cardNumber} onChange={handleVisaInputChange} required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="expiryDate">Expiry Date (MM/YY):</label>
                                <input type="text" id="expiryDate" name="expiryDate" pattern="\d{2}/\d{2}" placeholder="MM/YY" value={visaDetails.expiryDate} onChange={handleVisaInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cvc">CVC:</label>
                                <input type="text" id="cvc" name="cvc" inputMode="numeric" pattern="\d{3,4}" maxLength="4" value={visaDetails.cvc} onChange={handleVisaInputChange} required />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="payment-button visa">Pay with Visa</button>
                            <button type="button" onClick={handleBack} className="back-button">Back</button>
                        </div>
                        {checkoutMessage && <p className="checkout-message error">{checkoutMessage}</p>}
                    </form>
                )}

                {(checkoutStep === 'processing' || checkoutStep === 'mpesaPrompt') && (
                    <div className="processing-message">
                        <p>{checkoutMessage}</p>
                        <div className="loading-indicator">Processing...</div>
                    </div>
                )}

                {checkoutStep === 'complete' && (
                    <div className="checkout-message success">
                        <p>{checkoutMessage}</p>
                        <div className="post-checkout-actions">
                            <Link to="/menu" className="back-to-menu-button">Back to Menu</Link>
                        </div>
                    </div>
                )}

                {checkoutStep === 'error' && (
                    <div className="checkout-message error">
                        <p>{checkoutMessage}</p>
                        <button onClick={handleBack} className="back-button">Try Again</button>
                    </div>
                )}
                </>
            )
            }
        </div>
    );
}

export default CartPage;