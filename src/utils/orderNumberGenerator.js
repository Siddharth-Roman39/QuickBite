
const generateOrderNumber = () => {
    // Format: ORD-YYYY-Timestamp(last 6)
    // Example: ORD-2024-123456
    const now = new Date();
    const year = now.getFullYear();
    const timestamp = now.getTime().toString();
    const uniqueSuffix = timestamp.substring(timestamp.length - 6);
    const orderNumber = `ORD-${year}-${uniqueSuffix}`;

    return orderNumber;
};

module.exports = generateOrderNumber;
