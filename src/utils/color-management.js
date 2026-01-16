import { defaultColors } from "./defaults.js";

// Helper function to toggle visibility of elements
export function toggleColorTypeVisibility(showClass, hideClass) {
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
export function createGradientConfig(helper) {
    return {
        type: helper.gradient.linear ? "linear" : "radial",
        rotation: (helper.gradient.rotation / 180) * Math.PI,
        colorStops: [
            { offset: 0, color: helper.gradient.color1 },
            { offset: 1, color: helper.gradient.color2 },
        ],
    };
}

// Update reset button disabled state
function updateResetButtonState(inputId, buttonId, optionKey) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    const isDefault = input.value.toLowerCase() === defaultColors[optionKey].toLowerCase();
    button.disabled = isDefault;
    if (isDefault) {
        button.classList.add("opacity-50", "cursor-not-allowed");
    } else {
        button.classList.remove("opacity-50", "cursor-not-allowed");
    }
}

// Color reset button configuration
const colorResetConfig = [
    { inputId: "form-dots-color", buttonId: "button-reset-dots-color", optionKey: "dotsOptions" },
    {
        inputId: "form-corners-square-color",
        buttonId: "button-reset-corners-square-color",
        optionKey: "cornersSquareOptions",
    },
    {
        inputId: "form-corners-dot-color",
        buttonId: "button-reset-corners-dot-color",
        optionKey: "cornersDotOptions",
    },
    {
        inputId: "form-background-color",
        buttonId: "button-reset-background-color",
        optionKey: "backgroundOptions",
    },
];

export function setupColorResets(nodesBinder) {
    // Initialize reset buttons and add listeners
    colorResetConfig.forEach(({ inputId, buttonId, optionKey }) => {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);

        // Initial state
        updateResetButtonState(inputId, buttonId, optionKey);

        // Listen for color changes
        input.addEventListener("input", () => {
            updateResetButtonState(inputId, buttonId, optionKey);
        });

        // Reset button click handler
        button.onclick = () => {
            nodesBinder.setState({ [optionKey]: { color: defaultColors[optionKey] } });
            input.value = defaultColors[optionKey];
            updateResetButtonState(inputId, buttonId, optionKey);
        };
    });
}
