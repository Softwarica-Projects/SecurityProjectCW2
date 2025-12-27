const { ServerException } = require('../exceptions');

class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const document = new this.model(data);
            return await document.save();
        } catch (error) {
            throw new ServerException(`Failed to create ${this.model.modelName}: ${error.message}`);
        }
    }

    async findById(id, populate = null) {
        try {
            let query = this.model.findById(id);
            if (populate) {
                query = query.populate(populate);
            }
            return await query;
        } catch (error) {
            throw new ServerException(`Failed to find ${this.model.modelName} by ID: ${error.message}`);
        }
    }

    async findOne(filter, populate = null) {
        try {
            let query = this.model.findOne(filter);
            if (populate) {
                query = query.populate(populate);
            }
            return await query;
        } catch (error) {
            throw new ServerException(`Failed to find ${this.model.modelName}: ${error.message}`);
        }
    }

    async find(filter = {}, populate = null, sort = null, select = null) {
        try {
            let query = this.model.find(filter);
            if (populate) {
                query = query.populate(populate);
            }
            if (sort) {
                query = query.sort(sort);
            }
            if (select) {
                query = query.select(select);
            }
            return await query;
        } catch (error) {
            throw new ServerException(`Failed to find ${this.model.modelName}s: ${error.message}`);
        }
    }

    async updateById(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new ServerException(`Failed to update ${this.model.modelName}: ${error.message}`);
        }
    }

    async deleteById(id) {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw new ServerException(`Failed to delete ${this.model.modelName}: ${error.message}`);
        }
    }

    async countDocuments(filter = {}) {
        try {
            return await this.model.countDocuments(filter);
        } catch (error) {
            throw new ServerException(`Failed to count ${this.model.modelName}s: ${error.message}`);
        }
    }

    async exists(filter) {
        try {
            return await this.model.exists(filter);
        } catch (error) {
            throw new ServerException(`Failed to check if ${this.model.modelName} exists: ${error.message}`);
        }
    }
}

module.exports = BaseRepository;
