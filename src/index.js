import "./style.scss";

document.addEventListener("DOMContentLoaded", () => {
	if (document.title === "Oscar De Filpo") {
		handleMain();
	} else if (document.title === "Oscar De Filpo - Portfolio") {
		handleProjects();
	}
});

function handleMain() {
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

	let didScroll;
	let lastScrollTop = 0;
	const delta = 5;
	const navbarHeight = document.querySelector("header").offsetHeight;
	const header = document.querySelector("header");
	const scroller = document.querySelector(".page");

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
				return section;
			}
		}

		return null;
	}

	const root = document.documentElement;
	const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue(
		"--marquee-elements-displayed"
	);
	const marqueeContent = document.querySelector("ul.marquee-content");

	root.style.setProperty(
		"--marquee-elements",
		marqueeContent.children.length
	);

	for (let i = 0; i < marqueeElementsDisplayed; i++) {
		marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
	}
}

function handleProjects() {
	fetch("./projects/index.json")
		.then((res) => res.json())
		.then((data) => {
			const postsContainer = document.querySelector("#projects");
			data.forEach((post) => {
				const postBlock = document.createElement("div");
				postBlock.classList.add(
					"post",
					"card",
					"p-4",
					"mb-3",
					"text-center",
					"shadow",
					"bg-body-tertiary",
					"border-0"
				);
				const topics = post.metaData.topics.split(", ");
				const tecnologies = post.metaData.tecnologies.split(", ");
				const topicsHtml = topics.map(
					(tag) => `<span class="badge text-bg-dark">${tag}</span>`
				);
				const tecnologiesHtml = tecnologies.map(
					(tag) =>
						`<span class="badge rounded-pill text-bg-secondary">${tag}</span>`
				);
				postBlock.innerHTML = `

					<div class="py-3">${topicsHtml.join(" ")} ${tecnologiesHtml.join(" ")}</div>
					<h2><a href="${
						post.url
					}" class="stretched-link display-3 text-decoration-none">${
					post.metaData.title
				}</a></h2>
					<p>${post.metaData.description}</p>
				`;
				postsContainer.appendChild(postBlock);
			});
		})
		.catch((err) => console.error(err));
}
