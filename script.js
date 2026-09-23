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

const offerPopup = document.getElementById('offerPopup');
const closeOfferPopup = document.getElementById('closeOfferPopup');
const discountWheelSection = document.querySelector('.discount-wheel-section');

if (offerPopup) {
  let popupIsOpen = false;

  const closePopup = () => {
    popupIsOpen = false;
    document.body.classList.remove('offer-popup-open');
    offerPopup.classList.remove('show');
  };

  const handleWheelReach = () => {
    if (!popupIsOpen) return;
    closePopup();
  };

  const openPopup = () => {
    popupIsOpen = true;
    document.body.classList.add('offer-popup-open');
    offerPopup.classList.add('show');

    setTimeout(() => {
      if (!popupIsOpen) return;
      if (discountWheelSection) {
        discountWheelSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 250);
  };

  setTimeout(() => {
    openPopup();
  }, 500);

  if (closeOfferPopup) {
    closeOfferPopup.addEventListener('click', closePopup);
  }

  offerPopup.addEventListener('click', (event) => {
    if (event.target === offerPopup) closePopup();
  });

  if (discountWheelSection) {
    const wheelObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          handleWheelReach();
          wheelObserver.disconnect();
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });

    wheelObserver.observe(discountWheelSection);
  }
}

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
      copyDiscountCodeBtn.textContent = "Copy";
    }
    const wheelBuyNowBtn = document.getElementById("wheelBuyNowBtn");
    if (wheelBuyNowBtn) {
      wheelBuyNowBtn.hidden = false;
    }
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