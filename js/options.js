document.addEventListener('DOMContentLoaded', function() {
    // Update range value displays
    document.getElementById('spacingSlider').addEventListener('input', function() {
        document.getElementById('spacingValue').textContent = this.value + 'px';
    });
    
    document.getElementById('interlineSlider').addEventListener('input', function() {
        document.getElementById('interlineValue').textContent = this.value;
    });

    // Load saved settings
    chrome.storage.local.get(['font', 'size', 'spacing', 'interline', 'textColor', 'bgColor'], function(result) {
        document.getElementById('fontSelect').value = result.font || 'OpenDyslexic';
        document.getElementById('sizeSelect').value = result.size || '16px';
        
        const spacingValue = result.spacing || '0';
        document.getElementById('spacingSlider').value = spacingValue;
        document.getElementById('spacingValue').textContent = spacingValue + 'px';
        
        const interlineValue = result.interline || '1.5';
        document.getElementById('interlineSlider').value = interlineValue;
        document.getElementById('interlineValue').textContent = interlineValue;
        
        document.getElementById('textColorPicker').value = result.textColor || '#1F2937';
        document.getElementById('bgColorPicker').value = result.bgColor || '#F9FAFB';
    });

    // Save settings
    document.getElementById('optionsForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const settings = {
            font: document.getElementById('fontSelect').value,
            size: document.getElementById('sizeSelect').value,
            spacing: document.getElementById('spacingSlider').value,
            interline: document.getElementById('interlineSlider').value,
            textColor: document.getElementById('textColorPicker').value,
            bgColor: document.getElementById('bgColorPicker').value
        };

        chrome.storage.local.set(settings, function() {
            // Show confirmation
            const button = document.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Saved!';
            button.style.backgroundColor = '#10B981';
            
            setTimeout(function() {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 2000);
        });
    });
});