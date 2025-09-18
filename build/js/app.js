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
});

function header() {
   const header = document.querySelector(".header");
   if (!header) return;
   const hero = document.querySelector(".hero");
   let lastScroll = window.scrollY;
   let ticking = false;

   if (!hero) {
      header.classList.add("white");
   }

   function onScroll() {
      const currentScroll = window.scrollY;
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
               if (self.progress === 1) {
                  if (!tech._contentShown) {
                     tech._contentShown = true;
                     gsap.to(content, {
                        opacity: 1,
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
                  }
               }
            },
         },
      });

      const items = tech.querySelectorAll(".home-tech__item");
      items.forEach((item, index) => {
         ScrollTrigger.create({
            trigger: tech,
            start: `top+=${1200 + index * 350}px 50%`,
            end: `top+=${1200 + (index + 1) * 350}px 50%`,
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

      wrapper.style.height = scrollableDistance + window.innerHeight + "px";

      labels.forEach((label, index) => {
         label.addEventListener("click", () => {
            const items = list.querySelectorAll(".home-reagent");
            if (items[index]) {
               const isDesktopClick = window.innerWidth >= 1024;

               let targetScrollPosition;

               if (isDesktopClick) {
                  targetScrollPosition = items[index].offsetTop - 100;
               } else {
                  targetScrollPosition = items[index].offsetLeft;
               }

               const targetProgress = Math.min(
                  targetScrollPosition / scrollableDistance,
                  1
               );

               const triggerStart = scrollTriggerInstance.start;
               const triggerEnd = scrollTriggerInstance.end;
               const targetScrollY =
                  triggerStart + targetProgress * (triggerEnd - triggerStart);

               window.scrollTo({
                  top: targetScrollY,
                  behavior: "smooth",
               });

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

      scrollTriggerInstance = ScrollTrigger.create({
         trigger: wrapper,
         start: "top top",
         end: "bottom bottom",
         onUpdate: (self) => {
            const progress = self.progress;
            const scrollPosition = scrollableDistance * progress;

            if (isDesktop) {
               list.scrollTop = scrollPosition;
            } else {
               list.scrollLeft = scrollPosition;
            }

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

            if (
               newActiveIndex !== currentActiveIndex &&
               newActiveIndex !== -1
            ) {
               currentActiveIndex = newActiveIndex;
               // console.log(`Активный элемент: ${currentActiveIndex + 1}`);
               radios.forEach((radio) => {
                  radio.checked = false;
               });
               radios[currentActiveIndex].checked = true;
               tabs.forEach((tab) => {
                  tab.classList.remove("active");
               });
               tabs[currentActiveIndex].classList.add("active");
            }
         },
         scrub: 0.1,
         pin: window.innerWidth >= 1024 ? inner : false,
         pinSpacing: false,
      });
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
