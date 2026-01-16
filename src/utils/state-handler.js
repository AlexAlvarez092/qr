import { toggleColorTypeVisibility, createGradientConfig } from "./color-management.js";
import { handleImageUpdate } from "./image-handler.js";
import { updateModeOptions, updateTypeNumberMin } from "./qr-options-updater.js";

export function setupStateHandler(nodesBinder, qrCode, typeNumberInput, modeSelect) {
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
        handleImageUpdate(field, data, qrCode);
        if (field === "image") return;

        // Configuration for each options group
        const optionsConfig = {
            dotsOptions: { helper: dotsOptionsHelper, prefix: "dotsOptionsHelper" },
            cornersSquareOptions: {
                helper: cornersSquareOptionsHelper,
                prefix: "cornersSquareOptionsHelper",
            },
            cornersDotOptions: {
                helper: cornersDotOptionsHelper,
                prefix: "cornersDotOptionsHelper",
            },
            backgroundOptions: {
                helper: backgroundOptionsHelper,
                prefix: "backgroundOptionsHelper",
            },
        };

        // Process options for each group
        for (const [optionKey, config] of Object.entries(optionsConfig)) {
            const { helper, prefix } = config;

            // Handle gradient color type selection
            if (field === `${prefix}.colorType.gradient` && data) {
                toggleColorTypeVisibility(
                    `${prefix}.colorType.gradient`,
                    `${prefix}.colorType.single`
                );
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
                toggleColorTypeVisibility(
                    `${prefix}.colorType.single`,
                    `${prefix}.colorType.gradient`
                );
                // Enable color input
                document.getElementById("form-background-color").disabled = false;
                qrCode.update({
                    [optionKey]: {
                        color: state[optionKey].color,
                        gradient: null,
                    },
                });
                return;
            }

            // Handle transparent color type selection
            if (field === `${prefix}.colorType.transparent` && data) {
                // Hide both single and gradient
                Array.from(document.getElementsByClassName(`${prefix}.colorType.single`)).forEach(
                    el => {
                        el.style.visibility = "hidden";
                        el.style.height = "0";
                    }
                );
                Array.from(document.getElementsByClassName(`${prefix}.colorType.gradient`)).forEach(
                    el => {
                        el.style.visibility = "hidden";
                        el.style.height = "0";
                    }
                );
                // Disable color input
                document.getElementById("form-background-color").disabled = true;
                qrCode.update({
                    [optionKey]: { color: null, gradient: null },
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
            updateModeOptions(nodesBinder, modeSelect);
        }

        // Update Type Number minimum when data or QR options change
        if (
            field === "data" ||
            field === "qrOptions.mode" ||
            field === "qrOptions.errorCorrectionLevel"
        ) {
            updateTypeNumberMin(nodesBinder, typeNumberInput);
        }

        // Default: update with the full state
        if (backgroundOptionsHelper?.colorType?.transparent) {
            state.backgroundOptions = { color: null };
        }
        qrCode.update(state);
    });
}
