import './style.scss';
import _ from 'lodash';
import * as bootstrap from 'bootstrap';

// Light mode switch
document.getElementById('btnSwitch').addEventListener('click',()=>{
  if (document.body.getAttribute('data-bs-theme') == 'dark') {
    document.body.setAttribute('data-bs-theme', 'light');
  } else {
    document.body.setAttribute('data-bs-theme', 'dark');
  }
})

// Nav indicator
const indicator = document.querySelector('.nav-indicator');
const items = document.querySelectorAll('.nav-item');
const mainContainer = document.querySelector('main');
const visibleSections = getVisibleSections(mainContainer);

function handleIndicator(el) {
  items.forEach(item => {
    item.classList.remove('is-active');
    item.removeAttribute('style');
  });

  indicator.style.width = `${el.offsetWidth}px`;
  indicator.style.left = `${el.offsetLeft}px`;
  indicator.style.backgroundColor = el.getAttribute('active-color');

  el.classList.add('is-active');
  el.style.color = el.getAttribute('active-color');
}


items.forEach((item, index) => {
  item.addEventListener('click', e => {handleIndicator(e.target);});
  item.classList.contains('is-active') && handleIndicator(item);
});

// Nav scroller
let didScroll;
let lastScrollTop = 0;
const delta = 5;
const navbarHeight = document.querySelector('header').offsetHeight;
const header = document.querySelector('header');
const scroller = document.querySelector('.page');

// Aggiungi listener per l'evento mousemove
document.addEventListener('mousemove', handleMoveEvent);
document.addEventListener('touchmove', handleMoveEvent);

function handleMoveEvent(event) {
    if (didScroll) {
        return;
    }

    let moveY;

    if (event.type === 'mousemove') {
        moveY = event.clientY;
    } else if (event.type === 'touchmove') {
        moveY = event.touches[0].clientY;
    }

    // Verifica se il mouse/tocco si trova sopra l'header
    if (moveY > header.offsetHeight) {
        header.classList.add('scroll-up');
    } else {
        header.classList.remove('scroll-up');
    }
}

scroller.addEventListener('scroll', function() {
    didScroll = true;
});

setInterval(function() {
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
    
    if (st > lastScrollTop && st > navbarHeight){
        document.querySelector('header').classList.add('scroll-up');
    } else {
        console.log("refs",scroller.innerHeight, scroller.scrollHeight)
        if (st < scroller.scrollHeight) {
            document.querySelector('header').classList.remove('scroll-up');
        }
    }
    
    lastScrollTop = st;

    if (visibleSection) {
        handleIndicator(document.querySelector(`[href="#${visibleSection.id}"]`));
    }
}

function isElementFullyInContainer(element, container) {
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const thr = 50;

    const relaxedTop = rect.top - thr;
    const relaxedBottom = rect.bottom + thr;

    const result = relaxedBottom > containerRect.top &&
    relaxedTop < containerRect.bottom &&
    relaxedTop < window.innerHeight &&
    rect.bottom > 0;

    return result;
}

function getVisibleSections(container) {
    const sections = document.querySelectorAll('.section');

    for (const section of sections) {
        if (isElementFullyInContainer(section, container)) {
            return section; // Return the first visible section and exit the loop
        }
    }

    return null; // Return null if no visible section is found
}
