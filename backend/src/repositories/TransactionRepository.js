const BaseRepository = require('./BaseRepository');
const Transaction = require('../models/transactionModel');

class TransactionRepository extends BaseRepository {
    constructor() {
        super(Transaction);
    }

    async findBySessionId(sessionId) {
        return await this.findOne({ stripeSessionId: sessionId });
    }

    async findByUser(userId, limit = 50) {
        return await this.model.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
    }
}

module.exports = TransactionRepository;
