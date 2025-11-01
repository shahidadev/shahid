// Global variables
let allEmotes = [];
let filteredEmotes = [];
let displayedEmotes = [];
let currentIndex = 0;
const ITEMS_PER_LOAD = 20;
let userUID = '';
let activeRarity = 'ALL';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkUID();
    loadEmotes();
    setupEventListeners();
});

// Check if UID exists
function checkUID() {
    userUID = localStorage.getItem('freeFireUID');
    if (!userUID) {
        document.getElementById('uidModal').style.display = 'flex';
    } else {
        document.getElementById('uidModal').style.display = 'none';
    }
}

// Save UID
function saveUID() {
    const uidInput = document.getElementById('uidInput').value.trim();
    if (uidInput) {
        localStorage.setItem('freeFireUID', uidInput);
        userUID = uidInput;
        document.getElementById('uidModal').style.display = 'none';
    } else {
        alert('Please enter a valid UID');
    }
}

// Load emotes from JSON
async function loadEmotes() {
    try {
        const response = await fetch('emote.json');
        allEmotes = await response.json();
        filteredEmotes = [...allEmotes];
        displayInitialEmotes();
    } catch (error) {
        console.error('Error loading emotes:', error);
        document.getElementById('emotesGrid').innerHTML = '<p style="text-align: center; color: #ff6b6b;">Error loading emotes. Please try again.</p>';
    }
}

// Display initial emotes
function displayInitialEmotes() {
    currentIndex = 0;
    displayedEmotes = [];
    document.getElementById('emotesGrid').innerHTML = '';
    loadMoreEmotes();
}

// Load more emotes (infinite scroll)
function loadMoreEmotes() {
    const grid = document.getElementById('emotesGrid');
    const emotesToLoad = filteredEmotes.slice(currentIndex, currentIndex + ITEMS_PER_LOAD);
    
    emotesToLoad.forEach(emote => {
        const card = createEmoteCard(emote);
        grid.appendChild(card);
    });

    displayedEmotes.push(...emotesToLoad);
    currentIndex += ITEMS_PER_LOAD;

    // Hide loading indicator if all emotes are loaded
    if (currentIndex >= filteredEmotes.length) {
        document.getElementById('loading').classList.add('hidden');
    } else {
        document.getElementById('loading').classList.remove('hidden');
    }
}

// Create emote card
function createEmoteCard(emote) {
    const card = document.createElement('div');
    card.className = 'emote-card';
    card.onclick = () => openItemModal(emote);

    const iconUrl = `https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/${emote.itemID}.png`;

    const img = document.createElement('img');
    img.className = 'emote-icon';
    img.dataset.src = iconUrl; // Lazy loading
    img.alt = emote.name;
    img.onerror = function() {
        this.outerHTML = '<div class="emote-icon error">?</div>';
    };

    const name = document.createElement('p');
    name.className = 'emote-name';
    name.textContent = emote.name;

    card.appendChild(img);
    card.appendChild(name);

    return card;
}

// Lazy loading observer
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
});

// Observe images for lazy loading
function observeImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// Infinite scroll observer
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && currentIndex < filteredEmotes.length) {
            loadMoreEmotes();
            observeImages();
        }
    });
}, {
    rootMargin: '200px'
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    // Observe loading indicator for infinite scroll
    const loadingElement = document.getElementById('loading');
    scrollObserver.observe(loadingElement);

    // Initial image observation
    observeImages();
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    filteredEmotes = allEmotes.filter(emote => {
        const matchesSearch = searchTerm === '' || 
            emote.name.toLowerCase().includes(searchTerm) ||
            emote.itemID.toString().includes(searchTerm) ||
            emote.icon.toLowerCase().includes(searchTerm);
        
        const matchesRarity = activeRarity === 'ALL' || emote.Rare === activeRarity;
        
        return matchesSearch && matchesRarity;
    });

    displayInitialEmotes();
}

// Handle filter click
function handleFilterClick(e) {
    const btn = e.target;
    const rarity = btn.dataset.rarity;

    // Toggle active state
    if (btn.classList.contains('active')) {
        // Unselect current filter, show all
        btn.classList.remove('active');
        activeRarity = 'ALL';
        document.querySelector('.filter-btn[data-rarity="ALL"]').classList.add('active');
    } else {
        // Remove active from all buttons
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        // Add active to clicked button
        btn.classList.add('active');
        activeRarity = rarity;
    }

    // Apply filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    filteredEmotes = allEmotes.filter(emote => {
        const matchesSearch = searchTerm === '' || 
            emote.name.toLowerCase().includes(searchTerm) ||
            emote.itemID.toString().includes(searchTerm) ||
            emote.icon.toLowerCase().includes(searchTerm);
        
        const matchesRarity = activeRarity === 'ALL' || emote.Rare === activeRarity;
        
        return matchesSearch && matchesRarity;
    });

    displayInitialEmotes();
}

// Open item modal
function openItemModal(emote) {
    const modal = document.getElementById('itemModal');
    const iconUrl = `https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/${emote.itemID}.png`;
    
    document.getElementById('modalIcon').src = iconUrl;
    document.getElementById('modalIcon').onerror = function() {
        this.style.display = 'none';
    };
    document.getElementById('modalName').textContent = emote.name;
    document.getElementById('modalItemID').textContent = emote.itemID;
    document.getElementById('modalIconName').textContent = emote.icon;
    
    const command = `!e ${userUID} ${emote.itemID}`;
    document.getElementById('modalCommand').textContent = command;
    document.getElementById('modalCommand').dataset.command = command;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close item modal
function closeItemModal() {
    document.getElementById('itemModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Close modal on backdrop click
function closeModalOnBackdrop(e) {
    if (e.target.id === 'itemModal') {
        closeItemModal();
    }
}

// Copy command
function copyCommand() {
    const command = document.getElementById('modalCommand').dataset.command;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(command).then(() => {
            showCopyFeedback();
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(command);
        });
    } else {
        fallbackCopy(command);
    }
}

// Fallback copy method
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy command');
    }
    
    document.body.removeChild(textarea);
}

// Show copy feedback
function showCopyFeedback() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.style.background = '#4caf50';
    
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '#ffd700';
    }, 2000);
}