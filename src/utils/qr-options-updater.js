import { isValidForMode, getMinTypeNumber } from "./qr-validation.js";

/**
 * Update the Mode select options based on current data
 */
export function updateModeOptions(nodesBinder, modeSelect) {
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
 * Update the Type Number input's minimum value based on current data
 */
export function updateTypeNumberMin(nodesBinder, typeNumberInput) {
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
