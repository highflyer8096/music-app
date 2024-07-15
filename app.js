const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use original filename
    }
});

const upload = multer({ storage: storage });

// File upload endpoint
app.post('/api/songs/upload', upload.fields([{ name: 'songFile' }, { name: 'songImage' }]), (req, res) => {
    const { songFile, songImage } = req.files;
    const songName = req.body.name;

    const newSong = {
        name: songName,
        file: `/uploads/${songFile[0].filename}`, // Adjusted to store full path
        image: `/uploads/${songImage[0].filename}` // Adjusted to store full path
    };

    // Save the song details in a JSON file
    const songsFilePath = path.join(__dirname, 'uploads', 'songs.json');
    let songs = [];

    if (fs.existsSync(songsFilePath)) {
        songs = JSON.parse(fs.readFileSync(songsFilePath));
    }

    songs.push(newSong);
    fs.writeFileSync(songsFilePath, JSON.stringify(songs));

    res.status(200).json(newSong);
});

// Endpoint to fetch all songs
app.get('/api/songs', (req, res) => {
    const songsFilePath = path.join(__dirname, 'uploads', 'songs.json');
    let songs = [];

    if (fs.existsSync(songsFilePath)) {
        songs = JSON.parse(fs.readFileSync(songsFilePath));
    }

    res.status(200).json(songs);
});

// Endpoint to list all uploaded files
app.get('/api/files', (req, res) => {
    fs.readdir(path.join(__dirname, 'uploads'), (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.json({ files });
    });
});

// Route handler for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to Your Music App'); // Example response
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
