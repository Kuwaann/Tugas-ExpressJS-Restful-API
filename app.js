import express from 'express';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);
import { getDosens, getDosen, getMultipleKelas, getKelas, getMataKuliah, getMataKuliahs, postDosen, postKelas, postMataKuliah } from './database.js';
import { validateDosen } from './validations/validateDosen.js';
import { validateKelas } from './validations/validateKelas.js';
import { validateMataKuliah } from './validations/validateMataKuliah.js';

const app = express();

app.use(express.json());

// Untuk mencari dosen, bisa ditambahkan query untuk mencari satu dosen dengan Id tertentu
app.get('/api/dosen', async (req, res) => {
    const id = req.query.id ?? null;
    const dosen = id ? await getDosen(id) : await getDosens();
    if (!dosen || (Array.isArray(dosen) && dosen.length === 0)) {
        return res.status(404).send('Error 404: The dosen with the given Id was not found');
    }
    res.send(dosen);
});

// Untuk mencari kelas, bisa ditambahkan query untuk mencari satu kelas dengan Id tertentu
app.get('/api/kelas', async (req, res) => {
    const id = req.query.id ?? null;
    const kelas = id ? await getKelas(id) : await getMultipleKelas();
    if (!kelas || (Array.isArray(kelas) && kelas.length === 0)) {
        return res.status(404).send('Error 404: The kelas with the given Id was not found');
    }
    res.send(kelas);
});

// Untuk mencari mata kuliah, bisa ditambahkan query untuk mencari satu mata kuliah dengan Id tertentu
app.get('/api/mata_kuliah', async (req, res) => {
    const id = req.query.id ?? null;
    const mataKuliah = id ? await getMataKuliah(id) : await getMataKuliahs();
    if (!mataKuliah || (Array.isArray(mataKuliah) && mataKuliah.length === 0)) {
        return res.status(404).send('Error 404: The mata kuliah with the given Id was not found');
    }

    let result;
    if (Array.isArray(mataKuliah)) {
        result = mataKuliah.map((mk) => {
            return {
                id: mk.id,
                name: mk.name,
                jam: mk.jam,
                jumlah_mahasiswa: mk.jumlahMahasiswa
            };
        });

        if (req.query.expand === 'all') {
            result = await Promise.all(mataKuliah.map(async (mk) => {
                const dosen = await getDosen(mk.dosen);
                const kelas = await getKelas(mk.kelas);

                return {
                    id: mk.id,
                    name: mk.name,
                    jam: mk.jam,
                    jumlah_mahasiswa: mk.jumlahMahasiswa,
                    dosen: dosen,
                    kelas: kelas
                };
            }));

            return res.send(result);
        }

        return res.send(result);
    }
    else {
        result = {
            id: mataKuliah.id,
            name: mataKuliah.name,
            jam: mataKuliah.jam,
            jumlah_mahasiswa: mataKuliah.jumlahMahasiswa
        };

        if (req.query.expand === 'all') {
            const dosen = await getDosen(mataKuliah.dosen);
            const kelas = await getKelas(mataKuliah.kelas);
            result = {
                id: mataKuliah.id,
                name: mataKuliah.name,
                jam: mataKuliah.jam,
                jumlah_mahasiswa: mataKuliah.jumlahMahasiswa,
                dosen: dosen,
                kelas: kelas
            };

            return res.send(result);
        }

        return res.send(result);
    }
})

//Untuk post data dosen
app.post('/api/dosen', async (req, res) => {
    const { error } = validateDosen(req.body);
    if (error) {
        return res.status(400).send(`Error 400: ${error.details[0].message}`);
    }

    const name = req.body.name;
    const dosen = await postDosen(name);
    res.send(dosen);
});

//Untuk post data kelas
app.post('/api/kelas', async (req, res) => {
    const { error } = validateKelas(req.body);
    if (error) {
        return res.status(400).send(`Error 400: ${error.details[0].message}`);
    }

    const name = req.body.name;
    const kelas = await postKelas(name);
    res.send(kelas);
});

//Untuk post data mata kuliah
app.post('/api/mata_kuliah', async (req, res) => {
    const { error } = validateMataKuliah(req.body);
    if (error) {
        return res.status(400).send(`Error 400: ${error.details[0].message}`);
    }

    const { name, dosen, kelas, jam, jumlah_mahasiswa } = req.body;

    const date = dayjs(jam, ['YYYY-MM-DD HH:mm:ss', 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YYYY', 'YYYY-MM-DD'], true);

    if (!date.isValid()) {
        return res.status(400).send('Error 400: Invalid date format for "jam"')
    }
    const formattedJam = date.format('YYYY-MM-DD HH:mm:ss');

    const mataKuliah = await postMataKuliah(name, dosen, kelas, formattedJam, jumlah_mahasiswa);
    res.send(mataKuliah);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
