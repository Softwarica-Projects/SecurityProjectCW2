const GenreRepository = require('../repositories/GenreRepository');
const { ValidationException, NotFoundException, ConflictException } = require('../exceptions');
const mongoose = require('mongoose');

class GenreService {
    constructor() {
        this.genreRepository = new GenreRepository();
    }

    validateGenreData(genreData) {
        const { name } = genreData;

        if (!name || name.trim().length < 1) {
            throw new ValidationException('Genre name is required', 'name');
        }

        if (name.trim().length < 2) {
            throw new ValidationException('Genre name must be at least 2 characters long', 'name');
        }

        if (name.trim().length > 50) {
            throw new ValidationException('Genre name cannot exceed 50 characters', 'name');
        }
    }

    async createGenre(genreData, imagePath = null) {
        this.validateGenreData(genreData);

        const normalizedName = genreData.name.trim();

        const existingGenre = await this.genreRepository.findByName(normalizedName);
        if (existingGenre) {
            throw new ConflictException('Genre with this name already exists');
        }

        const genreToCreate = {
            name: normalizedName,
            image: imagePath
        };

        const genre = await this.genreRepository.create(genreToCreate);
        return genre;
    }

    async updateGenre(genreId, genreData, imagePath = null) {
        if (!mongoose.Types.ObjectId.isValid(genreId)) {
            throw new ValidationException('Invalid genre ID', 'genreId');
        }

        const existingGenre = await this.genreRepository.findById(genreId);
        if (!existingGenre) {
            throw new NotFoundException('Genre', genreId);
        }

        this.validateGenreData(genreData);

        const normalizedName = genreData.name.trim();

        const duplicateGenre = await this.genreRepository.findByNameExcludingId(normalizedName, genreId);
        if (duplicateGenre) {
            throw new ConflictException('Genre with this name already exists');
        }

        const updateData = {
            name: normalizedName
        };

        if (imagePath) {
            updateData.image = imagePath;
        }

        const genre = await this.genreRepository.updateById(genreId, updateData);
        return genre;
    }

    async getGenres(basePath) {
        const genres = await this.genreRepository.findAllSorted();
        return this.formatGenresWithBasePath(genres, basePath);
    }

    async getGenreById(genreId, basePath) {
        if (!mongoose.Types.ObjectId.isValid(genreId)) {
            throw new ValidationException('Invalid genre ID', 'genreId');
        }

        const genre = await this.genreRepository.findById(genreId);
        if (!genre) {
            throw new NotFoundException('Genre', genreId);
        }

        return this.formatGenreWithBasePath(genre, basePath);
    }

    async deleteGenre(genreId) {
        if (!mongoose.Types.ObjectId.isValid(genreId)) {
            throw new ValidationException('Invalid genre ID', 'genreId');
        }

        const genre = await this.genreRepository.deleteById(genreId);
        if (!genre) {
            throw new NotFoundException('Genre', genreId);
        }

        return { message: 'Genre deleted successfully' };
    }

    async getGenreByName(name) {
        if (!name || name.trim().length < 1) {
            return null;
        }

        const genre = await this.genreRepository.findByName(name.trim());
        return genre;
    }

    formatGenresWithBasePath(genres, basePath) {
        return genres.map(genre => this.formatGenreWithBasePath(genre, basePath));
    }

    formatGenreWithBasePath(genre, basePath) {
        const genreObj = genre.toObject();
        return {
            ...genreObj,
            image: genreObj.image ? `${basePath}${genreObj.image}` : null
        };
    }
}

module.exports = GenreService;
