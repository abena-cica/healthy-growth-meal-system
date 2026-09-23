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
  const openPopup = () => {
    document.body.classList.add('offer-popup-open');
    offerPopup.classList.add('show');

    if (discountWheelSection) {
      setTimeout(() => {
        discountWheelSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    }
  };

  const closePopup = () => {
    document.body.classList.remove('offer-popup-open');
    offerPopup.classList.remove('show');
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
          closePopup();
          wheelObserver.disconnect();
        }
      });
    }, { threshold: 0.45 });

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

if (discountWheel && spinDiscountBtn && discountResult) {

  const wheelTextNodes = document.querySelectorAll('.wheel-text');
  const segmentCenters = [50, 150, 250, 330];

  wheelTextNodes.forEach((label, index) => {
    const angle = segmentCenters[index] ?? 45 + (index * 90);
    const isMobile = window.innerWidth <= 600;
    const distance = isMobile ? 96 : 120;
    const isFreeSegment = index === wheelTextNodes.length - 1;
    const scale = isFreeSegment ? 0.88 : (isMobile ? 0.8 : 1);
    const adjustedDistance = isFreeSegment ? distance - 4 : distance;
    label.style.transform = `rotate(${angle}deg) translateY(-${adjustedDistance}px) rotate(-${angle}deg) scale(${scale})`;
  });

  let spinning = false;
  let currentRotation = 0;
  let wheelAlreadyUsed = localStorage.getItem("healthyGrowthWheelUsed") === "true";

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

  if (closeWheelModal) {
    closeWheelModal.addEventListener("click", hideWinner);
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
    const selectedLabel = wheelTextNodes[randomIndex];
    const wheelRect = discountWheel.getBoundingClientRect();
    const wheelCenterX = wheelRect.left + (wheelRect.width / 2);
    const wheelCenterY = wheelRect.top + (wheelRect.height / 2);
    const selectedRect = selectedLabel.getBoundingClientRect();
    const selectedCenterX = selectedRect.left + (selectedRect.width / 2);
    const selectedCenterY = selectedRect.top + (selectedRect.height / 2);

    const selectedAngle = (Math.atan2(selectedCenterY - wheelCenterY, selectedCenterX - wheelCenterX) * 180 / Math.PI + 360) % 360;
    const pointerAngle = 270;
    const targetAngle = ((pointerAngle - selectedAngle) % 360 + 360) % 360;

    currentRotation += 360 * 6 + targetAngle;
    discountWheel.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
      const result = offers[randomIndex];

      discountResult.innerHTML = `🎉 You unlocked <strong>${result.label}</strong>!`;
      spinDiscountBtn.textContent = "DISCOUNT UNLOCKED ✓";
      lockWheelAfterUse();
      resetWheelToStart();
      showWinner(result);
      spinning = false;
    }, 4200);

  });

}