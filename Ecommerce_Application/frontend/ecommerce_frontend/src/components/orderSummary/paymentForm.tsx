import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

type PaymentMethod = 'Cash' | 'Card';

interface PaymentFormProps {
    onSubmit: (paymentMethod: PaymentMethod, cardDetails?: { cardNumber: string; cvv: string }) => void;
    onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, onCancel }) => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [cvv, setCvv] = useState<string>('');
    const [errors, setErrors] = useState<{ cardNumber?: string; cvv?: string }>({});

    const handleSubmit = () => {
        const newErrors: { cardNumber?: string; cvv?: string } = {};

        const sanitizedCardNumber = cardNumber.replace(/\s/g, '');
        if (paymentMethod === 'Card') {
            if (sanitizedCardNumber.length !== 12 || !/^\d+$/.test(sanitizedCardNumber)) {
                newErrors.cardNumber = 'Card number must be 12 digits long and contain only numbers.';
            }

            if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
                newErrors.cvv = 'CVV must be 3 digits long and contain only numbers.';
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            if (paymentMethod === 'Card') {
                onSubmit(paymentMethod, { cardNumber: sanitizedCardNumber, cvv });
            } else {
                onSubmit(paymentMethod);
            }
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                <Select
                    labelId="payment-method-label"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    label="Payment Method"
                >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                </Select>
            </FormControl>

            {paymentMethod === 'Card' && (
                <>
                    <TextField
                        label="Card Number"
                        variant="outlined"
                        fullWidth
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        label="CVV"
                        variant="outlined"
                        type="text" // Keep as text to allow for validation
                        fullWidth
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        error={!!errors.cvv}
                        helperText={errors.cvv}
                        sx={{ marginBottom: 2 }}
                    />
                </>
            )}

            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginRight: 2 }}>
                Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={onCancel}>
                Cancel
            </Button>
        </Box>
    );
};

export default PaymentForm;
