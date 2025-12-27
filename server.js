const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON
app.use(express.json());

// 🟢 FIX: Correctly serve static files (CSS, JS, Images) from 'frontend' folder
app.use(express.static(path.join(__dirname, 'frontend')));

// --- 💾 DATA STORAGE (In Memory) ---
const libraryData = [
    { "title": "Atomic Habits", "category": "Audiobook", "imageUrl": "https://covers.openlibrary.org/b/id/12833633-L.jpg", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { "title": "Sherlock Holmes", "category": "Audiobook", "imageUrl": "https://covers.openlibrary.org/b/id/12556531-L.jpg", "audioUrl": "https://www.archive.org/download/adventures_sherlock_holmes_librivox/adventure_holmes_01_doyle_64kb.mp3" },
    { "title": "Rich Dad Poor Dad", "category": "Audiobook", "imageUrl": "https://covers.openlibrary.org/b/id/12776856-L.jpg", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { "title": "TED Talks Daily", "category": "Podcast", "imageUrl": "https://picsum.photos/seed/mic/300/300", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { "title": "Harry Potter", "category": "Story", "imageUrl": "https://covers.openlibrary.org/b/id/10522912-L.jpg", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    { "title": "On Purpose (Jay Shetty)", "category": "Podcast", "imageUrl": "https://covers.openlibrary.org/b/id/8259443-L.jpg", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { "title": "Midnight Horror", "category": "Story", "imageUrl": "https://picsum.photos/seed/horror/300/300", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
    { "title": "Space Journey", "category": "Story", "imageUrl": "https://picsum.photos/seed/space/300/300", "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" }
];

let users = [
    { name: "Admin", email: "admin@gmail.com", password: "123" }
];

// --- 🔌 API ROUTES ---
app.get('/api/content', (req, res) => {
    res.json(libraryData);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, user: { name: user.name, email: user.email } });
    } else {
        res.json({ success: false, message: "Invalid credentials" });
    }
});

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.json({ success: false, message: "Email already exists" });
    }
    users.push({ name, email, password });
    res.json({ success: true, message: "Account created successfully" });
});

// 🟢 FIX: The "Catch-All" Route
// If the server doesn't know what to do, send the 'index.html' file.
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'frontend', 'index.html');
    
    // Check if file exists before sending to avoid crashing
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("Frontend missing. Please check your 'frontend' folder name.");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));