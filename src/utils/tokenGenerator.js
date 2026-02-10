const TokenCounter = require('../models/TokenCounter');

const generateTokenNumber = async () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    let counter = await TokenCounter.findOne({ date: today });

    if (!counter) {
        counter = new TokenCounter({ date: today, lastToken: 0 });
    }

    counter.lastToken += 1;
    await counter.save();

    return counter.lastToken;
};

module.exports = generateTokenNumber;
