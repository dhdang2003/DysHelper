chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.readerMode !== undefined) {
        toggleReaderMode(request.readerMode);
    }
    if (request.focusLine !== undefined) {
        toggleFocusLine(request.focusLine);
    }
});


chrome.storage.local.get(['textColor', 'bgColor'], function(result) {
    if (result.textColor && result.bgColor) {
        // Apply the colors to the body of each webpage
        document.body.style.color = result.textColor;
        document.body.style.backgroundColor = result.bgColor;
    }
});


function toggleReaderMode(isOn) {
    if (isOn) {
        // Hide media elements
        Array.from(document.images).forEach(img => img.style.display = 'none');
        Array.from(document.querySelectorAll('video, audio, iframe')).forEach(el => el.style.display = 'none');
    } else {
        // Show media elements
        Array.from(document.images).forEach(img => img.style.display = '');
        Array.from(document.querySelectorAll('video, audio, iframe')).forEach(el => el.style.display = '');
    }
}


function toggleFocusLine(isOn) {
    let ruler = document.getElementById('ruler');
    if (isOn) {
        if (!ruler) {
            ruler = document.createElement('div');
            ruler.id = 'ruler';
            ruler.style.height = '1.4em';
            ruler.style.backgroundColor = 'rgba(0,0,0,0.1)';
            ruler.style.position = 'absolute';
            ruler.style.top = '-100px';
            ruler.style.zIndex = '10000';
            document.body.appendChild(ruler);
        }
        ruler.style.display = 'block';

        document.body.addEventListener('mousemove', function(event) {
            ruler.style.top = (event.pageY - 30) + 'px';
            ruler.style.width = window.innerWidth + 'px';
        });
    } else {
        if (ruler) {
            ruler.style.display = 'none';
        }
    }
}



// Check the saved state for both modes when the page loads
chrome.storage.local.get(['readerMode', 'focusLine'], function(result) {
    if (result.readerMode !== undefined) {
        toggleReaderMode(result.readerMode);
    }
    if (result.focusLine !== undefined) {
        toggleFocusLine(result.focusLine);
    }
});



// Function to create and return a speaker icon element
function createSpeakerIcon() {
    let speakerIcon = document.createElement('div');
    speakerIcon.id = 'speakerIcon';
    speakerIcon.style.position = 'absolute';
    speakerIcon.style.zIndex = '1000';
    speakerIcon.style.display = 'none'; // Initially hidden
    speakerIcon.textContent = '🔊'; // Using emoji as an example
    speakerIcon.style.fontSize = '2em'; // Make the icon twice as big
    speakerIcon.style.backgroundColor = 'white'; // White background
    speakerIcon.style.borderRadius = '50%'; // Optional: makes it circular
    speakerIcon.style.padding = '5px'; // Add some padding around the icon
    // Add more styling as needed
    return speakerIcon;
}


// Append the speaker icon to the body
let speakerIcon = createSpeakerIcon();
document.body.appendChild(speakerIcon);

// Function to show the speaker icon near the text selection
function showSpeakerIcon() {
    let selection = window.getSelection();
    if (!selection.rangeCount) return;

    let range = selection.getRangeAt(0);
    let rect = range.getBoundingClientRect();

    // Position the icon at the top right of the selection
    speakerIcon.style.left = `${rect.right + window.scrollX}px`; // Right of the selection
    speakerIcon.style.top = `${rect.top + window.scrollY - speakerIcon.offsetHeight}px`; // Above the selection
    speakerIcon.style.display = 'block';
}

// Function to read text using Web Speech API
function speak(text) {
    if ('speechSynthesis' in window) {
        var utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    } else {
        console.log("Your browser does not support text-to-speech.");
    }
}

// Event listener for the speaker icon click
speakerIcon.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent the click from triggering other event listeners
    let text = window.getSelection().toString();
    if (text) {
        speak(text);
    }
});

// Event listener for text selection
document.addEventListener('mouseup', function(event) {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        chrome.storage.local.get(['textToSpeechEnabled'], function(result) {
            if (result.textToSpeechEnabled) {
                showSpeakerIcon();
            }
        });
    } else {
        speakerIcon.style.display = 'none'; 
    }
});


chrome.storage.local.get(['font'], function(result) {
    if (result.font) {
        applyFontChange(result.font);
    }
});

function applyFontChange(fontName) {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        @font-face {
            font-family: '${fontName}';
            src: url('fonts/${fontName}/${fontName}.ttf') format('opentype');
        }
        body, p, h1, h2, h3, h4, h5, h6, span, a, div {
            font-family: '${fontName}', sans-serif !important;
        }
    `;
    document.head.appendChild(styleElement);
}
