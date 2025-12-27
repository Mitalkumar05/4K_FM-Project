const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// 1. Define the path clearly
const frontendPath = path.join(__dirname, 'frontend');

// 2. Try to serve the static files
app.use(express.static(frontendPath));

// --- 💾 KEEP YOUR DATA SAFE ---
const libraryData = [
    { "title": "Atomic Habits", "category": "Audiobook", "imageUrl": "https://covers.openlibrary.org/b/id/12833633-L.jpg", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { "title": "Sherlock Holmes", "category": "Audiobook", "imageUrl": "https://covers.openlibrary.org/b/id/12556531-L.jpg", "audioUrl": "https://www.archive.org/download/adventures_sherlock_holmes_librivox/adventure_holmes_01_doyle_64kb.mp3" },
    { "title": "Rich Dad Poor Dad", "category": "Audiobook", "imageUrl": "https://covers.openlibrary.org/b/id/12776856-L.jpg", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { "title": "TED Talks Daily", "category": "Podcast", "imageUrl": "https://picsum.photos/seed/mic/300/300", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { "title": "Harry Potter", "category": "Story", "imageUrl": "https://covers.openlibrary.org/b/id/10522912-L.jpg", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" }
];

app.get('/api/content', (req, res) => res.json(libraryData));

// --- 🕵️‍♂️ THE DEBUG ROUTE ---
app.get('*', (req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // If file is missing, LIST what exists so we can fix it!
        const rootFiles = fs.readdirSync(__dirname);
        let frontendFiles = "Folder Not Found";
        
        if (fs.existsSync(frontendPath)) {
            frontendFiles = fs.readdirSync(frontendPath).join('\n');
        }

        res.status(404).send(`
            <style>body{font-family:sans-serif; background:#222; color:#fff; padding:20px;}</style>
            <h1>⚠️ Debug Report</h1>
            <p>I looked for: <b>${indexPath}</b></p>
            <p>But I could not find it.</p>
            <hr>
            <h3>📂 Files I CAN see in the Root folder:</h3>
            <pre>${rootFiles.join('\n')}</pre>
            <hr>
            <h3>📂 Files inside 'frontend':</h3>
            <pre>${frontendFiles}</pre>
        `);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));