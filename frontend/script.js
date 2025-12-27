console.log("✅ Script Loaded Successfully!");

let allData = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

window.onload = function() {
    const user = localStorage.getItem('user');
    if (user) {
        showApp();
        updateProfileUI(JSON.parse(user));
    } else {
        showLogin(); 
    }
};

// --- LIKE FUNCTION ---
function toggleLike(title) {
    const index = favorites.indexOf(title);
    if (index === -1) { favorites.push(title); updateHeartStyle(title, true); } 
    else { favorites.splice(index, 1); updateHeartStyle(title, false); }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Refresh stats if on profile page
    if(document.getElementById('profile-section').style.display === 'block') {
        renderFavorites();
        updateStats(); // Update the count instantly
    }
}

function updateHeartStyle(title, isLiked) {
    const btns = document.querySelectorAll(`.like-btn[data-title="${title}"]`);
    btns.forEach(btn => {
        if(isLiked) { btn.classList.add('liked'); btn.innerHTML = '<i class="fas fa-heart"></i>'; } 
        else { btn.classList.remove('liked'); btn.innerHTML = '<i class="far fa-heart"></i>'; }
    });
}

// --- RENDER FUNCTIONS ---
function renderCards(items) {
    const grid = document.getElementById('content-grid');
    if(!grid) return;
    grid.innerHTML = ''; 
    items.forEach(item => grid.appendChild(createCardHTML(item)));
}

function renderFavorites() {
    const grid = document.getElementById('fav-grid');
    grid.innerHTML = '';
    const likedItems = allData.filter(item => favorites.includes(item.title));
    if (likedItems.length === 0) grid.innerHTML = '<p style="color:#b3b3b3">No favorites yet. Go like some songs! ❤️</p>';
    else likedItems.forEach(item => grid.appendChild(createCardHTML(item)));
    
    updateStats(); // Ensure count is correct
}

function updateStats() {
    // Dynamically update the Liked Songs count
    const countElement = document.getElementById('fav-count');
    if(countElement) countElement.innerText = favorites.length;
}

function createCardHTML(item) {
    const liked = favorites.includes(item.title);
    const heartClass = liked ? 'liked' : '';
    const heartIcon = liked ? 'fas fa-heart' : 'far fa-heart';
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${item.imageUrl}" alt="${item.title}">
            <button class="like-btn ${heartClass}" data-title="${item.title}" onclick="toggleLike('${item.title}')"><i class="${heartIcon}"></i></button>
        </div>
        <h3>${item.title}</h3><p>${item.category}</p>
        <button class="play-btn" onclick="playAudio('${item.audioUrl}', '${item.title}')">Play</button>
    `;
    return card;
}

// --- APP LOGIC ---
function showApp() { document.getElementById('auth-screen').style.display = 'none'; document.getElementById('app-screen').style.display = 'block'; fetchLibrary(); }

function showProfile() {
    document.getElementById('library-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';
    document.getElementById('nav-home').classList.remove('active');
    document.getElementById('nav-profile').classList.add('active');
    renderFavorites();
}

function showLibrary() {
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('library-section').style.display = 'block';
    document.getElementById('nav-profile').classList.remove('active');
    document.getElementById('nav-home').classList.add('active');
}

function updateProfileUI(user) {
    document.getElementById('profileName').innerText = user.name;
    document.getElementById('profileEmail').innerText = user.email;

    // Inject Stats Row
    const card = document.querySelector('.profile-card');
    
    // Check if stats row already exists (prevent duplicates)
    if(!document.querySelector('.stats-row')) {
        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats-row';
        statsDiv.innerHTML = `
            <div class="stat-item"><h3 id="fav-count">${favorites.length}</h3><span>Liked Songs</span></div>
            <div class="stat-item"><h3>Free</h3><span>Current Plan</span></div>
        `;
        // Insert after email (before buttons)
        card.insertBefore(statsDiv, card.children[3]); 
    }

    // Admin Button
    const adminArea = document.getElementById('admin-area');
    adminArea.innerHTML = "";
    if (user.email === "admin@gmail.com") {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-lock"></i> Go to Admin Panel';
        btn.className = "admin-btn-style"; // USE NEW CLASS
        btn.onclick = function() { window.location.href = 'admin.html'; };
        adminArea.appendChild(btn);
    }
}

// ✨ FIX: Fetch ONLY real data (No duplicates)
async function fetchLibrary() {
    try {
        const response = await fetch('/api/content');
        if (!response.ok) throw new Error("Server Failed");
        
        // distinct unique items only
        allData = await response.json();
        
        filterData('All');
    } catch (error) {
        console.error("Error:", error);
    }
}
function playAudio(url, title) { const p = document.querySelector('audio'); const t = document.getElementById('player-text'); if(p){ p.src=url; t.innerText="Playing: "+title; p.play().catch(e=>console.log("Blocked")); } }
function filterData(cat) { showLibrary(); document.getElementById('section-title').innerText=cat+" Library"; document.querySelectorAll('.cat-btn').forEach(b=>{ if(b.innerText.includes(cat)||(cat==='All'&&b.innerText==='All')) b.classList.add('active'); else b.classList.remove('active'); }); if(cat==='All') renderCards(allData); else renderCards(allData.filter(i=>i.category===cat)); }
function searchData() { showLibrary(); const q=document.getElementById('searchInput').value.toLowerCase(); renderCards(allData.filter(i=>i.title.toLowerCase().includes(q)||i.category.toLowerCase().includes(q))); }
function hideAllForms() { document.getElementById('login-form').style.display='none'; document.getElementById('signup-form').style.display='none'; document.getElementById('forgot-form').style.display='none'; }
function showLogin() { hideAllForms(); document.getElementById('login-form').style.display='block'; if(document.getElementById('reset-input-area')){ document.getElementById('reset-input-area').style.display='block'; document.getElementById('reset-success').style.display='none'; document.getElementById('resetBtn').innerHTML="Send Link"; document.getElementById('resetBtn').style.opacity="1"; } }
function showSignup() { hideAllForms(); document.getElementById('signup-form').style.display='block'; }
function showForgot() { hideAllForms(); document.getElementById('forgot-form').style.display='block'; }
async function sendResetLink() { const e=document.getElementById('resetEmail').value; if(!e){alert("Enter email");return;} const b=document.getElementById('resetBtn'); b.innerHTML='⏳ Sending...'; b.style.opacity="0.7"; await new Promise(r=>setTimeout(r,2000)); document.getElementById('reset-input-area').style.display='none'; document.getElementById('reset-success').style.display='block'; }
async function registerUser() { const n=document.getElementById('signupName').value,e=document.getElementById('signupEmail').value,p=document.getElementById('signupPass').value; if(!n||!e||!p)return alert("Fill fields"); try{const r=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:n,email:e,password:p})});const d=await r.json();alert(d.message);if(d.success)showLogin();}catch(e){alert("Error");} }
async function loginUser() { const e=document.getElementById('loginEmail').value,p=document.getElementById('loginPass').value; if(!e||!p)return alert("Enter creds"); try{const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e,password:p})});const d=await r.json();if(d.success){localStorage.setItem('user',JSON.stringify(d.user));showApp();updateProfileUI(d.user);}else{alert(d.message);}}catch(e){alert("Error");} }
function logoutUser() { localStorage.removeItem('user'); location.reload(); }