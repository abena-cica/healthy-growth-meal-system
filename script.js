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
    const angle = 36 + (index * 72);
    const isMobile = window.innerWidth <= 600;
    const distance = isMobile ? 96 : 120;
    const scale = isMobile ? 0.8 : 1;
    label.style.transform = `rotate(${angle}deg) translateY(-${distance}px) rotate(-${angle}deg) scale(${scale})`;
  });

  let spinning = false;
  let currentRotation = 0;

  const offers = [
    { label: "GH₵80 OFF", code: "GROW80" },
    { label: "GH₵60 OFF", code: "GROW60" },
    { label: "GH₵40 OFF", code: "GROW40" },
    { label: "GH₵20 OFF", code: "GROW20" },
    { label: "FREE TRY", code: "GROWTRY" }
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
    const segmentAngle = 72;
    const pointerAngle = 270;
    const segmentCenter = randomIndex * segmentAngle + (segmentAngle / 2);
    const targetAngle = ((pointerAngle - segmentCenter) % 360 + 360) % 360;

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