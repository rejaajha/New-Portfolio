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


//laci BOSSS
  (() => {
    const cabinetDrawer = document.getElementById("projectDrawer");
    const cabinetHandle = document.getElementById("drawerHandle");
    const cabinetCloseBtn = document.getElementById("closeDrawerBtn");

    if (!cabinetDrawer || !cabinetHandle) return;

    const PEEK_WIDTH = 36; // Lebar bibir laci & gagang yang tetap nongol saat tertutup
    let isCabinetOpen = false;
    let isCabinetDragging = false;
    let cabinetStartX = 0;
    let cabinetCurrentX = 0;

    function getClosedOffset() {
      return cabinetDrawer.offsetWidth - PEEK_WIDTH;
    }

    function openCabinet() {
      isCabinetOpen = true;
      cabinetDrawer.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
      cabinetDrawer.style.transform = "translate(0px, -50%)";
    }

    function closeCabinet() {
      isCabinetOpen = false;
      cabinetDrawer.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
      cabinetDrawer.style.transform = `translate(${getClosedOffset()}px, -50%)`;
    }

    // Set posisi awal saat halaman dimuat & saat resize layar
    closeCabinet();
    window.addEventListener("resize", () => {
      if (!isCabinetOpen) closeCabinet();
    });

    if (cabinetCloseBtn) {
      cabinetCloseBtn.addEventListener("click", closeCabinet);
    }

    const onStart = (clientX) => {
      isCabinetDragging = true;
      cabinetStartX = clientX;
      cabinetDrawer.style.transition = "none";
    };

    const onMove = (clientX) => {
      if (!isCabinetDragging) return;
      const maxOffset = getClosedOffset();
      const deltaX = clientX - cabinetStartX;

      if (!isCabinetOpen) {
        cabinetCurrentX = Math.max(0, Math.min(maxOffset, maxOffset + deltaX));
      } else {
        cabinetCurrentX = Math.max(0, Math.min(maxOffset, deltaX));
      }

      cabinetDrawer.style.transform = `translate(${cabinetCurrentX}px, -50%)`;
    };

    const onEnd = (clientX) => {
      if (!isCabinetDragging) return;
      isCabinetDragging = false;
      const moved = Math.abs(clientX - cabinetStartX);

      // Jika diklik biasa tanpa digeser
      if (moved < 5) {
        isCabinetOpen ? closeCabinet() : openCabinet();
        return;
      }

      // Buka penuh jika ditarik lebih dari 25%
      if (cabinetCurrentX < getClosedOffset() * 0.75) {
        openCabinet();
      } else {
        closeCabinet();
      }
    };

    // Mouse Events
    cabinetHandle.addEventListener("mousedown", (e) => onStart(e.clientX));
    window.addEventListener("mousemove", (e) => onMove(e.clientX));
    window.addEventListener("mouseup", (e) => onEnd(e.clientX));

    // Touch Events
    cabinetHandle.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX));
    window.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX));
    window.addEventListener("touchend", (e) => onEnd(e.changedTouches[0].clientX));
  })();


  //Reza Is real spiderman
  (() => {
    const box = document.getElementById("spideyRevealBox");
    const maskLayer = document.getElementById("spideyMaskLayer");

    if (!box || !maskLayer) return;

    const MASK_RADIUS = 115; // Ukuran lingkaran intip topeng Spider-Man (dalam px)

    const updateMaskPosition = (clientX, clientY) => {
      const rect = box.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const gradient = `radial-gradient(circle ${MASK_RADIUS}px at ${x}px ${y}px, rgba(0,0,0,1) 68%, rgba(0,0,0,0) 100%)`;

      maskLayer.style.webkitMaskImage = gradient;
      maskLayer.style.maskImage = gradient;
    };

    box.addEventListener("mouseenter", (e) => {
      maskLayer.style.opacity = "1";
      updateMaskPosition(e.clientX, e.clientY);
    });

    box.addEventListener("mousemove", (e) => {
      updateMaskPosition(e.clientX, e.clientY);
    });

    box.addEventListener("mouseleave", () => {
      maskLayer.style.opacity = "0";
    });

    // Dukungan layar sentuh (HP/Tablet)
    box.addEventListener("touchstart", (e) => {
      maskLayer.style.opacity = "1";
      updateMaskPosition(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    box.addEventListener("touchmove", (e) => {
      updateMaskPosition(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    box.addEventListener("touchend", () => {
      maskLayer.style.opacity = "0";
    });
  })();

  (() => {
    const box = document.getElementById("spideyRevealBox");
    const faceLayer = document.getElementById("myFaceLayer");
    const maskLayer = document.getElementById("spideyMaskLayer");

    if (!box || !maskLayer || !faceLayer) return;

    const MASK_RADIUS = 115; // Ukuran lingkaran intip (dalam px)

    const updateMaskPosition = (clientX, clientY) => {
      const rect = box.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // 1. Masking untuk Topeng Spider-Man (Terlihat DI DALAM lingkaran)
      const maskGradient = `radial-gradient(circle ${MASK_RADIUS}px at ${x}px ${y}px, rgba(0,0,0,1) 68%, rgba(0,0,0,0) 100%)`;
      maskLayer.style.webkitMaskImage = maskGradient;
      maskLayer.style.maskImage = maskGradient;

      // 2. Masking Kebalikan untuk Mukagw.png (Hilang/Bolong DI DALAM lingkaran, terlihat penuh DI LUAR lingkaran)
      const faceHoleGradient = `radial-gradient(circle ${MASK_RADIUS}px at ${x}px ${y}px, rgba(0,0,0,0) 68%, rgba(0,0,0,1) 100%)`;
      faceLayer.style.webkitMaskImage = faceHoleGradient;
      faceLayer.style.maskImage = faceHoleGradient;
    };

    const resetMasks = () => {
      maskLayer.style.opacity = "0";
      // Hapus lubang pada wajah saat kursor keluar
      faceLayer.style.webkitMaskImage = "none";
      faceLayer.style.maskImage = "none";
    };

    box.addEventListener("mouseenter", (e) => {
      maskLayer.style.opacity = "1";
      faceLayer.style.opacity = "1";
      faceLayer.style.filter = "brightness(1)";
      updateMaskPosition(e.clientX, e.clientY);
    });

    box.addEventListener("mousemove", (e) => {
      updateMaskPosition(e.clientX, e.clientY);
    });

    box.addEventListener("mouseleave", resetMasks);

    // Dukungan layar sentuh (HP/Tablet)
    box.addEventListener("touchstart", (e) => {
      maskLayer.style.opacity = "1";
      faceLayer.style.opacity = "1";
      faceLayer.style.filter = "brightness(1)";
      updateMaskPosition(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    box.addEventListener("touchmove", (e) => {
      updateMaskPosition(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    box.addEventListener("touchend", resetMasks);
  })();
