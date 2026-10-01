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
const offerPopupSeeOffer = document.getElementById('offerPopupSeeOffer');
const discountWheelSection = document.getElementById('discountWheel');

if (offerPopup) {
  const closeOffer = () => {
    offerPopup.classList.remove('show');
    document.body.classList.remove('offer-popup-open');
  };

  offerPopup.classList.add('show');
  document.body.classList.add('offer-popup-open');

  if (closeOfferPopup) closeOfferPopup.addEventListener('click', closeOffer);
  if (offerPopupSeeOffer) offerPopupSeeOffer.addEventListener('click', closeOffer);
  offerPopup.addEventListener('click', event => {
    if (event.target === offerPopup) closeOffer();
  });

  if (discountWheelSection) {
    const popupWheelObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) closeOffer();
    }, { threshold: 0.2 });
    popupWheelObserver.observe(discountWheelSection);
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
  const wheelTestMode = new URLSearchParams(window.location.search).get('wheelTest');
  const isWheelTestMode = wheelTestMode === '1' || wheelTestMode === 'free';
  const forceFreeResult = wheelTestMode === 'free';

  let spinning = false;
  let currentRotation = 0;
  let wheelAlreadyUsed = !isWheelTestMode && localStorage.getItem("healthyGrowthWheelUsed") === "true";

  const offers = [
    { label: "GH₵60", code: "GROW60" },
    { label: "GH₵55", code: "GROW55" },
    { label: "GH₵50", code: "GROW50" },
    { label: "FREE", code: "GROWFREE" }
  ];

  function lockWheelAfterUse() {
    wheelAlreadyUsed = true;
    if (!isWheelTestMode) localStorage.setItem("healthyGrowthWheelUsed", "true");
    spinDiscountBtn.disabled = true;
    spinDiscountBtn.textContent = "DISCOUNT UNLOCKED ✓";
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
  }

  if (closeWheelModal) {
    closeWheelModal.addEventListener("click", hideWinner);
  }

  if (copyDiscountCodeBtn) {
    copyDiscountCodeBtn.onclick = async () => {
      if (!discountCodeValue) return;

      const textToCopy = discountCodeValue.textContent.trim();
      let copied = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          copied = true;
        } catch (error) {
          copied = false;
        }
      }

      if (!copied) {
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = textToCopy;
        tempTextArea.setAttribute("readonly", "");
        tempTextArea.style.position = "fixed";
        tempTextArea.style.top = "0";
        tempTextArea.style.left = "0";
        tempTextArea.style.width = "1px";
        tempTextArea.style.height = "1px";
        tempTextArea.style.opacity = "0";
        document.body.appendChild(tempTextArea);
        tempTextArea.focus();
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, textToCopy.length);
        copied = document.execCommand("copy");
        document.body.removeChild(tempTextArea);
      }

      if (copied) {
        copyDiscountCodeBtn.textContent = "Copied!";
      } else {
        copyDiscountCodeBtn.textContent = "Select code";
      }
    };
  }

  if (wheelModal) {
    wheelModal.addEventListener("click", (event) => {
      if (event.target === wheelModal) hideWinner();
    });
  }

  if (wheelAlreadyUsed) lockWheelAfterUse();

  spinDiscountBtn.addEventListener("click", function () {

    if (spinning || wheelAlreadyUsed) return;

    spinning = true;
    spinDiscountBtn.disabled = true;
    hideWinner();
    resetWheelToStart();

    discountResult.textContent = "Spinning... 🎉";

    const freePrizeWon = forceFreeResult || Math.random() < 0.01;
    const randomIndex = freePrizeWon ? 3 : Math.floor(Math.random() * 3);
    const selectedAngle = segmentCenterAngles[randomIndex];
    const pointerAngle = 270;
    const targetAngle = ((pointerAngle - selectedAngle) % 360 + 360) % 360;

    currentRotation += 360 * 6 + targetAngle;
    discountWheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
      const result = offers[randomIndex];

      discountResult.innerHTML = `🎉 You unlocked <strong>${result.label}</strong>!`;
      showCouponCode(result);
      if (isWheelTestMode) {
        spinDiscountBtn.disabled = false;
        spinDiscountBtn.textContent = "TEST AGAIN";
      } else {
        lockWheelAfterUse();
      }
      resetWheelToStart();
      showWinner(result);
      spinning = false;
    }, 4200);

  });

}

