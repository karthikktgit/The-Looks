        // DOM Elements
        const userImageInput = document.getElementById('userImageInput');
        const dressImageInput = document.getElementById('dressImageInput');
        const userPreview = document.getElementById('userPreview');
        const dressPreview = document.getElementById('dressPreview');
        const userPlaceholder = document.getElementById('userPlaceholder');
        const dressPlaceholder = document.getElementById('dressPlaceholder');
        const previewCanvas = document.getElementById('previewCanvas');
        const previewCtx = previewCanvas.getContext('2d');
        const previewHelpText = document.getElementById('previewHelpText');
        const downloadBtn = document.getElementById('downloadBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        // Event Listeners
        userImageInput.addEventListener('change', function(e) {
            handleImageUpload(e, userPreview, userPlaceholder);
            updatePreview();
        });
        
        dressImageInput.addEventListener('change', function(e) {
            handleImageUpload(e, dressPreview, dressPlaceholder);
            updatePreview();
        });
        
        resetBtn.addEventListener('click', resetAll);
        downloadBtn.addEventListener('click', downloadPreview);
        
        // Set canvas dimensions
        function setupCanvas() {
            const containerWidth = previewCanvas.parentElement.clientWidth;
            previewCanvas.width = containerWidth;
            previewCanvas.height = 256; // Fixed height for consistency
        }
        
        // Handle image upload
        function handleImageUpload(event, previewElement, placeholderElement) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewElement.src = e.target.result;
                    previewElement.classList.remove('hidden');
                    placeholderElement.classList.add('hidden');
                }
                reader.readAsDataURL(file);
            }
        }
        
        // Load sample model
        function loadSampleModel(imageSrc) {
            userPreview.src = imageSrc;
            userPreview.classList.remove('hidden');
            userPlaceholder.classList.add('hidden');
            updatePreview();
        }
        
        // Load dress sample
        function loadDressSample(imageSrc) {
            dressPreview.src = imageSrc;
            dressPreview.classList.remove('hidden');
            dressPlaceholder.classList.add('hidden');
            updatePreview();
        }
        
        // Update the preview canvas
        function updatePreview() {
            if (userPreview.src && dressPreview.src) {
                const userImg = new Image();
                const dressImg = new Image();
                
                userImg.onload = function() {
                    dressImg.onload = function() {
                        // Clear canvas
                        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
                        
                        // Calculate aspect ratios and positions
                        const userAspect = userImg.width / userImg.height;
                        const dressAspect = dressImg.width / dressImg.height;
                        
                        // Draw user image (fit to canvas height, center horizontally)
                        const userHeight = previewCanvas.height;
                        const userWidth = userHeight * userAspect;
                        const userX = (previewCanvas.width - userWidth) / 2;
                        
                        previewCtx.drawImage(userImg, userX, 0, userWidth, userHeight);
                        
                        // Draw dress image (positioned on the body, scaled appropriately)
                        // Note: This is simplified - a real implementation would use pose detection for precise placement
                        const dressHeight = userHeight * 0.5;
                        const dressWidth = dressHeight * dressAspect;
                        const dressX = (previewCanvas.width - dressWidth) / 2;
                        const dressY = userHeight * 0.25; // Position roughly on upper body
                        
                        previewCtx.drawImage(dressImg, dressX, dressY, dressWidth, dressHeight);
                        
                        // Update UI
                        previewHelpText.textContent = "Here's how you'll look!";
                        downloadBtn.disabled = false;
                    };
                    dressImg.src = dressPreview.src;
                };
                userImg.src = userPreview.src;
            } else if (userPreview.src) {
                previewHelpText.textContent = "Now select a dress to see the preview";
            } else if (dressPreview.src) {
                previewHelpText.textContent = "Now upload your photo to see the preview";
            } else {
                previewHelpText.textContent = "Upload your photo and a dress to see the preview";
            }
        }
        
        // Download the preview image
        function downloadPreview() {
            if (!previewCanvas || previewCanvas.width === 0) return;
            
            // Create temporary link
            const link = document.createElement('a');
            link.download = 'the-looks-preview.png';
            link.href = previewCanvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        // Reset all inputs
        function resetAll() {
            // Reset file inputs
            userImageInput.value = '';
            dressImageInput.value = '';
            
            // Hide previews and show placeholders
            userPreview.src = '';
            userPreview.classList.add('hidden');
            userPlaceholder.classList.remove('hidden');
            
            dressPreview.src = '';
            dressPreview.classList.add('hidden');
            dressPlaceholder.classList.remove('hidden');
            
            // Clear canvas
            previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            
            // Reset text and disable download button
            previewHelpText.textContent = "Upload your photo and a dress to see the preview";
            downloadBtn.disabled = true;
        }
        
        // Initialize canvas dimensions
        window.addEventListener('load', function() {
            setupCanvas();
            window.addEventListener('resize', setupCanvas);
        });