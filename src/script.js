// Interactive card stack: klik kartu untuk bertukar posisi
(() => {
  const stack = document.getElementById('cardStack');
  if (!stack) return;
  const cards = [...stack.querySelectorAll('.stack-card')];
  let order = cards.map((_, i) => i);   // order[0] = indeks kartu paling depan
  let busy = false;

  const render = () => order.forEach((ci, pos) => cards[ci].dataset.pos = pos);

  function activate(i) {
    if (busy) return;
    busy = true;
    if (order[0] === i) {
      // kartu depan diklik: terbang ke samping, lalu pindah ke belakang
      cards[i].classList.add('is-leaving');
      setTimeout(() => {
        order.push(order.shift());
        cards[i].classList.remove('is-leaving');
        render();
        setTimeout(() => (busy = false), 450);
      }, 280);
    } else {
      // kartu belakang diklik: naik ke depan, yang lain mundur
      order = [i, ...order.filter(n => n !== i)];
      render();
      setTimeout(() => (busy = false), 450);
    }
  }

  cards.forEach((c, i) => {
    c.addEventListener('click', () => activate(i));
    c.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(i); }
    });
  });
})();


const cardDeck = document.querySelector(".certificate-cards");
const cards = document.querySelectorAll(".certificate-card");

// Ketika card di-hover
cards.forEach((card) => {
  card.addEventListener("pointerenter", () => {

    // Hilangkan active dari card lain
    cards.forEach((item) => {
      item.classList.remove("is-active");
    });

    // Aktifkan card yang dipilih
    card.classList.add("is-active");

  });
});

// Ketika cursor keluar dari seluruh area card
cardDeck.addEventListener("pointerleave", () => {
  cards.forEach((card) => {
    card.classList.remove("is-active");
  });
});

const cardDrag = document.getElementById("linkedin-card-drag");
  const cardLink = document.getElementById("linkedin-card-link");

  let isDragging = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  cardDrag.addEventListener("pointerdown", (e) => {
    // Hanya merespons klik kiri mouse atau sentuhan jari
    if (e.button !== 0 && e.pointerType === "mouse") return;

    isDragging = true;
    hasMoved = false;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
    cardDrag.setPointerCapture(e.pointerId);
  });

  cardDrag.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Anggap sebagai drag jika digeser lebih dari 5px
    if (Math.abs(dx - currentX) > 5 || Math.abs(dy - currentY) > 5) {
      hasMoved = true;
    }

    currentX = dx;
    currentY = dy;
    cardDrag.style.transform = `translate(${currentX}px, ${currentY}px)`;
  });

  cardDrag.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    cardDrag.releasePointerCapture(e.pointerId);

    // Jika tidak digeser, anggap sebagai klik dan buka di tab baru
    if (!hasMoved) {
      window.open(cardLink.href, "_blank", "noopener,noreferrer");
    }
  });

  // Mencegah browser membuka tab ganda jika event click bawaan tetap terpicu
  cardLink.addEventListener("click", (e) => {
    e.preventDefault();
  });
