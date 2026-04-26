import Joi from 'joi';

export function validateMataKuliah(mataKuliah) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        dosen: Joi.number().positive().integer().required(),
        kelas: Joi.number().positive().integer().required(),
        jam: Joi.string(),
        jumlah_mahasiswa: Joi.number().positive().max(50).integer()
    });

    return schema.validate(mataKuliah);
}