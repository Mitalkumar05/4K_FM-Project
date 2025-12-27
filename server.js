const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// 1. Define path to frontend
const frontendPath = path.join(__dirname, 'frontend');

// 2. Serve files
app.use(express.static(frontendPath));

// --- 💾 DATA ---
const libraryData = [
    { "title": "Atomic Habits", "category": "Audiobook", "imageUrl": "https://covers.openlibrary.org/b/id/12833633-L.jpg", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { "title": "Sherlock Holmes", "category": "Audiobook", "imageUrl": "https://covers.openlibrary.org/b/id/12556531-L.jpg", "audioUrl": "https://www.archive.org/download/adventures_sherlock_holmes_librivox/adventure_holmes_01_doyle_64kb.mp3" },
    { "title": "Rich Dad Poor Dad", "category": "Audiobook", "imageUrl": "https://covers.openlibrary.org/b/id/12776856-L.jpg", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { "title": "TED Talks Daily", "category": "Podcast", "imageUrl": "https://picsum.photos/seed/mic/300/300", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { "title": "Harry Potter", "category": "Story", "imageUrl": "https://covers.openlibrary.org/b/id/10522912-L.jpg", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" }
];

app.get('/api/content', (req, res) => res.json(libraryData));

// --- 🟢 FIX: The "Safety Net" (No crashing symbols!) ---
app.use((req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // ⚠️ DEBUG MODE: List files to find the spelling error
        const rootFiles = fs.readdirSync(__dirname);
        let frontendFiles = "Folder Not Found";
        
        if (fs.existsSync(frontendPath)) {
            frontendFiles = fs.readdirSync(frontendPath).join('\n');
        }

        res.status(404).send(`
            <h1>⚠️ Debug Report</h1>
            <p>Server is running! Now let's find the file.</p>
            <hr>
            <h3>📂 ROOT Folder contains:</h3>
            <pre>${rootFiles.join('\n')}</pre>
            <hr>
            <h3>📂 FRONTEND Folder contains:</h3>
            <pre>${frontendFiles}</pre>
        `);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));