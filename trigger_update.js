const API_URL = 'http://localhost:5000/api';
const ORDER_ID = '698dc42944cde3b540087bf2';

const triggerUpdate = async () => {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'staff1@canteen.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful. Token obtained.');

        // 2. Update Status
        console.log(`Updating order ${ORDER_ID} to 'prepared'...`);
        const updateRes = await fetch(`${API_URL}/orders/${ORDER_ID}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'prepared' })
        });

        if (!updateRes.ok) throw new Error(`Update failed: ${updateRes.statusText}`);
        const updateData = await updateRes.json();
        console.log('Order updated successfully:', updateData.status);

    } catch (error) {
        console.error('Error:', error.message);
    }
};

triggerUpdate();
