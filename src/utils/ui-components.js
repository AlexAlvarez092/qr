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

export function setupThemeSwitcher(themeSwitch, themeSwitchKnob, htmlTag) {
    function updateThemeSwitchUI() {
        const isDark = htmlTag.classList.contains("dark");
        themeSwitch.checked = isDark;
        themeSwitchKnob.style.left = isDark ? "1.5rem" : "0.25rem";
    }

    themeSwitch.addEventListener("change", () => {
        if (themeSwitch.checked) {
            htmlTag.classList.add("dark");
        } else {
            htmlTag.classList.remove("dark");
        }
        updateThemeSwitchUI();
    });

    window.addEventListener("DOMContentLoaded", updateThemeSwitchUI);
}

export function setupMobileDrawer() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const panel = document.getElementById("config-panel");
    const overlay = document.createElement("div");
    overlay.className =
        "fixed inset-0 bg-black/50 z-30 md:hidden opacity-0 pointer-events-none transition-opacity";
    document.body.appendChild(overlay);

    let isOpen = false;

    function openDrawer() {
        if (isOpen) return;
        isOpen = true;
        panel.classList.remove("-translate-x-full");
        panel.classList.add("translate-x-0");
        overlay.classList.remove("opacity-0", "pointer-events-none");
        overlay.classList.add("opacity-100", "pointer-events-auto");
    }

    function closeDrawer() {
        if (!isOpen) return;
        isOpen = false;
        panel.classList.remove("translate-x-0");
        panel.classList.add("-translate-x-full");
        overlay.classList.remove("opacity-100", "pointer-events-auto");
        overlay.classList.add("opacity-0", "pointer-events-none");
    }

    menuBtn.addEventListener("click", openDrawer);
    overlay.addEventListener("click", closeDrawer);
}
