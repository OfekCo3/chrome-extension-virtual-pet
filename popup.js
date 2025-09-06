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
const cleanButton = document.getElementById('clean-button');
const exitCleanButton = document.getElementById('exit-clean-button');
const cleanOptions = document.getElementById('clean-options');
const soapTool = document.getElementById('soap-tool');
const toothbrushTool = document.getElementById('toothbrush-tool');
const sleepButton = document.getElementById('sleep-button');
const wakeUpButton = document.getElementById('wake-up-button');
const toothbrush = document.getElementById('toothbrush');
const playButton = document.getElementById('play-button');
const ball = document.getElementById('ball');
const bubblesToy = document.getElementById('bubbles-toy');
const feather = document.getElementById('feather');
const body = document.body;


let mode = "default"; // possible values: "default", "clean", "clean-shower", "clean-brush", "feed", "play", "pick-pet", "sleep"
let isSleeping = false;
let currentCleanTool = null; // "soap" or "toothbrush"


const pets = ['cat', 'dog', 'hamster', 'parrot', 'fish'];
let happinessLevel = 0; 
let currentPet = 'cat'; 
foodOptions.style.display = "none";
cleanOptions.style.display = "none";
petSelection.style.display = "none";
speechBubble.innerText = 'Mouse hover to pet!';  

/***************** Dom content section *****************/
// Load the saved pet preference and happiness level and check last feeding date on DOM content load
document.addEventListener("DOMContentLoaded", () => {
    loadPetPreference();
    loadHappinessMeter();
    loadSleepMode();
    checkLastFedDate();
    gradualHappinessDecrease();
    startRandomChatter();
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

// Save sleep mode state to Chrome storage
function saveSleepMode(sleeping) {
    chrome.storage.sync.set({ isSleeping: sleeping }, () => {
        console.log(`Sleep mode saved: ${sleeping}`);
    });
}

// Function to load the saved pet preference from Chrome storage
function loadPetPreference() {
    chrome.storage.sync.get("selectedPet", (result) => {
        const savedPet = result.selectedPet || "cat"; // Default to "cat" if nothing is saved
        currentPet = savedPet;
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
        updateHappinessText(happinessLevel);
    });s
}

// Load sleep mode state from Chrome storage
function loadSleepMode() {
    chrome.storage.sync.get("isSleeping", (result) => {
        const wasSleeping = result.isSleeping || false;
        if (wasSleeping) {
            switchMode("sleep");
        }
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
    toothbrush.style.display = 'none';
    ball.style.display = 'none';
    bubblesToy.style.display = 'none';
    feather.style.display = 'none';
    foodOptions.style.display = 'none';
    cleanOptions.style.display = 'none';
    petSelection.style.display = 'none';
    exitCleanButton.style.display = 'none';
    wakeUpButton.style.display = 'none';
    body.style.backgroundImage = "url('images/background.jpg')";
    body.classList.remove('sleep-mode');
    petImage.classList.remove('sleeping');
    currentCleanTool = null;
    displayMenuButtons("block");

    // Mode-specific behavior
    if (mode === "clean") {
        cleanOptions.style.display = 'flex';
        displayMenuButtons("none");
        speechBubble.innerText = 'Choose cleaning tool!';
    } else if (mode === "clean-shower") {
        soap.style.display = 'block';
        exitCleanButton.style.display = 'block';
        body.style.backgroundImage = "url('images/shower_background.png')";
        displayMenuButtons("none");
        currentCleanTool = "soap";
    } else if (mode === "clean-brush") {
        toothbrush.style.display = 'block';
        exitCleanButton.style.display = 'block';
        body.style.backgroundImage = "url('images/background.jpg')";
        displayMenuButtons("none");
        currentCleanTool = "toothbrush";
    } else if (mode === "feed") {
        foodOptions.style.display = 'block';
        displayMenuButtons("none");
    } else if (mode === "play") {
        showCurrentPlayToy();
        displayMenuButtons("none");
        speechBubble.innerText = getPlayInstruction();
    } else if (mode === "pick-pet") {
        petSelection.style.display = 'flex';
        displayMenuButtons("none");
    } else if (mode === "sleep") {
        isSleeping = true;
        body.classList.add('sleep-mode');
        petImage.classList.add('sleeping');
        wakeUpButton.style.display = 'block';
        displayMenuButtons("none");
        speechBubble.innerText = 'Zzz...';
        startSleepBubbles();
        saveSleepMode(true);
    }
    
    // Stop sleep bubbles when exiting sleep mode
    if (mode !== "sleep") {
        isSleeping = false;
        stopSleepBubbles();
        saveSleepMode(false);
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
    cleanButton.style.display = display;
    playButton.style.display = display;
    sleepButton.style.display = display;
}

// Pet dialogue system
const petDialogue = {
    cat: {
        idle: ['Purr...', 'Meow?', 'Pet me!', 'Mouse hover to pet!', 'Mrow~'],
        happy: ['Purr purr! 😸', 'Meow! Love you!', 'So happy! 🐱', 'Purrfect!'],
        food: ['Yum! 😋', 'Tasty!', 'More please!', 'Meow meow!'],
        shower: ['Meow! Water!', 'Getting clean!', 'Purr... fresh!'],
        brush: ['Shiny teeth!', 'Meow! Clean!', 'Sparkly! ✨'],
        play: ['Catch! 🐱', 'Pounce!', 'Play time!', 'Meow! Fun!'],
        sleepy: ['Sleepy cat...', 'Need nap...', 'Yawn... 😴']
    },
    dog: {
        idle: ['Woof!', 'Play with me!', 'Good dog!', 'Mouse hover to pet!', 'Wag wag!'],
        happy: ['Woof woof! 🐕', 'So happy!', 'Best friend!', 'Tail wagging!'],
        food: ['Woof! Delicious!', 'Nom nom!', 'Good food!', 'More treats!'],
        shower: ['Splash time!', 'Getting clean!', 'Woof! Fresh!'],
        brush: ['Clean teeth!', 'Woof! Shiny!', 'Sparkly smile! ✨'],
        play: ['Fetch! 🐕', 'Woof! Catch!', 'Play time!', 'Good dog!'],
        sleepy: ['Sleepy pup...', 'Zzz woof...', 'Dream time... 😴']
    },
    hamster: {
        idle: ['Squeak!', 'Nibble nibble!', 'Tiny squeaks!', 'Mouse hover to pet!', 'Wheek!'],
        happy: ['Squeak squeak! 🐹', 'So tiny and happy!', 'Wheek wheek!', 'Happy hamster!'],
        food: ['Nom nom nom!', 'Cheek stuffing!', 'Yummy seeds!', 'More snacks!'],
        shower: ['Tiny splash!', 'Clean hammy!', 'Squeaky clean!'],
        brush: ['Tiny teeth!', 'Squeak! Clean!', 'Mini sparkles! ✨'],
        play: ['Tiny catch! 🐹', 'Wheek! Play!', 'Rolling ball!', 'Squeak fun!'],
        sleepy: ['Tiny yawn...', 'Sleepy hammy...', 'Zzz squeak... 😴']
    },
    parrot: {
        idle: ['Squawk!', 'Pretty bird!', 'Hello there!', 'Mouse hover to pet!', 'Tweet tweet!'],
        happy: ['Squawk! Happy! 🦜', 'Pretty bird loves you!', 'Tweet tweet joy!', 'Flying high!'],
        food: ['Squawk! Yummy!', 'Tweet! Tasty!', 'Good birdie food!', 'More seeds!'],
        shower: ['Splash bird!', 'Clean feathers!', 'Squawk! Fresh!'],
        brush: ['Clean beak!', 'Squawk! Shiny!', 'Pretty teeth! ✨'],
        play: ['Flying catch! 🦜', 'Squawk! Play!', 'Tweet! Fun!', 'Pretty bird plays!'],
        sleepy: ['Sleepy birdie...', 'Roosting time...', 'Tweet... zzz... 😴']
    },
    fish: {
        idle: ['Blub blub!', 'Swimming around!', 'Fishy thoughts!', 'Mouse hover to pet!', 'Glub!'],
        happy: ['Blub blub! 🐠', 'Happy fish!', 'Swimming with joy!', 'Bubble happiness!'],
        food: ['Nom! Fishy food!', 'Blub! Yummy!', 'Good fish flakes!', 'More please!'],
        shower: ['Extra water!', 'So much water!', 'Blub! Swimming!'],
        brush: ['Clean fish teeth!', 'Blub! Sparkly!', 'Shiny scales! ✨'],
        play: ['Bubble catch! 🐠', 'Blub! Play!', 'Swimming fun!', 'Fishy games!'],
        sleepy: ['Sleepy fish...', 'Floating dreams...', 'Blub... zzz... 😴']
    }
};

// Get random dialogue for current pet and context
function getPetDialogue(context = 'idle') {
    const dialogues = petDialogue[currentPet] || petDialogue['cat'];
    const contextDialogues = dialogues[context] || dialogues['idle'];
    return contextDialogues[Math.floor(Math.random() * contextDialogues.length)];
}

// Show appropriate play toy for current pet
function showCurrentPlayToy() {
    if (currentPet === 'fish') {
        bubblesToy.style.display = 'block';
    } else if (currentPet === 'parrot') {
        feather.style.display = 'block';
    } else {
        ball.style.display = 'block';
    }
}

// Get play instruction based on current pet
function getPlayInstruction() {
    if (currentPet === 'fish') {
        return 'Click to make bubbles!';
    } else if (currentPet === 'parrot') {
        return 'Click to flutter feather!';
    } else {
        return 'Click to throw ball!';
    }
}

// Function to set the speechBubble to regular text
function setRegularSpeechBubbleText() {
    setTimeout(() => {
        if (mode === "sleep") {
            speechBubble.innerText = 'Zzz...';
        } else {
            speechBubble.innerText = getPetDialogue('idle');
        }
    }, 1500);
}

// Random chatter system - pet talks occasionally
let chatterInterval;
function startRandomChatter() {
    if (chatterInterval) clearInterval(chatterInterval);
    chatterInterval = setInterval(() => {
        // Only chat if not in an active mode and not recently interacted
        if (mode === "default" && speechBubble.innerText.includes('pet!') || speechBubble.innerText.includes('hover')) {
            speechBubble.innerText = getPetDialogue('idle');
            setRegularSpeechBubbleText();
        }
    }, 15000); // Chat every 15 seconds
}

function stopRandomChatter() {
    if (chatterInterval) {
        clearInterval(chatterInterval);
        chatterInterval = null;
    }
}
/***************** End Helpers section *****************/

/***************** Feed section *****************/
// Toggle food options when "Feed" button is clicked
feedButton.addEventListener('click', () => {
    switchMode(mode === "feed" ? "default" : "feed");
    speechBubble.innerText = getPetDialogue('food');
});

// Add click event listeners to each food item
// Update happiness when feeding pet
for (let foodItem of foodItems) {
    foodItem.addEventListener('click', () => {
        const happinessBoost = (foodItem.id === 'Broccoli') ? 5 : 10; // Lesser boost for disliked food
        updateHappinessMeter(happinessBoost);
        speechBubble.innerText = foodItem.id === 'Broccoli' ? 'Ew!' : getPetDialogue('food');
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
        currentPet = selectedPet;
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

// Decrease happiness by 1 every 60 seconds (slower when sleeping)
function gradualHappinessDecrease() {
    setInterval(() => {
        if (happinessLevel > 0) {
            // Happiness decreases slower when sleeping (every 2 minutes instead of 1)
            if (mode === "sleep") {
                // Only decrease every other time when sleeping
                if (Math.random() < 0.5) {
                    happinessLevel--;
                    updateHappinessMeter(0);
                }
            } else {
            happinessLevel--;
            updateHappinessMeter(0);
            }
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

/***************** Clean section *****************/
// Helper to check current mode
function isCleanShowerMode() {
  return mode === "clean-shower";
}

// Helper to check brush mode
function isCleanBrushMode() {
  return mode === "clean-brush";
}

// Clean button click toggles clean tool selection
cleanButton.addEventListener('click', () => {
    switchMode(mode === "clean" ? "default" : "clean");
});

// Clean tool selection event listeners
soapTool.addEventListener('click', () => {
    switchMode("clean-shower");
});

toothbrushTool.addEventListener('click', () => {
    switchMode("clean-brush");
});

// Exit clean button
exitCleanButton.addEventListener('click', () => {
    switchMode("default");
});

// Move cleaning tools with mouse
document.addEventListener('mousemove', (e) => {
  if (isCleanShowerMode()) {
    soap.style.left = `${e.pageX - 20}px`;
    soap.style.top = `${e.pageY - 20}px`;
  } else if (isCleanBrushMode()) {
    toothbrush.style.left = `${e.pageX - 20}px`;
    toothbrush.style.top = `${e.pageY - 20}px`;
  }
});

// Add mouseenter event to pet image for all modes
petImage.addEventListener('mouseenter', () => {
  if (isCleanShowerMode()) {
    createBubbles();
    updateHappinessMeter(1);
    speechBubble.innerText = getPetDialogue('shower');
    setRegularSpeechBubbleText();
  } else if (isCleanBrushMode()) {
    createSparkles();
    updateHappinessMeter(1);
    speechBubble.innerText = getPetDialogue('brush');
    setRegularSpeechBubbleText();
  } else if (mode === "sleep") {
    speechBubble.innerText = getPetDialogue('sleepy');
    setTimeout(() => {
      if (mode === "sleep") {
        speechBubble.innerText = 'Zzz...';
      }
    }, 2000);
  } else {
    // Normal petting interaction
    updateHappinessMeter(1);
    speechBubble.innerText = getPetDialogue('happy');
    setRegularSpeechBubbleText();
  }
});

// Create bubbles in the shower mode
function createBubbles() {
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.style.left = `${Math.random() * 100 + 50}px`;
  bubble.style.top = `${Math.random() * 100 + 50}px`;
  document.body.appendChild(bubble);
}

// Create sparkles in the brush mode
function createSparkles() {
  const sparkle = document.createElement('div');
  sparkle.classList.add('sparkle');
  sparkle.innerText = '✨';
  sparkle.style.left = `${Math.random() * 100 + 50}px`;
  sparkle.style.top = `${Math.random() * 100 + 50}px`;
  document.body.appendChild(sparkle);
  
  // Remove sparkle after animation
  setTimeout(() => {
    if (sparkle.parentNode) {
      sparkle.parentNode.removeChild(sparkle);
    }
  }, 1000);
}

/***************** End Clean section *****************/

/***************** Play section *****************/
// Play button click toggles mode
playButton.addEventListener('click', () => {
    switchMode(mode === "play" ? "default" : "play");
});

// Ball click starts ball toss animation (for cat, dog, hamster)
ball.addEventListener('click', () => {
    if (mode !== "play") return;
    
    updateHappinessMeter(2); // Playing gives more happiness
    speechBubble.innerText = getPetDialogue('play');
    
    // Animate ball toss
    animateBallToss();
    
    setTimeout(() => {
        switchMode("default");
    }, 3000); // Auto-exit play mode after 3 seconds
});

// Bubbles toy click for fish
bubblesToy.addEventListener('click', () => {
    if (mode !== "play") return;
    
    updateHappinessMeter(2);
    speechBubble.innerText = getPetDialogue('play');
    
    // Animate bubble burst
    animateBubbleBurst();
    
    setTimeout(() => {
        switchMode("default");
    }, 3000);
});

// Feather click for parrot
feather.addEventListener('click', () => {
    if (mode !== "play") return;
    
    updateHappinessMeter(2);
    speechBubble.innerText = getPetDialogue('play');
    
    // Animate feather flutter
    animateFeatherFlutter();
    
    setTimeout(() => {
        switchMode("default");
    }, 3000);
});

// Ball toss animation
function animateBallToss() {
    ball.classList.add('ball-toss');
    
    // Remove animation class after completion
    setTimeout(() => {
        ball.classList.remove('ball-toss');
    }, 2000);
}

// Bubble burst animation
function animateBubbleBurst() {
    bubblesToy.classList.add('bubble-burst');
    
    setTimeout(() => {
        bubblesToy.classList.remove('bubble-burst');
    }, 2000);
}

// Feather flutter animation
function animateFeatherFlutter() {
    feather.classList.add('feather-flutter');
    
    setTimeout(() => {
        feather.classList.remove('feather-flutter');
    }, 2000);
}

/***************** End Play section *****************/

/***************** Sleep section *****************/
// Sleep button click toggles mode
sleepButton.addEventListener('click', () => {
    switchMode(mode === "sleep" ? "default" : "sleep");
});

// Wake up button exits sleep mode
wakeUpButton.addEventListener('click', () => {
    isSleeping = false;
    switchMode("default");
    speechBubble.innerText = 'Good morning!';
    setRegularSpeechBubbleText();
});


// Create ZZZ bubbles when sleeping
function createSleepBubbles() {
    if (mode !== "sleep") return;
    
    const zzzBubble = document.createElement('div');
    zzzBubble.classList.add('zzz-bubble');
    zzzBubble.innerText = 'Z';
    zzzBubble.style.left = `${Math.random() * 50 + 75}px`;
    zzzBubble.style.top = `${Math.random() * 30 + 80}px`;
    document.body.appendChild(zzzBubble);
    
    // Remove bubble after animation
    setTimeout(() => {
        if (zzzBubble.parentNode) {
            zzzBubble.parentNode.removeChild(zzzBubble);
        }
    }, 3000);
}

// Start sleep bubble generation when entering sleep mode
let sleepBubbleInterval;
function startSleepBubbles() {
    if (sleepBubbleInterval) clearInterval(sleepBubbleInterval);
    sleepBubbleInterval = setInterval(createSleepBubbles, 2000);
}

function stopSleepBubbles() {
    if (sleepBubbleInterval) {
        clearInterval(sleepBubbleInterval);
        sleepBubbleInterval = null;
    }
}
/***************** End Sleep section *****************/
