(()=>{"use strict";document.getElementById("btnSwitch").addEventListener("click",(()=>{"dark"==document.body.getAttribute("data-bs-theme")?document.body.setAttribute("data-bs-theme","light"):document.body.setAttribute("data-bs-theme","dark")}));const e=document.querySelector(".nav-indicator"),t=document.querySelectorAll(".nav-item"),o=document.querySelector("main");function n(o){t.forEach((e=>{e.classList.remove("is-active"),e.removeAttribute("style")})),e.style.width=`${o.offsetWidth}px`,e.style.left=`${o.offsetLeft}px`,e.style.backgroundColor=o.getAttribute("active-color"),o.classList.add("is-active"),o.style.color=o.getAttribute("active-color")}let r;a(o),t.forEach(((e,t)=>{e.addEventListener("click",(e=>{n(e.target)})),e.classList.contains("is-active")&&n(e)}));let c=0;const l=document.querySelector("header").offsetHeight,s=document.querySelector("header"),d=document.querySelector(".page");function i(e){if(r)return;let t;"mousemove"===e.type?t=e.clientY:"touchmove"===e.type&&(t=e.touches[0].clientY),t>s.offsetHeight?s.classList.add("scroll-up"):s.classList.remove("scroll-up")}function u(e,t){const o=e.getBoundingClientRect(),n=t.getBoundingClientRect(),r=o.top-50;return o.bottom+50>n.top&&r<n.bottom&&r<window.innerHeight&&o.bottom>0}function a(e){const t=document.querySelectorAll(".section");for(const o of t)if(u(o,e))return o;return null}document.addEventListener("mousemove",i),document.addEventListener("touchmove",i),d.addEventListener("scroll",(function(){r=!0})),setInterval((function(){r&&(function(){const e=d.scrollTop,t=a(o);Math.abs(c-e)<=5||(e>c&&e>l?document.querySelector("header").classList.add("scroll-up"):(console.log("refs",d.innerHeight,d.scrollHeight),e<d.scrollHeight&&document.querySelector("header").classList.remove("scroll-up")),c=e,t&&n(document.querySelector(`[href="#${t.id}"]`)))}(),r=!1)}),250);const m=document.documentElement,f=getComputedStyle(m).getPropertyValue("--marquee-elements-displayed"),h=document.querySelector("ul.marquee-content");m.style.setProperty("--marquee-elements",h.children.length);for(let e=0;e<f;e++)h.appendChild(h.children[e].cloneNode(!0));document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector(".interactive");let t=0,o=0,n=0,r=0;const c=()=>{t+=(n-t)/20,o+=(r-o)/20,e.style.transform=`translate(${Math.round(t)}px, ${Math.round(o)}px)`,requestAnimationFrame(c)};window.addEventListener("mousemove",(e=>{n=e.clientX,r=e.clientY})),c()}));const y=e=>{const t=e.match(/matrix.*\((.+)\)/);if(t){const e=t[1].split(", ");if(16===e.length)return parseFloat(e[14]);if(6===e.length)return 0}return null};(()=>{const e=document.querySelector(".p-field-3d");null!==e&&Array.from(e.querySelectorAll("img")).forEach((e=>{const t=Math.floor(-500*Math.random()),o=(()=>{const e=window.innerWidth,t=window.innerHeight;return{x:Math.floor(Math.random()*(e-100)),y:Math.floor(Math.random()*(t-100))}})();e.style.transform=`translate3d(${o.x}px, ${o.y}px, ${t}px)`,console.log(o)}))})(),document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelectorAll(".p-field-3d img");for(const t of e)t.addEventListener("mouseenter",(e=>{const t=e.target,o=getComputedStyle(t).transform,n=y(o),r=document.querySelectorAll(".p-field-3d img");for(const e of r){const t=getComputedStyle(e).transform,o=y(t);if(null===n||null===o)return;const r=1.1*Math.abs(n-o)/100;e.style.filter=`blur(${r}px)`}}))}))})();