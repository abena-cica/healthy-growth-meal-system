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
  wheelTextNodes.forEach((label, index) => {
    const angle = 45 + (index * 90);
    const isMobile = window.innerWidth <= 600;
    const distance = isMobile ? 96 : 120;
    const isFreeSegment = index === wheelTextNodes.length - 1;
    const scale = isFreeSegment ? 0.86 : (isMobile ? 0.8 : 1);
    const adjustedDistance = isFreeSegment ? distance - 8 : distance;
    label.style.transform = `rotate(${angle}deg) translateY(-${adjustedDistance}px) rotate(-${angle}deg) scale(${scale})`;
  });

  let spinning = false;
  let currentRotation = 0;

  const offers = [
    { label: "GH₵65 OFF", code: "GROW65" },
    { label: "GH₵55 OFF", code: "GROW55" },
    { label: "GH₵45 OFF", code: "GROW45" },
    { label: "FREE WIN", code: "GROWFREE" }
  ];

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

  spinDiscountBtn.addEventListener("click", function () {

    if (spinning) return;

    spinning = true;
    spinDiscountBtn.disabled = true;
    hideWinner();

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
      showWinner(result);
      spinning = false;
    }, 4200);

  });

}