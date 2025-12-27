const express = require('express');
const router = express.Router();

// GET all content (Direct Mode - No Database required)
router.get('/content', (req, res) => {
    console.log("⚡️ Sending data directly to the website...");
    
    // We send this fake list instantly
    const dummyData = [
        {
            "_id": "1",
            "title": "The Tech Future",
            "type": "podcast",
            "author": "Elon Musk",
            "category": "Technology",
            "imageUrl": "https://picsum.photos/seed/tech1/300/300",
            "sourceUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        {
            "_id": "2",
            "title": "History of India",
            "type": "book",
            "author": "R. Guha",
            "category": "History",
            "imageUrl": "https://picsum.photos/seed/hist1/300/300",
            "sourceUrl": "India is a land of ancient civilizations..."
        },
        {
            "_id": "3",
            "title": "Midnight Horror",
            "type": "story",
            "author": "Stephen King",
            "category": "Horror",
            "imageUrl": "https://picsum.photos/seed/horror1/300/300",
            "sourceUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
        },
        {
            "_id": "4",
            "title": "Startup School",
            "type": "podcast",
            "author": "Y Combinator",
            "category": "Business",
            "imageUrl": "https://picsum.photos/seed/biz1/300/300",
            "sourceUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        }
    ];

    res.json(dummyData);
});

module.exports = router;