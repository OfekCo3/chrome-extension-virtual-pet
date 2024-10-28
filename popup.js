const feedButton = document.getElementById('feed-button');
const changePetButton = document.getElementById('change-pet-button');
const foodOptions = document.getElementById('food-options');
const foodItems = document.getElementsByClassName('food-item');
const speechBubble = document.getElementById('speech-bubble');
const petImage = document.getElementById('pet');
const petSelection = document.getElementById('pet-selection');
const petButtons = document.getElementsByClassName('pet-button');
const happinessBar = document.getElementById('happiness-bar');

const pets = ['cat', 'dog', 'hamster', 'parrot', 'fish'];
let happinessLevel = 0; 
foodOptions.style.display = "none";
petSelection.style.display = "none";
speechBubble.innerText = 'Mouse hover to pet!';  

// Function to update the happiness meter
function updateHappinessMeter(increaseBy) {
    happinessLevel = Math.min(100, happinessLevel + increaseBy); 
    document.getElementById('happiness-fill').style.width = happinessLevel + '%';
    saveHappinessMeter(happinessLevel);
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
}

// Function to set the speechBubble to regular text
function setRegularSpeechBubbleText() {
    setTimeout(() => {
        speechBubble.innerText = 'Mouse hover to pet!';
    }, 1500);
}

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
    // chrome.storage.sync.get("happinessMeter", (result) => {
    //     happinessLevel = result.happinessMeter || 0; // Default to 0 if no saved value
    // });
    happinessLevel = 0;
    document.getElementById('happiness-fill').style.width = happinessLevel + '%';

}

// Load the pet preference when the extension opens
document.addEventListener("DOMContentLoaded", loadPetPreference);
document.addEventListener("DOMContentLoaded", loadHappinessMeter);

// Show or hide food options when the "Feed" button is clicked
// Add click event listeners to each food item
// Update happiness when feeding pet
feedButton.addEventListener('click', () => {
    foodOptions.style.display = foodOptions.style.display === "none" ? "block" : "none";
    if (foodOptions.style.display === "block") displayMenuButtons("none");
    speechBubble.innerText = 'Please not broccoli!';

    for (let foodItem of foodItems) {
        foodItem.addEventListener('click', () => {
            const happinessBoost = (foodItem.id === 'Broccoli') ? 5 : 10; // Lesser boost for disliked food
            updateHappinessMeter(happinessBoost);
            speechBubble.innerText = foodItem.id === 'Broccoli' ? 'Ew!' : 'Tasty!';
            foodOptions.style.display = "none";
            displayMenuButtons("block");  
            setRegularSpeechBubbleText();
        });
    }
});

// Toggle pet selection menu when "Change Pet" button is clicked
changePetButton.addEventListener('click', () => {
    displayMenuButtons("none");
    petSelection.style.display = petSelection.style.display === "none" ? "flex" : "none";
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