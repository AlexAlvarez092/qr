export function setupAccordion(acc) {
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
            // Close all other accordions
            for (let j = 0; j < acc.length; j++) {
                if (acc[j] !== this) {
                    acc[j].classList.remove("accordion--open");
                    acc[j].nextElementSibling.classList.remove("panel--open");
                }
            }

            // Toggle current accordion
            this.classList.toggle("accordion--open");
            this.nextElementSibling.classList.toggle("panel--open");
        });
    }
}

export function setupStylePickers() {
    // Style picker buttons (visual style selection)
    document.querySelectorAll(".style-picker").forEach(picker => {
        const targetId = picker.dataset.target;
        const targetSelect = document.getElementById(targetId);

        picker.querySelectorAll(".style-picker__btn").forEach(btn => {
            btn.addEventListener("click", () => {
                // Update active state
                picker
                    .querySelectorAll(".style-picker__btn")
                    .forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                // Update hidden select and trigger change
                const value = btn.dataset.value;
                targetSelect.value = value;
                targetSelect.dispatchEvent(new window.Event("change", { bubbles: true }));
            });
        });
    });
}
