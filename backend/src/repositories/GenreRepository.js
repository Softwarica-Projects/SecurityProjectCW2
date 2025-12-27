const BaseRepository = require('./BaseRepository');
const Genre = require('../models/genreModel');

class GenreRepository extends BaseRepository {
    constructor() {
        super(Genre);
    }

    async findByName(name) {
        return await this.findOne({ name });
    }

    async findByNameExcludingId(name, excludeId) {
        return await this.findOne({ name, _id: { $ne: excludeId } });
    }

    async findAllSorted() {
        return await this.find({}, null, { name: 1 });
    }
}

module.exports = GenreRepository;
