import QrCodeStyling from "qr-code-styling";
import "./index.css";
import NodesBinder from "./utils/nodes-binder";
import { setupStateHandler } from "./utils/state-handler.js";
import { updateModeOptions, updateTypeNumberMin } from "./utils/qr-options-updater.js";
import { setupImageReset } from "./utils/image-handler.js";
import { setupColorResets } from "./utils/color-management.js";
import { setupDownload } from "./utils/download.js";
import { setupAccordion, setupStylePickers } from "./utils/ui-components.js";

const form = document.getElementById("form");

const nodesBinder = new NodesBinder({
    root: form,
});
const initState = nodesBinder.getState();

delete initState.dotsOptions.gradient;

const qrCode = new QrCodeStyling({
    ...initState,
    image: "",
});

const typeNumberInput = document.getElementById("form-qr-type-number");
const modeSelect = document.getElementById("form-qr-mode");

// Configure state handler
setupStateHandler(nodesBinder, qrCode, typeNumberInput, modeSelect);

const qrContainer = document.getElementById("qr-code-generated");
qrCode.append(qrContainer);

// Initialize Mode options and Type Number minimum on page load
updateModeOptions(nodesBinder, modeSelect);
updateTypeNumberMin(nodesBinder, typeNumberInput);

// Image handling
const imageInput = document.getElementById("form-image-file");
const imageResetBtn = document.getElementById("button-cancel");
setupImageReset(imageInput, imageResetBtn, nodesBinder);

// Color resets
setupColorResets(nodesBinder);

// Download
const exportFormat = "png";
const downloadButton = document.getElementById("qr-download");
setupDownload(downloadButton, qrCode, exportFormat);

// UI components
setupStylePickers();
setupAccordion(document.getElementsByClassName("accordion"));
