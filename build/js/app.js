const maskOptions = {
   mask: "+{7} (000) 000-00-00",
   // lazy: false,  // make placeholder always visible
   // placeholderChar: '0'     // defaults to '_'
};
if (document.querySelectorAll("[data-phone]").length) {
   document.querySelectorAll("[data-phone]").forEach((item) => {
      const mask = IMask(item, maskOptions);
   });
}
const body = document.body;

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
   home();
   header();
   if (window.innerWidth < 569) {
      accordion(".footer__subheader--accordion", ".footer__spoiler");
   }
   help();
   catalog();
   product();
   files();
});

function header() {
   const header = document.querySelector(".header");
   if (!header) return;
   const hero = document.querySelector(".hero");
   let lastScroll = Math.max(0, window.scrollY);
   let ticking = false;

   if (!hero) {
      header.classList.add("white");
   }

   function onScroll() {
      const currentScroll = Math.max(0, window.scrollY);
      if (currentScroll > lastScroll) {
         makeHidden();
      } else {
         makeWhite();
      }
      if (currentScroll === 0 && hero) {
         makeTransparent();
      }
      lastScroll = currentScroll;
      ticking = false;
   }

   function makeWhite() {
      header.classList.remove("hidden");
      header.classList.add("white");
      document
         .querySelectorAll(".header__wrapper .btn--blur")
         .forEach((item) => {
            item.classList.remove("btn--blur");
            item.classList.add("btn--grey-light");
         });
      document
         .querySelectorAll(".header__wrapper .btn--transparent-white")
         .forEach((item) => {
            item.classList.remove("btn--transparent-white");
            item.classList.add("btn--transparent-black");
         });
   }
   function makeTransparent() {
      header.classList.remove("white");
      document
         .querySelectorAll(".header__wrapper .btn--grey-light")
         .forEach((item) => {
            item.classList.remove("btn--grey-light");
            item.classList.add("btn--blur");
         });
      document
         .querySelectorAll(".header__wrapper .btn--transparent-black")
         .forEach((item) => {
            item.classList.remove("btn--transparent-black");
            item.classList.add("btn--transparent-white");
         });
   }
   function makeHidden() {
      header.classList.add("hidden");
   }

   window.addEventListener("scroll", () => {
      if (!ticking) {
         window.requestAnimationFrame(onScroll);
         ticking = true;
      }
   });
}

function home() {
   function hero() {
      const slider = document.querySelector(".home-hero .swiper");
      if (!slider) return;
      new Swiper(slider, {
         slidesPerView: 1,
         speed: 1500,
         navigation: {
            nextEl: ".home-hero__navigation .next",
            prevEl: ".home-hero__navigation .prev",
         },
         mousewheel: {
            enabled: true,
            forceToAxis: true,
         },
         pagination: {
            el: ".home-hero__pagination",
            type: "custom",
            renderCustom: function (swiper, current, total) {
               const spans = Array.from(
                  { length: total },
                  (_, i) =>
                     `<span${
                        i + 1 === current ? ' class="active"' : ""
                     }></span>`
               ).join("");
               return `<p class="current">${current}</p> <div>${spans}</div> <p class="total">${total}</p>`;
            },
         },
         autoplay: {
            delay: 5000,
            disableOnInteraction: false,
         },
         loop: true,
      });
   }
   function tech() {
      const tech = document.querySelector(".home-tech__wrapper");
      const techBg = document.querySelector(".home-tech__subimage");
      if (!tech || !techBg) return;

      let container = parseFloat(
         getComputedStyle(document.querySelector(".container")).paddingLeft
      );

      let marginTop =
         document.querySelector(".home-tech__main").clientHeight +
         parseFloat(
            getComputedStyle(document.querySelector(".home-tech__main"))
               .marginBottom
         ) +
         parseFloat(
            getComputedStyle(document.querySelector(".home-tech")).paddingTop
         );

      gsap.to(techBg, {
         width: "100vw",
         height: "100vh",

         marginLeft: -1 * container,
         borderRadius: 0,
         ease: "none",
         scrollTrigger: {
            trigger: tech,
            start: `top 10%`,
            end: () => `+=600px`,
            scrub: 0.1,
            invalidateOnRefresh: true,
            // markers: true,
            onUpdate: (self) => {
               const content = tech.querySelector(".home-tech__content");
               const bg = tech.querySelector(".home-tech");
               if (self.progress === 1) {
                  if (!tech._contentShown) {
                     tech._contentShown = true;
                     gsap.to(content, {
                        opacity: 1,
                        ease: "none",
                     });
                     gsap.to(bg, {
                        backgroundColor: "#001836",
                        ease: "none",
                     });
                  }
               } else {
                  if (tech._contentShown || tech._contentShown === undefined) {
                     tech._contentShown = false;
                     gsap.to(content, {
                        opacity: 0,
                        ease: "none",
                     });
                     gsap.to(bg, {
                        backgroundColor: "transparent",
                        ease: "none",
                     });
                  }
               }
            },
         },
      });

      const items = tech.querySelectorAll(".home-tech__item");

      items.forEach((item, index) => {
         ScrollTrigger.create({
            trigger: tech,
            start: `top+=${1200 + index * 350}px 70%`,
            end: `top+=${1200 + (index + 1) * 350}px 70%`,
            onEnter: () => {
               items.forEach((el) => el.classList.remove("active"));
               item.classList.add("active");
            },
            onEnterBack: () => {
               items.forEach((el) => el.classList.remove("active"));
               item.classList.add("active");
            },
         });
      });
   }
   function reagents() {
      const wrapper = document.querySelector(".home-reagents__wrapper");
      const inner = document.querySelector(".home-reagents__inner");
      const list = document.querySelector(".home-reagents__list");
      const radios = document.querySelectorAll(".home-reagents__radios input");
      const labels = document.querySelectorAll(".home-reagents__radios label");
      const tabs = document.querySelectorAll(".home-reagents [data-tab]");
      if (!wrapper || !inner || !list) return;

      const isDesktop = window.innerWidth >= 1024;
      let scrollableDistance;

      if (isDesktop) {
         const listHeight = list.scrollHeight;
         const visibleHeight = list.clientHeight;
         scrollableDistance = listHeight - visibleHeight;
      } else {
         const listWidth = list.scrollWidth;
         const visibleWidth = list.clientWidth;
         scrollableDistance = listWidth - visibleWidth;
      }

      let currentActiveIndex = -1;
      let scrollTriggerInstance;

      if (isDesktop) {
         wrapper.style.height = scrollableDistance + window.innerHeight + "px";
      }

      labels.forEach((label, index) => {
         label.addEventListener("click", () => {
            const items = list.querySelectorAll(".home-reagent");
            if (items[index]) {
               const isDesktopClick = window.innerWidth >= 1024;

               if (isDesktopClick) {
                  const targetScrollPosition = items[index].offsetTop - 100;
                  const targetProgress = Math.min(
                     targetScrollPosition / scrollableDistance,
                     1
                  );

                  const triggerStart = scrollTriggerInstance.start;
                  const triggerEnd = scrollTriggerInstance.end;
                  const targetScrollY =
                     triggerStart +
                     targetProgress * (triggerEnd - triggerStart);

                  window.scrollTo({
                     top: targetScrollY,
                     behavior: "smooth",
                  });
               } else {
                  list.scrollTo({
                     left: items[index].offsetLeft,
                     behavior: "smooth",
                  });
               }

               currentActiveIndex = index;
               radios.forEach((radio) => {
                  radio.checked = false;
               });
               radios[index].checked = true;
               tabs.forEach((tab) => {
                  tab.classList.remove("active");
               });
               tabs[index].classList.add("active");
            }
         });
      });

      function updateActiveItem() {
         const items = list.querySelectorAll(".home-reagent");
         const listRect = list.getBoundingClientRect();

         let newActiveIndex = -1;
         let minDistance = Infinity;

         if (isDesktop) {
            const listCenter = listRect.top + listRect.height / 2;

            items.forEach((item, index) => {
               const itemRect = item.getBoundingClientRect();
               const itemCenter = itemRect.top + itemRect.height / 2;

               if (
                  itemCenter >= listRect.top &&
                  itemCenter <= listRect.bottom
               ) {
                  const distance = Math.abs(itemCenter - listCenter);
                  if (distance < minDistance) {
                     minDistance = distance;
                     newActiveIndex = index;
                  }
               }
            });
         } else {
            const listCenter = listRect.left + listRect.width / 2;

            items.forEach((item, index) => {
               const itemRect = item.getBoundingClientRect();
               const itemCenter = itemRect.left + itemRect.width / 2;

               if (
                  itemCenter >= listRect.left &&
                  itemCenter <= listRect.right
               ) {
                  const distance = Math.abs(itemCenter - listCenter);
                  if (distance < minDistance) {
                     minDistance = distance;
                     newActiveIndex = index;
                  }
               }
            });
         }

         if (newActiveIndex !== currentActiveIndex && newActiveIndex !== -1) {
            currentActiveIndex = newActiveIndex;
            radios.forEach((radio) => {
               radio.checked = false;
            });
            radios[currentActiveIndex].checked = true;
            tabs.forEach((tab) => {
               tab.classList.remove("active");
            });
            tabs[currentActiveIndex].classList.add("active");
         }
      }

      if (isDesktop) {
         scrollTriggerInstance = ScrollTrigger.create({
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
               const progress = self.progress;
               const scrollPosition = scrollableDistance * progress;

               list.scrollTop = scrollPosition;
               updateActiveItem();
            },
            scrub: 0.1,
            pin: inner,
            pinSpacing: false,
         });
      } else {
         list.addEventListener("scroll", updateActiveItem);
      }
   }
   function partners() {
      const slider = document.querySelector(".home-partners .swiper");
      if (!slider) return;
      new Swiper(slider, {
         slidesPerView: "auto",

         spaceBetween: 16,
         navigation: {
            nextEl: ".home-partners__nav .next",
            prevEl: ".home-partners__nav .prev",
         },
         mousewheel: {
            enabled: true,
            forceToAxis: true,
         },
      });
   }
   function media() {
      const slider = document.querySelector(".media-section .swiper");
      if (!slider) return;
      new Swiper(slider, {
         slidesPerView: "auto",
         spaceBetween: 16,
         navigation: {
            nextEl: ".media-section__nav .next",
            prevEl: ".media-section__nav .prev",
         },
         mousewheel: {
            enabled: true,
            forceToAxis: true,
         },
      });
   }
   function geography() {
      const dots = document.querySelectorAll(".home-geography__dot");
      if (!dots) return;
      dots.forEach((dot) => {
         dot.addEventListener("click", () => {
            dots.forEach((el) => el.classList.remove("active"));
            dot.classList.add("active");
         });
      });

      const slider = document.querySelector(".home-geography__preview .swiper");

      new Swiper(slider, {
         slidesPerView: 1,
         spaceBetween: 28,
         navigation: {
            nextEl: ".home-geography__preview .next",
            prevEl: ".home-geography__preview .prev",
         },
         mousewheel: {
            enabled: true,
            forceToAxis: true,
         },
         pagination: {
            el: ".geo-preview__pagination",
            type: "custom",
            renderCustom: function (swiper, current, total) {
               return `<span>${current}</span>/<span>${total}</span>`;
            },
         },
      });
      accordion(".geo-item__header", ".geo-item__spoiler");
   }
   media();
   hero();
   tech();
   reagents();
   partners();
   geography();
}
function help() {
   const form = document.querySelector(".help-section form");
   const success = document.querySelector(".form-success");
   if (!form) return;
   form.addEventListener("submit", (e) => {
      e.preventDefault();
      success.classList.add("active");
   });
}
function catalog() {
   const filters = document.querySelectorAll(".catalog-fitler");
   const filtersContainer = document.querySelector(".catalog-filters");
   const openBtn = document.querySelector(".catalog-main__open .btn");
   if (!filters.length) return;
   if (window.innerWidth < 1025) {
      document.querySelectorAll(".collapse_show").forEach((item) => {
         item.classList.remove("collapse_show");
      });
      document.querySelectorAll(".catalog-fitler__header").forEach((item) => {
         item.classList.remove("active");
      });
   }
   filters.forEach((filter) => {
      const header = filter.querySelector(".catalog-fitler__header");
      const spoiler = filter.querySelector(".catalog-fitler__spoiler");
      header.onclick = () => {
         spoiler.classList.contains("collapse_show")
            ? (slideHide(spoiler), header.classList.remove("active"))
            : (slideShow(spoiler), header.classList.add("active"));
      };
   });
   openBtn.onclick = () => {
      filtersContainer.classList.contains("collapse_show")
         ? (slideHide(filtersContainer), openBtn.classList.remove("active"))
         : (slideShow(filtersContainer), openBtn.classList.add("active"));
   };
}

function product() {
   function chars() {
      const chars = document.querySelectorAll(".product-char");
      if (!chars.length) return;
      chars.forEach((char) => {
         const header = char.querySelector(".product-char__header");
         const spoiler = char.querySelector(".product-char__main");

         header.onclick = () => {
            spoiler.classList.contains("collapse_show")
               ? (slideHide(spoiler), header.classList.remove("active"))
               : (slideShow(spoiler), header.classList.add("active"));
         };
      });
   }
   function other() {
      const other = document.querySelector(".product-other");
      if (!other) return;
      const slider = document.querySelector(".product-other__slider .swiper");
      if (!slider) return;
      new Swiper(slider, {
         spaceBetween: 16,
         navigation: {
            nextEl: ".product-other .next",
            prevEl: ".product-other .prev",
         },
         mousewheel: {
            enabled: true,
            forceToAxis: true,
         },
         breakpoints: {
            0: {
               slidesPerView: "auto",
            },
            1024: {
               slidesPerView: 4,
            },
         },
      });
   }
   function order() {
      const order = document.querySelector(".product-order__content");
      if (!order) return;
      const slider = document.querySelector(".product-order .swiper");
      const listItems = document.querySelectorAll(".product-order__list li");
      if (!slider) return;

      const createProgressCircle = () => {
         const circle = document.createElement("div");
         circle.className = "swiper-progress-circle";
         circle.innerHTML = `
            <svg viewBox="0 0 50 50">
               <circle cx="25" cy="25" r="20" fill="none" stroke="#CFD0D2" stroke-width="2"/>
               <circle cx="25" cy="25" r="20" fill="none" stroke="#001836" stroke-width="2" 
                       stroke-dasharray="125.6" stroke-dashoffset="125.6" 
                       transform="rotate(-90 25 25)" class="progress-circle"/>
            </svg>
         `;
         return circle;
      };

      const progressCircle = createProgressCircle();
      order.appendChild(progressCircle);

      let swiper = new Swiper(slider, {
         spaceBetween: 16,
         effect: "fade",
         autoplay: {
            delay: 5000,
            disableOnInteraction: false,
         },
         allowTouchMove: false,
         loop: true,
         on: {
            slideChange: (swiper) => {
               listItems.forEach((item) => {
                  item.classList.remove("active");
               });
               listItems[swiper.realIndex].classList.add("active");
            },
            autoplayTimeLeft(s, time, progress) {
               const circle = progressCircle.querySelector(".progress-circle");
               const offset = 125.6 * progress;
               circle.style.strokeDashoffset = offset;
            },
         },
      });
      listItems.forEach((item, index) => {
         item.onclick = () => {
            swiper.slideTo(index);
         };
      });
   }
   function navigation() {
      const links = document.querySelectorAll(".product-aside__link");
      const sections = document.querySelectorAll(".product-section");

      if (!links.length || !sections.length) return;

      links.forEach((link, index) => {
         link.addEventListener("click", () => {
            if (sections[index]) {
               const y =
                  sections[index].getBoundingClientRect().top +
                  window.pageYOffset -
                  250;
               window.scrollTo({ top: y, behavior: "smooth" });
            }
         });
      });

      function updateActiveLink() {
         const scrollPosition = window.scrollY + 100;

         let currentIndex = -1;
         sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
               scrollPosition >= sectionTop &&
               scrollPosition < sectionBottom
            ) {
               currentIndex = index;
            }
         });

         if (currentIndex === -1) {
            sections.forEach((section, index) => {
               if (scrollPosition >= section.offsetTop) {
                  currentIndex = index;
               }
            });
         }

         links.forEach((link, index) => {
            link.classList.toggle("active", index === currentIndex);
         });
      }

      let ticking = false;
      function onScroll() {
         if (!ticking) {
            requestAnimationFrame(() => {
               updateActiveLink();
               ticking = false;
            });
            ticking = true;
         }
      }

      window.addEventListener("scroll", onScroll);
      updateActiveLink();
   }
   function btns() {
      const productBtn = document.querySelector(".product-sections__btn");
      const productSections = document.querySelector(".product-sections");

      if (!productBtn || !productSections) return;

      function checkVisibility() {
         const rect = productSections.getBoundingClientRect();
         const windowHeight = window.innerHeight;

         const isInViewport = rect.top <= 0 && rect.bottom >= windowHeight;

         if (isInViewport) {
            productBtn.style.opacity = "1";
            productBtn.style.visibility = "visible";
         } else {
            productBtn.style.opacity = "0";
            productBtn.style.visibility = "hidden";
         }
      }

      window.addEventListener("scroll", checkVisibility);
      checkVisibility();
   }
   navigation();
   chars();
   other();
   order();
   btns();
}

function files() {
   const fileInputs = document.querySelectorAll(".file-input");
   if (!fileInputs.length) return;
   fileInputs.forEach((fileInput) => {
      const input = fileInput.querySelector('input[type="file"]');
      const output = fileInput.querySelector(".file-input__output");
      input.addEventListener("change", () => {
         const file = input.files[0];
         if (file) {
            output.querySelector("span").textContent = file.name;
            output.classList.add("active");
         }
      });
      output.querySelector("button").addEventListener("click", () => {
         input.value = "";
         output.querySelector("span").textContent = "";
         output.classList.remove("active");
      });
   });
}

function accordion(linkSelector, contentSelector) {
   // получаем линки
   const openLinks = document.querySelectorAll(`${linkSelector}`);
   // контенты
   const contents = document.querySelectorAll(`${contentSelector}`);
   if (openLinks.length > 0) {
      for (let i = 0; i < openLinks.length; i++) {
         let openLink = openLinks[i];
         openLink.addEventListener("click", () => {
            // все прячем
            for (let j = 0; j < contents.length; j++) {
               // если хоть один открывается - return
               if (contents[j].classList.contains("collapsing")) {
                  return;
               } // Иначе
               // все прячем
               slideHide(contents[j]);
            }
            for (let j = 0; j < openLinks.length; j++) {
               openLinks[j].classList.remove("active");
            }
            // записываем в переменную нужный таб
            let content = contents[i];
            // работаем с классами линка
            if (content.classList.contains("collapsing")) {
               return;
            } else if (content.classList.contains("collapse_show")) {
               openLink.classList.remove("active");
            } else {
               openLink.classList.add("active");
            }
            // показываем нужный
            slideShow(content);
         });
      }
   }
}

function slideShow(el, duration = 500) {
   // завершаем работу метода, если элемент содержит класс collapsing или collapse_show
   if (
      el.classList.contains("collapsing") ||
      el.classList.contains("collapse_show")
   ) {
      return;
   }
   // удаляем класс collapse
   el.classList.remove("collapse");
   // сохраняем текущую высоту элемента в константу height (это значение понадобится ниже)
   const height = el.offsetHeight;
   // устанавливаем высоте значение 0
   el.style["height"] = 0;
   // не отображаем содержимое элемента, выходящее за его пределы
   el.style["overflow"] = "hidden";
   // создание анимации скольжения с помощью CSS свойства transition
   el.style["transition"] = `height ${duration}ms ease`;
   // добавляем класс collapsing
   el.classList.add("collapsing");
   // получим значение высоты (нам этого необходимо для того, чтобы просто заставить браузер выполнить перерасчет макета, т.к. он не сможет нам вернуть правильное значение высоты, если не сделает это)
   el.offsetHeight;
   // установим в качестве значения высоты значение, которое мы сохранили в константу height
   el.style["height"] = `${height}px`;
   // по истечении времени анимации this._duration
   window.setTimeout(() => {
      // удалим класс collapsing
      el.classList.remove("collapsing");
      // добавим классы collapse и collapse_show
      el.classList.add("collapse");
      el.classList.add("collapse_show");
      // удалим свойства height, transition и overflow
      el.style["height"] = "";
      el.style["transition"] = "";
      el.style["overflow"] = "";
   }, duration);
}
function slideHide(el, duration = 500) {
   // завершаем работу метода, если элемент содержит класс collapsing или collapse_show
   if (
      el.classList.contains("collapsing") ||
      !el.classList.contains("collapse_show")
   ) {
      return;
   }
   // установим свойству height текущее значение высоты элемента
   el.style["height"] = `${el.offsetHeight}px`;
   // получим значение высоты
   el.offsetHeight;
   // установим CSS свойству height значение 0
   el.style["height"] = 0;
   // обрежем содержимое, выходящее за границы элемента
   el.style["overflow"] = "hidden";
   // добавим CSS свойство transition для осуществления перехода длительностью this._duration
   el.style["transition"] = `height ${duration}ms ease`;
   // удалим классы collapse и collapse_show
   el.classList.remove("collapse");
   el.classList.remove("collapse_show");
   // добавим класс collapsing
   el.classList.add("collapsing");
   // после завершения времени анимации
   window.setTimeout(() => {
      // удалим класс collapsing
      el.classList.remove("collapsing");
      // добавим класс collapsing
      el.classList.add("collapse");
      // удалим свойства height, transition и overflow
      el.style["height"] = "";
      el.style["transition"] = "";
      el.style["overflow"] = "";
   }, duration);
}
// Popup
const popupLinks = document.querySelectorAll(".modal__link");
const lockPadding = document.querySelectorAll(".lock-padding");
const popupCloseIcon = document.querySelectorAll(".modal__close");

let unlock = true;

const timeout = 500;

if (popupLinks.length > 0) {
   for (let index = 0; index < popupLinks.length; index++) {
      const popupLink = popupLinks[index];
      popupLink.addEventListener("click", function (e) {
         const popupName = popupLink.getAttribute("href").replace("#", "");
         const curentPopup = document.getElementById(popupName);
         popupOpen(curentPopup);
         e.preventDefault();
      });
   }
}

if (popupCloseIcon.length > 0) {
   for (let index = 0; index < popupCloseIcon.length; index++) {
      const el = popupCloseIcon[index];
      el.addEventListener("click", function (e) {
         popupClose(el.closest(".modal"));
         e.preventDefault();
      });
   }
}

function popupOpen(curentPopup) {
   if (curentPopup && unlock) {
      const popupActive = document.querySelector(".modal.open");
      if (popupActive) {
         popupClose(popupActive, false);
      } else {
         bodyLock();
      }
      curentPopup.classList.add("open");
      curentPopup.addEventListener("click", function (e) {
         if (!e.target.closest(".modal__content")) {
            popupClose(e.target.closest(".modal"));
         }
      });
   }
}
function popupClose(popupActive, doUnlock = true) {
   if (unlock) {
      popupActive.classList.remove("open");
      if (doUnlock) {
         bodyUnLock();
      }
   }
}

function bodyLock() {
   const lockPaddingValue =
      window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";

   if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
         const el = lockPadding[index];
         el.style.paddingRight = lockPaddingValue;
      }
   }
   body.style.paddingRight = lockPaddingValue;
   body.classList.add("lock");
   // lenis.stop();

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

function bodyUnLock() {
   setTimeout(function () {
      if (lockPadding.length > 0) {
         for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = "0px";
         }
      }
      body.style.paddingRight = "0px";
      body.classList.remove("lock");
      // lenis.start();
   }, timeout);

   unlock = false;
   setTimeout(function () {
      unlock = true;
   }, timeout);
}

document.addEventListener("keydown", function (e) {
   if (e.which === 27) {
      const popupActive = document.querySelector(".modal.open");
      popupClose(popupActive);
   }
});
