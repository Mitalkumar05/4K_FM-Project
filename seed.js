// backend/seed.js
const mongoose = require('mongoose');
const Content = require('./models/Content'); // Import your schema

// Connection URL
mongoose.connect('mongodb://127.0.0.1:27017/4k_fm')
    .then(() => console.log('✅ Connected for seeding...'))
    .catch(err => console.log(err));

// Fake Data (20 Items)
const sampleData = [
    {
        title: "The Tech Future",
        type: "podcast",
        author: "Elon Musk",
        category: "Technology",
        imageUrl: "https://picsum.photos/seed/tech1/300/300",
        sourceUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "History of India",
        type: "book",
        author: "R. Guha",
        category: "History",
        imageUrl: "https://picsum.photos/seed/hist1/300/300",
        sourceUrl: "India is a land of ancient civilizations... (This is a sample book text for reading mode)."
    },
    {
        title: "Midnight Horror",
        type: "story",
        author: "Stephen King",
        category: "Horror",
        imageUrl: "https://picsum.photos/seed/horror1/300/300",
        sourceUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
    },
    {
        title: "Business Mindset",
        type: "podcast",
        author: "Gary Vee",
        category: "Business",
        imageUrl: "https://picsum.photos/seed/biz1/300/300",
        sourceUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Learn Python",
        type: "book",
        author: "Guido van Rossum",
        category: "Education",
        imageUrl: "https://picsum.photos/seed/code1/300/300",
        sourceUrl: "Python is an interpreted, high-level and general-purpose programming language..."
    },
    {
        title: "Calm Lo-Fi Beats",
        type: "podcast",
        author: "ChillHop",
        category: "Music",
        imageUrl: "https://picsum.photos/seed/lofi/300/300",
        sourceUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "Space Exploration",
        type: "story",
        author: "NASA",
        category: "Science",
        imageUrl: "https://picsum.photos/seed/space/300/300",
        sourceUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    }
];

// Function to inject data
const seedDB = async () => {
    try {
        await Content.deleteMany({}); // Clears existing data first (Optional)
        console.log("🗑️  Old data cleared.");
        
        // Loop to create more dummy data to reach 20+ items
        const finalData = [];
        for(let i=0; i<3; i++) { // Duplicating the list 3 times to get many items
            sampleData.forEach(item => {
                finalData.push({
                    ...item, 
                    title: `${item.title} Vol.${i+1}` // Unique titles
                });
            });
        }

        await Content.insertMany(finalData);
        console.log("🎉 Success! Added " + finalData.length + " items to database.");
    } catch (err) {
        console.log(err);
    } finally {
        mongoose.connection.close();
        console.log("🔌 Connection closed.");
    }
};

seedDB();