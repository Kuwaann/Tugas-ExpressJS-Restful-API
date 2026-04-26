import Joi from 'joi';

export function validateKelas(kelas) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(kelas);
}