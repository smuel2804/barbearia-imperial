/* =========================================================
   BARBEARIA IMPERIAL — JavaScript
   Projeto demonstrativo para portfólio
   ========================================================= */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];


/* =========================================================
   HEADER + MENU MOBILE
   ========================================================= */

const header = $(".header");
const menuToggle = $(".menu-toggle");
const navPanel = $(".nav-panel");

const closeMenu = () => {
  menuToggle?.classList.remove("active");
  navPanel?.classList.remove("open");

  document.body.classList.remove("menu-open");

  menuToggle?.setAttribute(
    "aria-expanded",
    "false"
  );
};


menuToggle?.addEventListener("click", () => {

  const isOpen =
    navPanel.classList.toggle("open");

  menuToggle.classList.toggle(
    "active",
    isOpen
  );

  document.body.classList.toggle(
    "menu-open",
    isOpen
  );

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

});


$$(".nav-links a, .nav-cta").forEach(link => {

  link.addEventListener(
    "click",
    closeMenu
  );

});


window.addEventListener("scroll", () => {

  header?.classList.toggle(
    "scrolled",
    window.scrollY > 30
  );

});


/* =========================================================
   ANIMAÇÕES AO ROLAR A PÁGINA
   ========================================================= */

const revealObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "visible"
          );

          revealObserver.unobserve(
            entry.target
          );

        }

      });

    },

    {
      threshold: 0.14,
    }

  );


$$(".reveal").forEach(element => {

  revealObserver.observe(element);

});


/* =========================================================
   LINK ATIVO NO MENU
   ========================================================= */

const sections =
  $$("main section[id]");

const navLinks =
  $$(".nav-links a");


const sectionObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach(link => {

          const sectionLink =
            link.getAttribute("href");

          const currentSection =
            `#${entry.target.id}`;

          link.classList.toggle(
            "active",
            sectionLink === currentSection
          );

        });

      });

    },

    {
      rootMargin:
        "-35% 0px -55% 0px",

      threshold: 0,
    }

  );


sections.forEach(section => {

  sectionObserver.observe(section);

});


/* =========================================================
   EFEITO DE LUZ NOS CARDS
   ========================================================= */

$$(".spotlight-card").forEach(card => {

  card.addEventListener(
    "pointermove",
    event => {

      const rect =
        card.getBoundingClientRect();

      const mouseX =
        event.clientX - rect.left;

      const mouseY =
        event.clientY - rect.top;

      card.style.setProperty(
        "--mouse-x",
        `${mouseX}px`
      );

      card.style.setProperty(
        "--mouse-y",
        `${mouseY}px`
      );

    }
  );

});


/* =========================================================
   CONTADORES ANIMADOS
   ========================================================= */

const counters =
  $$(".counter");


const counterObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }

        const counter =
          entry.target;

        const target =
          Number(
            counter.dataset.target
          );

        const duration = 1100;

        const start =
          performance.now();


        const update = now => {

          const progress =
            Math.min(
              (now - start) / duration,
              1
            );

          const eased =
            1 -
            Math.pow(
              1 - progress,
              3
            );

          counter.textContent =
            Math.round(
              target * eased
            );


          if (progress < 1) {

            requestAnimationFrame(
              update
            );

          }

        };


        requestAnimationFrame(
          update
        );


        counterObserver.unobserve(
          counter
        );

      });

    },

    {
      threshold: 0.6,
    }

  );


counters.forEach(counter => {

  counterObserver.observe(
    counter
  );

});


/* =========================================================
   COMPARADOR ANTES E DEPOIS
   ========================================================= */

const comparison =
  $("[data-before-after]");


if (comparison) {

  const range =
    $(".before-after-range", comparison);

  const overlay =
    $(".before-after-overlay", comparison);

  const handle =
    $(".before-after-handle", comparison);

  const overlayImage =
    $(
      ".before-after-overlay img",
      comparison
    );


  const updateComparison =
    value => {

      overlay.style.width =
        `${value}%`;

      handle.style.left =
        `${value}%`;

      overlayImage.style.width =
        `${comparison.clientWidth}px`;

    };


  range.addEventListener(
    "input",
    event => {

      updateComparison(
        event.target.value
      );

    }
  );


  window.addEventListener(
    "resize",
    () => {

      updateComparison(
        range.value
      );

    }
  );


  updateComparison(
    range.value
  );

}


/* =========================================================
   LIGHTBOX DA GALERIA
   ========================================================= */

const lightbox =
  $(".lightbox");

const lightboxImage =
  $(".lightbox img");

const lightboxClose =
  $(".lightbox-close");


const closeLightbox = () => {

  lightbox?.classList.remove(
    "open"
  );

  lightbox?.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "lightbox-open"
  );

};


$$(".gallery-item").forEach(item => {

  item.addEventListener(
    "click",
    () => {

      lightboxImage.src =
        item.dataset.image;

      lightbox.classList.add(
        "open"
      );

      lightbox.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "lightbox-open"
      );

    }
  );

});


lightboxClose?.addEventListener(
  "click",
  closeLightbox
);


lightbox?.addEventListener(
  "click",
  event => {

    if (event.target === lightbox) {

      closeLightbox();

    }

  }
);


/* ESC fecha menu e galeria */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeLightbox();
      closeMenu();

    }

  }
);


/* =========================================================
   CARROSSEL DE AVALIAÇÕES
   ========================================================= */

const testimonialCards =
  $$(".testimonial-card");

const dotsContainer =
  $(".testimonial-dots");

let testimonialIndex = 0;


/* Cria automaticamente as bolinhas */

testimonialCards.forEach(
  (_, index) => {

    const dot =
      document.createElement(
        "button"
      );

    dot.setAttribute(
      "aria-label",
      `Ir para avaliação ${index + 1}`
    );


    dot.addEventListener(
      "click",
      () => {

        showTestimonial(
          index
        );

      }
    );


    dotsContainer?.appendChild(
      dot
    );

  }
);


const testimonialDots =
  $$(".testimonial-dots button");


function showTestimonial(index) {

  testimonialIndex =
    (
      index +
      testimonialCards.length
    ) %
    testimonialCards.length;


  testimonialCards.forEach(
    (card, i) => {

      card.classList.toggle(
        "active",
        i === testimonialIndex
      );

    }
  );


  testimonialDots.forEach(
    (dot, i) => {

      dot.classList.toggle(
        "active",
        i === testimonialIndex
      );

    }
  );

}


/* Botão anterior */

$(".testimonial-prev")
  ?.addEventListener(
    "click",
    () => {

      showTestimonial(
        testimonialIndex - 1
      );

    }
  );


/* Botão próximo */

$(".testimonial-next")
  ?.addEventListener(
    "click",
    () => {

      showTestimonial(
        testimonialIndex + 1
      );

    }
  );


showTestimonial(0);


/* Troca automaticamente */

setInterval(
  () => {

    showTestimonial(
      testimonialIndex + 1
    );

  },

  6500
);


/* =========================================================
   FAQ / ACORDEÃO
   ========================================================= */

$$(".faq-question").forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const item =
          button.closest(
            ".faq-item"
          );


        const wasOpen =
          item.classList.contains(
            "open"
          );


        /* Fecha os outros */

        $$(".faq-item").forEach(
          faq => {

            faq.classList.remove(
              "open"
            );

          }
        );


        /* Abre o escolhido */

        if (!wasOpen) {

          item.classList.add(
            "open"
          );

        }

      }
    );

  }
);


/* =========================================================
   FORMULÁRIO DE AGENDAMENTO
   ========================================================= */

const bookingForm =
  $("#booking-form");


bookingForm?.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const name =
      $("#name").value.trim();

    const service =
      $("#service").value;

    const date =
      $("#date").value;

    const time =
      $("#time").value;


    /* Converte a data para padrão brasileiro */

    const formattedDate =
      date

        ? new Date(
            `${date}T12:00:00`
          ).toLocaleDateString(
            "pt-BR"
          )

        : "";


    /* Mensagem enviada para WhatsApp */

    const message = [

      "Olá! Gostaria de agendar um horário na Barbearia Imperial.",

      "",

      `Nome: ${name}`,

      `Serviço: ${service}`,

      `Data: ${formattedDate}`,

      `Horário: ${time}`,

    ].join("\n");


    /* =====================================================
       ALTERE O NÚMERO AQUI

       Formato:
       55 + DDD + telefone

       Exemplo:
       5511999999999
       ===================================================== */

    const whatsappNumber =
      "5511999999999";


    const url =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  }
);


/* =========================================================
   IMPEDE ESCOLHER DATA ANTERIOR A HOJE
   ========================================================= */

const dateInput =
  $("#date");


if (dateInput) {

  const today =
    new Date();


  const yyyy =
    today.getFullYear();


  const mm =
    String(
      today.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const dd =
    String(
      today.getDate()
    ).padStart(
      2,
      "0"
    );


  dateInput.min =
    `${yyyy}-${mm}-${dd}`;

}


/* =========================================================
   BOTÕES MAGNÉTICOS
   ========================================================= */

/*
   Só ativa em aparelhos com mouse.
   No celular o efeito fica desativado.
*/

if (
  window.matchMedia(
    "(pointer: fine)"
  ).matches
) {

  $$(".magnetic").forEach(
    button => {

      button.addEventListener(
        "mousemove",
        event => {

          const rect =
            button.getBoundingClientRect();


          const x =
            event.clientX -
            rect.left -
            rect.width / 2;


          const y =
            event.clientY -
            rect.top -
            rect.height / 2;


          button.style.transform =
            `translate(
              ${x * 0.08}px,
              ${y * 0.08}px
            )`;

        }
      );


      button.addEventListener(
        "mouseleave",
        () => {

          button.style.transform =
            "";

        }
      );

    }
  );


  /* =======================================================
     LUZ QUE SEGUE O MOUSE
     ======================================================= */

  const glow =
    $(".cursor-glow");


  window.addEventListener(
    "pointermove",
    event => {

      if (!glow) {
        return;
      }


      glow.style.left =
        `${event.clientX}px`;


      glow.style.top =
        `${event.clientY}px`;

    }
  );

}