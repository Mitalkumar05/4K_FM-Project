const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Serve Frontend
const frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));

// --- 💾 DATA (In Memory) ---
// Note: On a free server, new items you add via the website 
// might disappear if the server restarts. To make them permanent, 
// add them to this list manually in the code!
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

// 1. Get List
app.get('/api/content', (req, res) => res.json(libraryData));

// 2. Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) res.json({ success: true, user });
    else res.json({ success: false, message: "Invalid credentials" });
});

// 3. Register
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) return res.json({ success: false, message: "Exists" });
    users.push({ name, email, password });
    res.json({ success: true });
});

// 4. ✨ NEW: Add Item Route (The Fix!)
app.post('/api/add-item', (req, res) => {
    const newItem = req.body;
    // Add to the list
    libraryData.push(newItem);
    console.log("New Item Added:", newItem.title);
    res.json({ success: true, message: "Item added successfully!" });
});

// Catch-All
app.use((req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) res.sendFile(indexPath);
    else res.status(404).send("Frontend missing.");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));