// Current year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// FAQ accordion
const faqButtons = document.querySelectorAll('.faq-item button');
faqButtons.forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const wasOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('open'));

    if (!wasOpen) item.classList.add('open');
  });
});

// Smoothly close mobile navigation isn't needed because this page uses a compact CTA-only header.
// Add a small reveal effect as sections enter the viewport.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.product-card, .benefit, .step, .problem-item').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});


const countdownHours = document.getElementById('countdown-hours');
const countdownMinutes = document.getElementById('countdown-minutes');
const countdownSeconds = document.getElementById('countdown-seconds');

if (countdownHours && countdownMinutes && countdownSeconds) {
  const offerDeadline = Date.now() + ((6 * 60 * 60) + (19 * 60) + 42) * 1000;
  let countdownInterval;

  const updateCountdown = () => {
    const remaining = Math.max(0, offerDeadline - Date.now());
    const hours = String(Math.floor(remaining / 3600000)).padStart(2, '0');
    const minutes = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');

    countdownHours.textContent = hours;
    countdownMinutes.textContent = minutes;
    countdownSeconds.textContent = seconds;

    if (remaining === 0) {
      clearInterval(countdownInterval);
    }
  };

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

/* =========================================
   DISCOUNT WHEEL
========================================= */

const discountWheel = document.getElementById("discountWheel");
const spinDiscountBtn = document.getElementById("spinDiscountBtn");
const discountResult = document.getElementById("discountResult");
const wheelModal = document.getElementById("wheelModal");
const modalTitle = document.getElementById("modalTitle");
const couponCode = document.getElementById("couponCode");
const closeWheelModal = document.getElementById("closeWheelModal");
const claimDiscountLink = document.getElementById("claimDiscountLink");
const discountCodeBox = document.getElementById("discountCodeBox");
const discountCodeValue = document.getElementById("discountCodeValue");
const copyDiscountCodeBtn = document.getElementById("copyDiscountCodeBtn");

if (discountWheel && spinDiscountBtn && discountResult) {

  const segmentCenterAngles = [45, 135, 225, 315];

  let spinning = false;
  let currentRotation = 0;
  let wheelAlreadyUsed = localStorage.getItem("healthyGrowthWheelUsed") === "true";
  const oneClientAccessCode = "ONE_CLIENT_ACCESS";

  const enableWheelForOneClient = () => {
    const activationKey = "healthyGrowthWheelAccessEnabled";
    const isEnabled = localStorage.getItem(activationKey) === "true";

    if (isEnabled) return true;

    const response = window.prompt(
      "To enable this discount wheel for one client only, type: ONE_CLIENT_ACCESS",
      ""
    );

    if (response && response.trim().toUpperCase() === oneClientAccessCode) {
      localStorage.setItem(activationKey, "true");
      return true;
    }

    spinDiscountBtn.disabled = true;
    spinDiscountBtn.textContent = "ACCESS LOCKED";
    discountResult.textContent = "Admin access required before this wheel can be used.";
    return false;
  };

  const offers = [
    { label: "GH₵60", code: "GROW60" },
    { label: "GH₵55", code: "GROW55" },
    { label: "GH₵50", code: "GROW50" },
    { label: "FREE", code: "GROWFREE" }
  ];

  function lockWheelAfterUse() {
    wheelAlreadyUsed = true;
    localStorage.setItem("healthyGrowthWheelUsed", "true");
    spinDiscountBtn.disabled = true;
    spinDiscountBtn.textContent = "DISCOUNT UNLOCKED ✓";
    discountResult.textContent = "You already unlocked your discount.";
  }

  function resetWheelToStart() {
    currentRotation = 0;
    discountWheel.style.transform = "rotate(0deg)";
  }

  function showWinner(result) {
    if (modalTitle) modalTitle.textContent = `You unlocked ${result.label}!`;
    if (couponCode) couponCode.textContent = result.code;
    if (claimDiscountLink) {
      claimDiscountLink.setAttribute("aria-label", `Claim ${result.label}`);
    }
    if (wheelModal) {
      wheelModal.classList.add("active");
      wheelModal.setAttribute("aria-hidden", "false");
    }
  }

  function hideWinner() {
    if (wheelModal) {
      wheelModal.classList.remove("active");
      wheelModal.setAttribute("aria-hidden", "true");
    }
  }

  function showCouponCode(result) {
    if (discountCodeBox) discountCodeBox.hidden = false;
    if (discountCodeValue) discountCodeValue.textContent = result.code;
   if (copyDiscountCodeBtn) {

  copyDiscountCodeBtn.addEventListener("click", async function () {

    if (!discountCodeValue) return;

    const textToCopy = discountCodeValue.textContent.trim();

    try {

      // Modern browsers — including supported mobile browsers
      if (navigator.clipboard && window.isSecureContext) {

        await navigator.clipboard.writeText(textToCopy);

      } else {

        // Mobile-friendly fallback
        const textArea = document.createElement("textarea");

        textArea.value = textToCopy;

        textArea.style.position = "fixed";
        textArea.style.left = "0";
        textArea.style.top = "0";
        textArea.style.width = "1px";
        textArea.style.height = "1px";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);

        // Important for mobile browsers
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);

        const successful = document.execCommand("copy");

        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Copy command failed");
        }
      }

      // Success
      copyDiscountCodeBtn.textContent = "Copied! ✓";

      setTimeout(() => {
        copyDiscountCodeBtn.textContent = "Copy";
      }, 2000);

    } catch (error) {

      console.error("Copy failed:", error);

      copyDiscountCodeBtn.textContent = "Tap to copy";

      // Final fallback: select the code so the user can copy it manually
      if (discountCodeValue) {

        const selection = window.getSelection();
        const range = document.createRange();

        range.selectNodeContents(discountCodeValue);

        selection.removeAllRanges();
        selection.addRange(range);
      }

    }

  });

}

  if (!enableWheelForOneClient()) {
    return;
  }

  if (closeWheelModal) {
    closeWheelModal.addEventListener("click", hideWinner);
  }

  if (copyDiscountCodeBtn) {
    copyDiscountCodeBtn.addEventListener("click", async () => {
      if (!discountCodeValue) return;

      const textToCopy = discountCodeValue.textContent.trim();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const tempTextArea = document.createElement("textarea");
          tempTextArea.value = textToCopy;
          tempTextArea.setAttribute("readonly", "");
          tempTextArea.style.position = "fixed";
          tempTextArea.style.top = "-9999px";
          tempTextArea.style.left = "-9999px";
          document.body.appendChild(tempTextArea);
          tempTextArea.select();
          document.execCommand("copy");
          document.body.removeChild(tempTextArea);
        }

        copyDiscountCodeBtn.textContent = "Copied!";
      } catch (error) {
        copyDiscountCodeBtn.textContent = "Copy failed";
      }
    });
  }

  if (wheelModal) {
    wheelModal.addEventListener("click", (event) => {
      if (event.target === wheelModal) hideWinner();
    });
  }

  if (wheelAlreadyUsed) {
    lockWheelAfterUse();
  }

  spinDiscountBtn.addEventListener("click", function () {

    if (spinning || wheelAlreadyUsed) return;

    spinning = true;
    spinDiscountBtn.disabled = true;
    hideWinner();
    resetWheelToStart();

    discountResult.textContent = "Spinning... 🎉";

    const randomIndex = Math.floor(Math.random() * offers.length);
    const selectedAngle = segmentCenterAngles[randomIndex];
    const pointerAngle = 270;
    const targetAngle = ((pointerAngle - selectedAngle) % 360 + 360) % 360;

    currentRotation += 360 * 6 + targetAngle;
    discountWheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
      const result = offers[randomIndex];

      discountResult.innerHTML = `🎉 You unlocked <strong>${result.label}</strong>!`;
      showCouponCode(result);
      spinDiscountBtn.textContent = "DISCOUNT UNLOCKED ✓";
      lockWheelAfterUse();
      resetWheelToStart();
      showWinner(result);
      spinning = false;
    }, 4200);

  });

}
// =========================================
// MOBILE DISCOUNT CODE COPY
// =========================================

const mobileCopyButton = document.getElementById("copyDiscountCodeBtn");
const mobileDiscountCode = document.getElementById("discountCodeValue");

if (mobileCopyButton && mobileDiscountCode) {

  mobileCopyButton.addEventListener("click", async function () {

    const code = mobileDiscountCode.textContent.trim();

    if (!code) return;

    try {

      if (navigator.clipboard && window.isSecureContext) {

        await navigator.clipboard.writeText(code);

      } else {

        const input = document.createElement("input");

        input.value = code;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        input.style.pointerEvents = "none";

        document.body.appendChild(input);

        input.focus();
        input.select();
        input.setSelectionRange(0, input.value.length);

        document.execCommand("copy");

        document.body.removeChild(input);
      }

      mobileCopyButton.textContent = "Copied ✓";

      setTimeout(function () {
        mobileCopyButton.textContent = "Copy";
      }, 2000);

    } catch (error) {

      console.error("Copy failed:", error);

      mobileCopyButton.textContent = "Select Code";

      const range = document.createRange();
      range.selectNodeContents(mobileDiscountCode);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }

  });

}
// =========================================
// WELCOME DISCOUNT POPUP
// =========================================

const offerPopup = document.getElementById('offerPopup');
const closeOfferPopup = document.getElementById('closeOfferPopup');

if (offerPopup) {

  // Show popup immediately when website loads
  window.addEventListener('load', function () {
    offerPopup.classList.add('show');
    document.body.classList.add('offer-popup-open');
  });

  // Close popup
  if (closeOfferPopup) {
    closeOfferPopup.addEventListener('click', function () {
      offerPopup.classList.remove('show');
      document.body.classList.remove('offer-popup-open');
    });
  }

  // Close when clicking outside popup
  offerPopup.addEventListener('click', function (event) {
    if (event.target === offerPopup) {
      offerPopup.classList.remove('show');
      document.body.classList.remove('offer-popup-open');
    }
  });

}
// =========================================
// COPY DISCOUNT CODE
// =========================================

const copyDiscountCodeBtn = document.getElementById("copyDiscountCodeBtn");
const discountCodeValue = document.getElementById("discountCodeValue");

if (copyDiscountCodeBtn && discountCodeValue) {

  copyDiscountCodeBtn.addEventListener("click", async function (event) {

    event.preventDefault();
    event.stopPropagation();

    const code = discountCodeValue.textContent.trim();

    if (!code) {
      return;
    }

    try {

      // Try modern clipboard first
      if (navigator.clipboard && window.isSecureContext) {

        await navigator.clipboard.writeText(code);

      } else {

        // Fallback for browsers where Clipboard API isn't available
        const textArea = document.createElement("textarea");

        textArea.value = code;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);

        const copied = document.execCommand("copy");

        document.body.removeChild(textArea);

        if (!copied) {
          throw new Error("Copy command failed");
        }
      }

      // Success
      copyDiscountCodeBtn.textContent = "Copied ✓";

      setTimeout(function () {
        copyDiscountCodeBtn.textContent = "Copy";
      }, 2000);

    } catch (error) {

      console.error("Copy failed:", error);

      // Select the code for manual copying
      const range = document.createRange();
      range.selectNodeContents(discountCodeValue);

      const selection = window.getSelection();

      selection.removeAllRanges();
      selection.addRange(range);

      copyDiscountCodeBtn.textContent = "Select Code";

      setTimeout(function () {
        copyDiscountCodeBtn.textContent = "Copy";
      }, 2500);
    }

  });

}