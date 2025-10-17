const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * Hàm tải template
 *
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html");
 * </script>
 */
function load(selector, path) {
    if ($(selector)) {
        const cached = localStorage.getItem(path);
        if (cached) {
            $(selector).innerHTML = cached;
        }

        fetch(path)
            .then((res) => res.text())
            .then((html) => {
                if (html !== cached) {
                    $(selector).innerHTML = html;
                    localStorage.setItem(path, html);
                }
            })
            .finally(() => {
                window.dispatchEvent(new Event("template-loaded"));
            });
    }
}

/**
 * Hàm kiểm tra một phần tử
 * có bị ẩn bởi display: none không
 */
function isHidden(element) {
    if (!element) return true;

    if (window.getComputedStyle(element).display === "none") {
        return true;
    }

    let parent = element.parentElement;
    while (parent) {
        if (window.getComputedStyle(parent).display === "none") {
            return true;
        }
        parent = parent.parentElement;
    }

    return false;
}

/**
 * Hàm buộc một hành động phải đợi
 * sau một khoảng thời gian mới được thực thi
 */
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

/**
 * Hàm tính toán vị trí arrow cho dropdown
 *
 * Cách dùng:
 * 1. Thêm class "js-dropdown-list" vào thẻ ul cấp 1
 * 2. CSS "left" cho arrow qua biến "--arrow-left-pos"
 */
const calArrowPos = debounce(() => {
    if (isHidden($(".js-dropdown-list"))) return;

    const items = $$(".js-dropdown-list > li");

    items.forEach((item) => {
        const arrowPos = item.offsetLeft + item.offsetWidth / 2;
        item.style.setProperty("--arrow-left-pos", `${arrowPos}px`);
    });
});

// Tính toán lại vị trí arrow khi resize trình duyệt
window.addEventListener("resize", calArrowPos);

// Tính toán lại vị trí arrow sau khi tải template
window.addEventListener("template-loaded", calArrowPos);
load("#header", "./template/header.html");
load("#footer", "./template/footer.html");

/**
 * Toggle navbar on tablet - mobile
 */
function jsToggleActive() {
    $$(".js-toggle-active").forEach((button) => {
        const target = button.dataset.activeTarget;
        console.log(button);
        button.onclick = () => {
            const targetElem = document.getElementById(target);
            if (!targetElem) {
                return console.log("Target not found");
            }
            targetElem.classList.toggle("active");
        };
    });
}
jsToggleActive();
// window.addEventListener("template-loaded", jsToggleActive);

/**
 * Home Range Filter
 */
function range() {
    const minVal = document.querySelector(".min__val");
    const maxVal = document.querySelector(".max__val");
    const priceInputMin = document.querySelector(".min-input");
    const priceInputMax = document.querySelector(".max-input");
    const minGap = 50;
    const range = document.querySelector(".slider-track");

    if (minVal) {
        const sliderMinValue = parseInt(minVal.min);
        const sliderMaxValue = parseInt(maxVal.max);
        slideMin();
        slideMax();
        minVal.oninput = function () {
            slideMin();
        };

        maxVal.oninput = function () {
            slideMax();
        };
        priceInputMin.onchange = function () {
            setMinInput();
        };
        priceInputMax.onchange = function () {
            setMaxInput();
        };
        function slideMin() {
            let gap = parseInt(maxVal.value) - parseInt(minVal.value);
            if (gap <= minGap) {
                minVal.value = parseInt(maxVal.value) - minGap;
            }
            priceInputMin.value = minVal.value;
            setArea();
        }

        function slideMax() {
            let gap = parseInt(maxVal.value) - parseInt(minVal.value);
            if (gap <= minGap) {
                maxVal.value = parseInt(minVal.value) + minGap;
            }
            priceInputMax.value = maxVal.value;
            setArea();
        }

        function setArea() {
            range.style.left = (minVal.value / sliderMaxValue) * 100 + "%";
            range.style.right =
                100 - (maxVal.value / sliderMaxValue) * 100 + "%";
        }

        function setMinInput() {
            let minPrice = parseInt(priceInputMin.value);
            if (minPrice < sliderMinValue) {
                priceInputMin.value = sliderMinValue;
            }
            minVal.value = priceInputMin.value;
            slideMin();
        }
        function setMaxInput() {
            let maxPrice = parseInt(priceInputMax.value);
            if (maxPrice > sliderMaxValue) {
                priceInputMax.value = sliderMaxValue;
            }
            maxVal.value = priceInputMax.value;
            slideMax();
        }
    }
}
window.addEventListener("template-loaded", range);

/* Swiper Product */
const tabsThumb = new Swiper(".desc__tabs", {
    direction: "horizontal",
    loop: false,
    speed: 400,
    spaceBetween: 20,
    slidesPerView: "auto",
    breakpoints: {
        992: {
            spaceBetween: 60,
        },
    },
});

const prdSwiper = new Swiper(".desc__swiper", {
    direction: "horizontal",
    loop: false,
    speed: 400,
    thumbs: {
        swiper: tabsThumb,
    },
});
prdSwiper.slideTo(2, 0 , false);