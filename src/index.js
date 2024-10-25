import "./style.scss";

// Light mode switch
document.getElementById("btnSwitch").addEventListener("click", () => {
	if (document.body.getAttribute("data-bs-theme") == "dark") {
		document.body.setAttribute("data-bs-theme", "light");
	} else {
		document.body.setAttribute("data-bs-theme", "dark");
	}
});

// Nav indicator
const indicator = document.querySelector(".nav-indicator");
const items = document.querySelectorAll(".nav-item");
const mainContainer = document.querySelector("main");
const visibleSections = getVisibleSections(mainContainer);

function handleIndicator(el) {
	items.forEach((item) => {
		item.classList.remove("is-active");
		item.removeAttribute("style");
	});

	indicator.style.width = `${el.offsetWidth}px`;
	indicator.style.left = `${el.offsetLeft}px`;
	indicator.style.backgroundColor = el.getAttribute("active-color");

	el.classList.add("is-active");
	el.style.color = el.getAttribute("active-color");
}

items.forEach((item, index) => {
	item.addEventListener("click", (e) => {
		handleIndicator(e.target);
	});
	item.classList.contains("is-active") && handleIndicator(item);
});

// Nav scroller
let didScroll;
let lastScrollTop = 0;
const delta = 5;
const navbarHeight = document.querySelector("header").offsetHeight;
const header = document.querySelector("header");
const scroller = document.querySelector(".page");

// Aggiungi listener per l'evento mousemove
document.addEventListener("mousemove", handleMoveEvent);
document.addEventListener("touchmove", handleMoveEvent);

function handleMoveEvent(event) {
	if (didScroll) {
		return;
	}

	let moveY;

	if (event.type === "mousemove") {
		moveY = event.clientY;
	} else if (event.type === "touchmove") {
		moveY = event.touches[0].clientY;
	}

	// Verifica se il mouse/tocco si trova sopra l'header
	if (moveY > header.offsetHeight) {
		header.classList.add("scroll-up");
	} else {
		header.classList.remove("scroll-up");
	}
}

scroller.addEventListener("scroll", function () {
	didScroll = true;
});

setInterval(function () {
	if (didScroll) {
		hasScrolled();
		didScroll = false;
	}
}, 250);

function hasScrolled() {
	const st = scroller.scrollTop;
	const visibleSection = getVisibleSections(mainContainer);

	if (Math.abs(lastScrollTop - st) <= delta) {
		return;
	}

	if (st > lastScrollTop && st > navbarHeight) {
		document.querySelector("header").classList.add("scroll-up");
	} else {
		console.log("refs", scroller.innerHeight, scroller.scrollHeight);
		if (st < scroller.scrollHeight) {
			document.querySelector("header").classList.remove("scroll-up");
		}
	}

	lastScrollTop = st;

	if (visibleSection) {
		handleIndicator(
			document.querySelector(`[href="#${visibleSection.id}"]`)
		);
	}
}

function isElementFullyInContainer(element, container) {
	const rect = element.getBoundingClientRect();
	const containerRect = container.getBoundingClientRect();
	const thr = 50;

	const relaxedTop = rect.top - thr;
	const relaxedBottom = rect.bottom + thr;

	const result =
		relaxedBottom > containerRect.top &&
		relaxedTop < containerRect.bottom &&
		relaxedTop < window.innerHeight &&
		rect.bottom > 0;

	return result;
}

function getVisibleSections(container) {
	const sections = document.querySelectorAll(".section");

	for (const section of sections) {
		if (isElementFullyInContainer(section, container)) {
			return section; // Return the first visible section and exit the loop
		}
	}

	return null; // Return null if no visible section is found
}

// Slider loop
const root = document.documentElement;
const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue(
	"--marquee-elements-displayed"
);
const marqueeContent = document.querySelector("ul.marquee-content");

root.style.setProperty("--marquee-elements", marqueeContent.children.length);

for (let i = 0; i < marqueeElementsDisplayed; i++) {
	marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
}

document.addEventListener("DOMContentLoaded", () => {
	const interBubble = document.querySelector(".interactive");
	let curX = 0;
	let curY = 0;
	let tgX = 0;
	let tgY = 0;

	const move = () => {
		curX += (tgX - curX) / 20;
		curY += (tgY - curY) / 20;
		interBubble.style.transform = `translate(${Math.round(
			curX
		)}px, ${Math.round(curY)}px)`;
		requestAnimationFrame(move);
	};

	window.addEventListener("mousemove", (event) => {
		tgX = event.clientX;
		tgY = event.clientY;
	});

	move();
});

const fieldClass = ".p-field-3d";
const itemSize = 100;

const generateRandomPosition = () => {
	const screenWidth = window.innerWidth;
	const screenHeight = window.innerHeight;
	const x = Math.floor(Math.random() * (screenWidth - itemSize));
	const y = Math.floor(Math.random() * (screenHeight - itemSize));
	return { x, y };
};

const extractZValueFromTransform = (transformValue) => {
	const matrix = transformValue.match(/matrix.*\((.+)\)/);
	if (matrix) {
		const values = matrix[1].split(", ");
		if (values.length === 16) {
			// For matrix3d
			return parseFloat(values[14]);
		} else if (values.length === 6) {
			// For matrix (2D transform), z value is 0
			return 0;
		}
	}
	return null;
};

const render3dItems = () => {
	const field = document.querySelector(fieldClass);

	if (field === null) return;
	const fieldImgs = Array.from(field.querySelectorAll("img"));

	fieldImgs.forEach((img) => {
		const randomPos = Math.floor(Math.random() * -500);
		const position = generateRandomPosition();
		img.style.transform = `translate3d(${position.x}px, ${position.y}px, ${randomPos}px)`;
		console.log(position);
	});
};
render3dItems();

document.addEventListener("DOMContentLoaded", () => {
	const field3dImg = document.querySelectorAll(".p-field-3d img");
	for (const filedImg of field3dImg) {
		filedImg.addEventListener("mouseenter", (event) => {
			const target = event.target;
			const targetPosition = getComputedStyle(target).transform;
			const zValue = extractZValueFromTransform(targetPosition);
			const otherImg = document.querySelectorAll(".p-field-3d img");
			for (const img of otherImg) {
				const otherPosition = getComputedStyle(img).transform;
				const otherZvalue = extractZValueFromTransform(otherPosition);
				if (zValue === null || otherZvalue === null) return;
				const blurValue = (1.1 * Math.abs(zValue - otherZvalue)) / 100;
				img.style.filter = `blur(${blurValue}px)`;
			}
		});
	}
});
