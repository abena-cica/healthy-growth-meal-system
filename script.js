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
const discountSpinBtn = document.getElementById("discountSpinBtn");
const discountWheelResult = document.getElementById("discountWheelResult");

if (discountWheel && discountSpinBtn) {

  let spinning = false;
  let currentRotation = 0;

  const offers = [
    "GH₵80 OFF",
    "GH₵60 OFF",
    "GH₵40 OFF",
    "GH₵20 OFF",
    "FREE TRY"
  ];

  discountSpinBtn.addEventListener("click", function () {

    if (spinning) return;

    spinning = true;
    discountSpinBtn.disabled = true;

    discountWheelResult.textContent = "Spinning... 🎉";

    const randomIndex =
      Math.floor(Math.random() * offers.length);

    const segmentAngle = 72;

    const targetAngle =
      360 - (randomIndex * segmentAngle + segmentAngle / 2);

    currentRotation +=
      360 * 6 + targetAngle;

    discountWheel.style.transform =
      `rotate(${currentRotation}deg)`;

    setTimeout(() => {

      const result = offers[randomIndex];

      discountWheelResult.innerHTML =
        `🎉 You unlocked <strong>${result}</strong>!`;

      discountSpinBtn.textContent = "DISCOUNT UNLOCKED ✓";

      spinning = false;

    }, 4200);

  });

}