import QrCodeStyling from "qr-code-styling";
import "./index.css";
import NodesBinder from "./js/nodes-binder";
import { getSrcFromFile } from "./js/tools";
import defaultImage from "./assets/logo.png";

const form = document.getElementById("form");

const nodesBinder = new NodesBinder({
    root: form,
});
const initState = nodesBinder.getState();

delete initState.dotsOptions.gradient;

const qrCode = new QrCodeStyling({
    ...initState,
    image: defaultImage,
});

const typeNumberInput = document.getElementById("form-qr-type-number");
const modeSelect = document.getElementById("form-qr-mode");

/**
 * Check if data is valid for a specific QR mode
 * @param {string} data - The data to check
 * @param {string} mode - QR mode to validate against
 * @returns {boolean} True if data is valid for the mode
 */
function isValidForMode(data, mode) {
    if (!data) {
        return true;
    }

    switch (mode) {
        case "Numeric":
            // Only digits 0-9
            return /^[0-9]*$/.test(data);
        case "Alphanumeric":
            // 0-9, A-Z (uppercase only), space, $%*+-./:
            return /^[0-9A-Z $%*+\-./:]*$/.test(data);
        case "Byte":
            // Any character
            return true;
        default:
            return true;
    }
}

/**
 * Update the Mode select options based on current data
 */
function updateModeOptions() {
    const state = nodesBinder.getState();
    const data = state.data || "";
    const currentMode = state.qrOptions?.mode || "Byte";

    let needsModeChange = false;

    for (const option of modeSelect.options) {
        const isValid = isValidForMode(data, option.value);
        option.disabled = !isValid;

        // If current mode is now invalid, we need to change it
        if (option.value === currentMode && !isValid) {
            needsModeChange = true;
        }
    }

    // If current mode is invalid, switch to Byte (always valid)
    if (needsModeChange) {
        modeSelect.value = "Byte";
        nodesBinder.setState({ qrOptions: { mode: "Byte" } });
    }
}

/**
 * Calculate the minimum Type Number required for the given data
 * @param {string} data - The data to encode
 * @param {string} mode - QR mode (Numeric, Alphanumeric, Byte, Kanji)
 * @param {string} errorCorrectionLevel - Error correction level (L, M, Q, H)
 * @returns {number} Minimum Type Number (1-40) or 0 if auto works
 */
function getMinTypeNumber(data, mode, errorCorrectionLevel) {
    // Approximate capacities for Byte mode at each error correction level
    // These are conservative estimates
    const capacities = {
        L: [
            17, 32, 53, 78, 106, 134, 154, 192, 230, 271, 321, 367, 425, 458, 520, 586, 644, 718,
            792, 858, 929, 1003, 1091, 1171, 1273, 1367, 1465, 1528, 1628, 1732, 1840, 1952, 2068,
            2188, 2303, 2431, 2563, 2699, 2809, 2953,
        ],
        M: [
            14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560,
            624, 666, 711, 779, 857, 911, 997, 1059, 1125, 1190, 1264, 1370, 1452, 1538, 1628, 1722,
            1809, 1911, 1989, 2099, 2213, 2331,
        ],
        Q: [
            11, 20, 32, 46, 60, 74, 86, 108, 130, 151, 177, 203, 241, 258, 292, 322, 364, 394, 442,
            482, 509, 565, 611, 661, 715, 751, 805, 868, 908, 982, 1030, 1112, 1168, 1228, 1283,
            1351, 1423, 1499, 1579, 1663,
        ],
        H: [
            7, 14, 24, 34, 44, 58, 64, 84, 98, 119, 137, 155, 177, 194, 220, 250, 280, 310, 338,
            382, 403, 439, 461, 511, 535, 593, 625, 658, 698, 742, 790, 842, 898, 958, 983, 1051,
            1093, 1139, 1219, 1273,
        ],
    };

    const dataLength = data ? data.length : 0;
    const caps = capacities[errorCorrectionLevel] || capacities.Q;

    for (let i = 0; i < caps.length; i++) {
        if (dataLength <= caps[i]) {
            return i + 1; // Type Number is 1-indexed
        }
    }

    return 40; // Maximum
}

/**
 * Update the Type Number input's minimum value based on current data
 */
function updateTypeNumberMin() {
    const state = nodesBinder.getState();
    const data = state.data || "";
    const mode = state.qrOptions?.mode || "Byte";
    const errorCorrectionLevel = state.qrOptions?.errorCorrectionLevel || "Q";

    const minTypeNumber = getMinTypeNumber(data, mode, errorCorrectionLevel);
    typeNumberInput.min = minTypeNumber;

    // If current value is less than minimum, update it
    const currentValue = parseInt(typeNumberInput.value, 10) || 0;
    if (currentValue !== 0 && currentValue < minTypeNumber) {
        typeNumberInput.value = minTypeNumber;
        nodesBinder.setState({ qrOptions: { typeNumber: minTypeNumber } });
    }
}

nodesBinder.onStateUpdate(({ field, data }) => {
    const {
        // eslint-disable-next-line no-unused-vars
        image, // Excluded from state to prevent passing FileList to qrCode.update()
        dotsOptionsHelper,
        cornersSquareOptionsHelper,
        cornersDotOptionsHelper,
        backgroundOptionsHelper,
        ...state
    } = nodesBinder.getState();

    // Handle image field
    if (field === "image") {
        if (data && data[0]) {
            getSrcFromFile(data[0]).then(result => {
                qrCode.update({ image: result });
            });
        } else {
            qrCode.update({ image: null });
        }
        return;
    }

    // Configuration for each options group
    const optionsConfig = {
        dotsOptions: { helper: dotsOptionsHelper, prefix: "dotsOptionsHelper" },
        cornersSquareOptions: {
            helper: cornersSquareOptionsHelper,
            prefix: "cornersSquareOptionsHelper",
        },
        cornersDotOptions: { helper: cornersDotOptionsHelper, prefix: "cornersDotOptionsHelper" },
        backgroundOptions: { helper: backgroundOptionsHelper, prefix: "backgroundOptionsHelper" },
    };

    // Helper function to toggle visibility of elements
    function toggleColorTypeVisibility(showClass, hideClass) {
        Array.from(document.getElementsByClassName(showClass)).forEach(el => {
            el.style.visibility = "visible";
            el.style.height = "auto";
        });
        Array.from(document.getElementsByClassName(hideClass)).forEach(el => {
            el.style.visibility = "hidden";
            el.style.height = "0";
        });
    }

    // Helper function to create gradient config
    function createGradientConfig(helper) {
        return {
            type: helper.gradient.linear ? "linear" : "radial",
            rotation: (helper.gradient.rotation / 180) * Math.PI,
            colorStops: [
                { offset: 0, color: helper.gradient.color1 },
                { offset: 1, color: helper.gradient.color2 },
            ],
        };
    }

    // Process options for each group
    for (const [optionKey, config] of Object.entries(optionsConfig)) {
        const { helper, prefix } = config;

        // Handle gradient color type selection
        if (field === `${prefix}.colorType.gradient` && data) {
            toggleColorTypeVisibility(`${prefix}.colorType.gradient`, `${prefix}.colorType.single`);
            qrCode.update({
                [optionKey]: {
                    color: undefined,
                    gradient: createGradientConfig(helper),
                },
            });
            return;
        }

        // Handle single color type selection
        if (field === `${prefix}.colorType.single` && data) {
            toggleColorTypeVisibility(`${prefix}.colorType.single`, `${prefix}.colorType.gradient`);
            qrCode.update({
                [optionKey]: {
                    color: state[optionKey].color,
                    gradient: null,
                },
            });
            return;
        }

        // Handle gradient type: linear
        if (field === `${prefix}.gradient.linear` && data) {
            qrCode.update({ [optionKey]: { gradient: { type: "linear" } } });
            return;
        }

        // Handle gradient type: radial
        if (field === `${prefix}.gradient.radial` && data) {
            qrCode.update({ [optionKey]: { gradient: { type: "radial" } } });
            return;
        }

        // Handle gradient color1
        if (field === `${prefix}.gradient.color1`) {
            qrCode.update({
                [optionKey]: {
                    gradient: {
                        colorStops: [
                            { offset: 0, color: data },
                            { offset: 1, color: helper.gradient.color2 },
                        ],
                    },
                },
            });
            return;
        }

        // Handle gradient color2
        if (field === `${prefix}.gradient.color2`) {
            qrCode.update({
                [optionKey]: {
                    gradient: {
                        colorStops: [
                            { offset: 0, color: helper.gradient.color1 },
                            { offset: 1, color: data },
                        ],
                    },
                },
            });
            return;
        }

        // Handle gradient rotation
        if (field === `${prefix}.gradient.rotation`) {
            qrCode.update({
                [optionKey]: {
                    gradient: {
                        rotation: (helper.gradient.rotation / 180) * Math.PI,
                    },
                },
            });
            return;
        }
    }

    // Convert numeric fields from string to number
    if (state.qrOptions && state.qrOptions.typeNumber !== undefined) {
        state.qrOptions.typeNumber = parseInt(state.qrOptions.typeNumber, 10) || 0;
    }

    // Update Mode options when data changes
    if (field === "data") {
        updateModeOptions();
    }

    // Update Type Number minimum when data or QR options change
    if (
        field === "data" ||
        field === "qrOptions.mode" ||
        field === "qrOptions.errorCorrectionLevel"
    ) {
        updateTypeNumberMin();
    }

    // Default: update with the full state
    qrCode.update(state);
});

const qrContainer = document.getElementById("qr-code-generated");

qrCode.append(qrContainer);

// Initialize Mode options and Type Number minimum on page load
updateModeOptions();
updateTypeNumberMin();

document.getElementById("button-cancel").onclick = () => {
    nodesBinder.setState({ image: new DataTransfer().files });
};

document.getElementById("button-clear-corners-square-color").onclick = () => {
    const state = nodesBinder.getState();
    nodesBinder.setState({
        cornersSquareOptions: {
            color: state.dotsOptions.color,
        },
    });
};

document.getElementById("button-clear-corners-dot-color").onclick = () => {
    const state = nodesBinder.getState();
    nodesBinder.setState({
        cornersDotOptions: {
            color: state.dotsOptions.color,
        },
    });
};

document.getElementById("qr-download").onclick = () => {
    const extension = document.getElementById("qr-extension").value;
    qrCode.download({ extension, name: "qr-code-styling" });
};

//Download options
// document.getElementById("export-options").addEventListener("click", function () {
//     const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(qrCode._options))}`;
//     this.setAttribute("href", dataStr);
//     this.setAttribute("download", "options.json");
// });

//Accordion
const acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("accordion--open");

        const panel = this.nextElementSibling;
        panel.classList.toggle("panel--open");
    });
}
