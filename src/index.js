import QrCodeStyling from "qr-code-styling";
import "./index.css";
import NodesBinder from "./js/nodes-binder";
import { getSrcFromFile } from "./js/tools";
import defaultImage from "./assets/logo.png";

const form = document.getElementById("form");
const descriptionContainer = document.getElementById("qr-description");

const nodesBinder = new NodesBinder({
    root: form,
});
const initState = nodesBinder.getState();

delete initState.dotsOptions.gradient;

const qrCode = new QrCodeStyling({
    ...initState,
    image: defaultImage,
});

function updateDescriptionContainerBackground(backgroundColor, qrColor) {
    let leftColor, rightColor;

    if (getPerceptualBrightness(backgroundColor) > getPerceptualBrightness(qrColor)) {
        leftColor = qrColor;
        rightColor = backgroundColor;
    } else {
        leftColor = backgroundColor;
        rightColor = qrColor;
    }

    descriptionContainer.style["background-image"] =
        `linear-gradient(90deg, #000 0%, ${leftColor} 50%, ${rightColor} 100%)`;
}

function getPerceptualBrightness(color) {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    return r + g + b;
}

updateDescriptionContainerBackground(
    initState.dotsOptions.color,
    initState.backgroundOptions.color
);

nodesBinder.onStateUpdate(({ field, data }) => {
    const {
        dotsOptionsHelper,
        cornersSquareOptionsHelper,
        cornersDotOptionsHelper,
        backgroundOptionsHelper,
        ...state
    } = nodesBinder.getState();

    updateDescriptionContainerBackground(state.dotsOptions.color, state.backgroundOptions.color);

    // Handle image field
    if (field === "image") {
        if (data && data[0]) {
            getSrcFromFile(data[0], result => {
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

    // Default: update with the full state
    qrCode.update(state);
});

const qrContainer = document.getElementById("qr-code-generated");

qrCode.append(qrContainer);

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
