// This script changes the font of the webpage to OpenDyslexic

function changeFontToOpenDyslexic() {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        @font-face {
            font-family: 'OpenDyslexic';
            src: url('fonts/OpenDyslexic/OpenDyslexic.ttf') format('opentype');
        }
        body, p, h1, h2, h3, h4, h5, h6, span, a, div {
            font-family: 'OpenDyslexic', sans-serif !important;
        }
    `;
    document.head.appendChild(styleElement);
}

// Run the function to change the font
changeFontToOpenDyslexic();

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

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "changeFont") {
        applyFontChange(message.font);
    }
});