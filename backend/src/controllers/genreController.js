const GenreService = require('../services/GenreService');

class GenreController {
    constructor() {
        this.genreService = new GenreService();
    }

    async createGenre(req, res, next) {
        try {
            const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
            await this.genreService.createGenre(req.body, imagePath);
            res.status(201).json({
                success: true,
                message: 'Genre created successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async getGenres(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const genres = await this.genreService.getGenres(basePath);
            res.status(200).json(genres);
        } catch (error) {
            next(error);
        }
    }

    async getGenreById(req, res, next) {
        try {
            const basePath = `${req.protocol}://${req.get('host')}`;
            const genre = await this.genreService.getGenreById(req.params.id, basePath);
            res.status(200).json(genre);
        } catch (error) {
            next(error);
        }
    }

    async updateGenre(req, res, next) {
        try {
            const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
            await this.genreService.updateGenre(req.params.id, req.body, imagePath);
            res.status(200).json({
                success: true,
                message: 'Genre updated successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteGenre(req, res, next) {
        try {
            const result = await this.genreService.deleteGenre(req.params.id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

const genreController = new GenreController();

module.exports = {
    createGenre: genreController.createGenre.bind(genreController),
    getGenres: genreController.getGenres.bind(genreController),
    getGenreById: genreController.getGenreById.bind(genreController),
    updateGenre: genreController.updateGenre.bind(genreController),
    deleteGenre: genreController.deleteGenre.bind(genreController)
};