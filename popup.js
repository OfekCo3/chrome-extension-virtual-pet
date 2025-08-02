const feedButton = document.getElementById('feed-button');
const changePetButton = document.getElementById('change-pet-button');
const foodOptions = document.getElementById('food-options');
const foodItems = document.getElementsByClassName('food-item');
const speechBubble = document.getElementById('speech-bubble');
const petImage = document.getElementById('pet');
const petSelection = document.getElementById('pet-selection');
const petButtons = document.getElementsByClassName('pet-button');
const happinessBar = document.getElementById('happiness-bar');
const happinessFill = document.getElementById('happiness-fill');
const happinessText = document.getElementById('happiness-text');
const soap = document.getElementById('soap');
const showerButton = document.getElementById('shower-button');
const exitShowerButton = document.getElementById('exit-shower-button');
const body = document.body;


let mode = "default"; // possible values: "default", "shower", "feed", "pick-pet"


const pets = ['cat', 'dog', 'hamster', 'parrot', 'fish'];
let happinessLevel = 0; 
foodOptions.style.display = "none";
petSelection.style.display = "none";
speechBubble.innerText = 'Mouse hover to pet!';  

/***************** Dom content section *****************/
// Load the saved pet preference and happiness level and check last feeding date on DOM content load
document.addEventListener("DOMContentLoaded", () => {
    loadPetPreference();
    loadHappinessMeter();
    checkLastFedDate();
    gradualHappinessDecrease();
});

// Function to save the selected pet in Chrome storage
function savePetPreference(pet) {
    chrome.storage.sync.set({ selectedPet: pet }, () => {
        console.log(`Pet preference saved: ${pet}`);
    });
}

// Save the happiness level to Chrome storage
function saveHappinessMeter(level) {
    chrome.storage.sync.set({ happinessMeter: level }, () => {
        console.log(`Happiness level saved: ${level}%`);
    });
}

// Function to load the saved pet preference from Chrome storage
function loadPetPreference() {
    chrome.storage.sync.get("selectedPet", (result) => {
        const savedPet = result.selectedPet || "cat"; // Default to "cat" if nothing is saved
        petImage.src = `images/pets/${savedPet}.png`;
        speechBubble.innerText = `Welcome back!`;
        changeFishHoverToSwim(savedPet);
        setRegularSpeechBubbleText();
    });
}

// Load the saved happiness meter from Chrome storage
function loadHappinessMeter() {
    chrome.storage.sync.get("happinessMeter", (result) => {
        happinessLevel = result.happinessMeter || 0; // Default to 0 if no saved value
        happinessLevel = 0;
        updateHappinessText(happinessLevel);
    });
}

// Store the current date in Chrome storage
function storeCurrentTime() {
    const currentDate = new Date().getTime();
    chrome.storage.local.set({ lastFedDate: currentDate }, () => {
        console.log("Feeding date saved.");
    });
}
/***************** End Dom content section *****************/

/***************** Helpers section *****************/
// Mode switcher
function switchMode(newMode) {
    if (mode === newMode) newMode = "default";
    mode = newMode;

    // Reset all dynamic UI
    soap.style.display = 'none';
    foodOptions.style.display = 'none';
    petSelection.style.display = 'none';
    exitShowerButton.style.display = 'none';
    body.style.backgroundImage = "url('images/background.jpg')";
    displayMenuButtons("block");

    // Mode-specific behavior
    if (mode === "shower") {
        soap.style.display = 'block';
        exitShowerButton.style.display = 'block';
        body.style.backgroundImage = "url('images/shower_background.png')";
        displayMenuButtons("none");
    } else if (mode === "feed") {
        foodOptions.style.display = 'block';
        displayMenuButtons("none");
    } else if (mode === "pick-pet") {
        petSelection.style.display = 'flex';
        displayMenuButtons("none");
    }
}


// Function to change fish hover method
function changeFishHoverToSwim(selectedPet) {
    petImage.classList.remove('fish');
    if (selectedPet === 'fish') {
        petImage.classList.add('fish');
    }
}

// Function to display/undisplay the menu buttons
function displayMenuButtons(display) {
    feedButton.style.display = display;
    changePetButton.style.display = display;
    showerButton.style.display = display;
}

// Function to set the speechBubble to regular text
function setRegularSpeechBubbleText() {
    setTimeout(() => {
        speechBubble.innerText = 'Mouse hover to pet!';
    }, 1500);
}
/***************** End Helpers section *****************/

/***************** Feed section *****************/
// Toggle food options when "Feed" button is clicked
feedButton.addEventListener('click', () => {
    switchMode(mode === "feed" ? "default" : "feed");
    speechBubble.innerText = 'Please not broccoli!';
});

// Add click event listeners to each food item
// Update happiness when feeding pet
for (let foodItem of foodItems) {
    foodItem.addEventListener('click', () => {
        const happinessBoost = (foodItem.id === 'Broccoli') ? 5 : 10; // Lesser boost for disliked food
        updateHappinessMeter(happinessBoost);
        speechBubble.innerText = foodItem.id === 'Broccoli' ? 'Ew!' : 'Tasty!';
        foodOptions.style.display = "none";
        displayMenuButtons("block");  
        setRegularSpeechBubbleText();
        storeCurrentTime();
    });
}
/***************** End Feed section *****************/

/***************** Change Pet section *****************/
// Toggle pet selection menu when "Peak Pet" button is clicked
changePetButton.addEventListener('click', () => {
    switchMode(mode === "pick-pet" ? "default" : "pick-pet");
});

// Add event listeners for each pet button
for (let i = 0; i < petButtons.length; i++) {
    petButtons[i].addEventListener('click', (event) => {
        const selectedPet = event.target.getAttribute('data-pet');
        petImage.src = `images/pets/${selectedPet}.png`;
        speechBubble.innerText = `Meet your new pet, ${selectedPet}!`;
        changeFishHoverToSwim(selectedPet);

        // Save the selected pet preference
        savePetPreference(selectedPet);

        // Hide the pet selection menu and display back feed and change pet buttons
        petSelection.style.display = "none";
        displayMenuButtons("block");
        setRegularSpeechBubbleText();
    });
}
/***************** End Change Pet section *****************/

/***************** Happiness section *****************/
// Function to edit the text of the happiness bar
function updateHappinessText(level) {
    happinessFill.style.width = `${level}%`;
    happinessText.textContent = `Happiness: ${level}%`;
}

// Helper function to reset happiness level to zero and update meter
function resetHappiness() {
    happinessLevel = 0;
    updateHappinessMeter(0);
}

// Check last feeding time and set happiness to zero if over 24 hours
function checkLastFedDate() {
    chrome.storage.local.get('lastFedDate', (result) => {
        const lastFedDate = result.lastFedDate;
        const currentTime = new Date().getTime();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (lastFedDate) {
            const timeDiff = currentTime - lastFedDate;
            if (timeDiff >= oneDay) {
                resetHappiness(); 
            }
        } else {
            resetHappiness();
        }
    });
}

// Decrease happiness by 1 every 60 seconds
function gradualHappinessDecrease() {
    setInterval(() => {
        if (happinessLevel > 0) {
            happinessLevel--;
            updateHappinessMeter(0);
        }
    }, 60000);
}

// Function to update the happiness meter
function updateHappinessMeter(boost) {
    happinessLevel = Math.max(0, Math.min(100, happinessLevel + boost));
    updateHappinessText(happinessLevel);
    saveHappinessMeter(happinessLevel);
}
/***************** End Happiness section *****************/

/***************** Shower section *****************/
// Helper to check current mode
function isShowerMode() {
  return mode === "shower";
}

// Shower button click toggles mode
showerButton.addEventListener('click', () => {
    switchMode(mode === "shower" ? "default" : "shower");
});

// Move soap with mouse in shower mode
document.addEventListener('mousemove', (e) => {
  if (!isShowerMode()) return;
  soap.style.left = `${e.pageX - 20}px`;
  soap.style.top = `${e.pageY - 20}px`;
});

// Add mouseenter event to pet image in shower mode
// Create bubbles and update happiness when hovering over pet
petImage.addEventListener('mouseenter', () => {
  if (!isShowerMode()) return;
  createBubbles();
  updateHappinessMeter(1);
  speechBubble.innerText = "So fresh!";
  setRegularSpeechBubbleText();
});

// Create bubbles in the shower mode
function createBubbles() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.style.left = `${Math.random() * 100 + 50}px`;
  bubble.style.top = `${Math.random() * 100 + 50}px`;
  document.body.appendChild(bubble);
}

exitShowerButton.addEventListener('click', () => {
    switchMode("default");
});

/***************** End Shower section *****************/
