import { getSrcFromFile } from "../utils/file-utils.js";

export function handleImageUpdate(field, data, qrCode) {
    if (field === "image") {
        if (data && data[0]) {
            getSrcFromFile(data[0]).then(result => {
                qrCode.update({ image: result });
            });
        } else {
            qrCode.update({ image: null });
        }
    }
}

export function setupImageReset(imageInput, imageResetBtn, nodesBinder) {
    function updateImageResetButtonState() {
        const hasImage = imageInput.files && imageInput.files.length > 0;
        imageResetBtn.disabled = !hasImage;
        if (!hasImage) {
            imageResetBtn.classList.add("opacity-50", "cursor-not-allowed");
        } else {
            imageResetBtn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    }

    // Initial state
    updateImageResetButtonState();

    // Listen for image changes
    imageInput.addEventListener("input", updateImageResetButtonState);
    imageInput.addEventListener("change", updateImageResetButtonState);

    // Reset button click handler
    imageResetBtn.onclick = () => {
        nodesBinder.setState({ image: new DataTransfer().files });
        updateImageResetButtonState();
    };
}
