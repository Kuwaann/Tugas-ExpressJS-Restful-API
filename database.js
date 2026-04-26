import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();


//Fungsi-fungsi Get
export async function getDosens() {
    const [rows] = await pool.query('SELECT * FROM dosen');
    return rows;
};

export async function getDosen(id) {
    const [row] = await pool.query('SELECT * from dosen WHERE id=?', [id])
    return row[0] ?? null;
};

export async function getMultipleKelas() {
    const [rows] = await pool.query('SELECT * FROM kelas');
    return rows;
};

export async function getKelas(id) {
    const [row] = await pool.query('SELECT * from kelas WHERE id=?', [id])
    return row[0] ?? null;
};

export async function getMataKuliahs() {
    const [rows] = await pool.query('SELECT * FROM mata_kuliah');
    return rows;
};

export async function getMataKuliah(id) {
    const [row] = await pool.query('SELECT * from mata_kuliah WHERE id=?', [id])
    return row[0] ?? null;
};


//Fungsi-fungsi Create
export async function postDosen(name) {
    const [postedDosen] = await pool.query('INSERT INTO dosen (name) VALUES (?)', [name.trim()]);
    const id = postedDosen.insertId;
    return getDosen(id);
};

export async function postKelas(name) {
    const [postedKelas] = await pool.query('INSERT INTO kelas (name) VALUES (?)', [name.trim()]);
    const id = postedKelas.insertId;
    return getKelas(id);
};

export async function postMataKuliah(name, dosen, kelas, jam, jumlah_mahasiswa) {
    const [postedMataKuliah] = await pool.query('INSERT INTO mata_kuliah (name, dosen, kelas, jam, jumlah_mahasiswa) VALUES (?,?,?,?,?)', [name.trim(), dosen, kelas, jam, jumlah_mahasiswa]);
    const id = postedMataKuliah.insertId;
    return getMataKuliah(id);
};


