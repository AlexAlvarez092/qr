export function setupDownload(downloadButton, qrCode, exportFormat) {
    downloadButton.addEventListener("click", () => {
        console.log("Downloading QR code as", exportFormat);
        qrCode.download({ extension: exportFormat, name: "qr-code-styling" });
    });
}
