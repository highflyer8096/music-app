let songs = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchSongs();
});

async function fetchSongs() {
    try {
        const response = await fetch('http://localhost:3000/api/songs');
        songs = await response.json();
        displaySongs(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}

function searchSong() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredSongs = songs.filter(song => song.name.toLowerCase().includes(searchInput));
    displaySongs(filteredSongs);
}

async function uploadSong() {
    const songName = document.getElementById('songName').value;
    const artistName = document.getElementById('artistName').value;
    const songFile = document.getElementById('songFile').files[0];
    const songImage = document.getElementById('songImage').files[0];

    if (songFile && songImage && songName && artistName) {
        const formData = new FormData();
        formData.append('name', songName);
        formData.append('songFile', songFile);
        formData.append('songImage', songImage);

        try {
            const response = await fetch('http://localhost:3000/api/songs/upload', {
                method: 'POST',
                body: formData
            });
            const newSong = await response.json();
            songs.push(newSong);
            displaySongs(songs);
        } catch (error) {
            console.error('Error uploading song:', error);
        }
    } else {
        alert('Please provide all the required fields: Song Name, Artist Name, Song File, and Song Image.');
    }
}

function displaySongs(songList) {
    const songListContainer = document.getElementById('songList');
    songListContainer.innerHTML = '';

    songList.forEach(song => {
        const songItem = document.createElement('div');
        songItem.classList.add('song-item');

        const img = document.createElement('img');
        img.src = song.image;

        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = song.file;

        const title = document.createElement('span');
        title.textContent = `${song.name} - ${song.artist}`;

        songItem.appendChild(img);
        songItem.appendChild(title);
        songItem.appendChild(audio);

        songListContainer.appendChild(songItem);
    });
}
