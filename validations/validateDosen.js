import Joi from 'joi';

export function validateDosen(dosen) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(dosen);
}