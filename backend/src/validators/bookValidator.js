const Joi = require('joi');

const createBookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    category: Joi.string().allow('', null),
    isbn: Joi.string().allow('', null),
    publisher: Joi.string().allow('', null),
    year: Joi.string().length(4).pattern(/^\d{4}$/).allow('', null).messages({
        'string.pattern.base': 'Tahun harus berupa 4 digit angka'
    }),
    total: Joi.number().integer().min(0).default(1),
    description: Joi.string().allow('', null)
});

const updateBookSchema = Joi.object({
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    category: Joi.string().allow('', null),
    isbn: Joi.string().allow('', null),
    publisher: Joi.string().allow('', null),
    year: Joi.string().length(4).pattern(/^\d{4}$/).allow('', null).messages({
        'string.pattern.base': 'Tahun harus berupa 4 digit angka'
    }),
    total: Joi.number().integer().min(0).optional(),
    description: Joi.string().allow('', null)
});

module.exports = {
    createBookSchema,
    updateBookSchema
};
