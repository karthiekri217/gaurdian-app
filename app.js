const video = document.getElementById('video');
const resultElement = document.getElementById('result');
const objectList = document.getElementById('object-list');

let announcedObjects = new Set(); // Track objects already announced
const CONFIDENCE_THRESHOLD = 0.6; // Minimum confidence to consider a detection valid

// Function to initialize webcam
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use rear camera
        audio: false
    });
    video.srcObject = stream;
    await video.play();
}

// Function to calculate a dummy distance (in meters) based on object size
function calculateDistance(score) {
    return (1 / score).toFixed(2); // Example formula for demonstration
}

// Load COCO-SSD model and perform detection
async function runObjectDetection() {
    const model = await cocoSsd.load(); // Load the pre-trained COCO-SSD model
    resultElement.innerText = "Model loaded. Detecting objects...";

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    async function detectObjects() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const predictions = await model.detect(canvas);

        // Clear previous results
        objectList.innerHTML = '';

        // Track current frame's detected objects
        const currentObjects = new Set();

        predictions.forEach(prediction => {
            const objectName = prediction.class;
            const confidence = prediction.score; // Raw confidence value
            const distance = calculateDistance(confidence);

            // Filter objects by confidence threshold
            if (confidence >= CONFIDENCE_THRESHOLD) {
                const confidencePercentage = (confidence * 100).toFixed(2);

                // Add detected object to the list
                const listItem = document.createElement('li');
                listItem.textContent = `${objectName} - ${confidencePercentage}% confidence, Distance: ${distance} meters`;
                objectList.appendChild(listItem);

                // Add object to the current frame's set
                currentObjects.add(objectName);

                // Announce the object if it hasn't been announced yet
                if (!announcedObjects.has(objectName)) {
                    const utterance = new SpeechSynthesisUtterance(`Detected ${objectName}`);
                    speechSynthesis.speak(utterance);
                    announcedObjects.add(objectName); // Mark as announced
                }
            }
        });

        // If no objects are detected, reset announcements and update the result text
        if (currentObjects.size === 0) {
            resultElement.innerText = "No objects detected.";
            announcedObjects.clear(); // Clear previously announced objects
        } else {
            resultElement.innerText = "Objects detected in the frame.";
        }

        requestAnimationFrame(detectObjects); // Loop detection
    }

    detectObjects();
}

// Start the application
setupCamera()
    .then(runObjectDetection)
    .catch(error => {
        console.error("Error initializing application:", error);
        resultElement.innerText = "Error initializing application.";
    });
