(()=>{"use strict";document.addEventListener("DOMContentLoaded",(()=>{"OZKY23"===document.title?function(){document.getElementById("btnSwitch").addEventListener("click",(()=>{"dark"==document.body.getAttribute("data-bs-theme")?document.body.setAttribute("data-bs-theme","light"):document.body.setAttribute("data-bs-theme","dark")}));const t=document.querySelector(".nav-indicator"),e=document.querySelectorAll(".nav-item"),o=document.querySelector("main");function n(o){e.forEach((t=>{t.classList.remove("is-active"),t.removeAttribute("style")})),t.style.width=`${o.offsetWidth}px`,t.style.left=`${o.offsetLeft}px`,t.style.backgroundColor=o.getAttribute("active-color"),o.classList.add("is-active"),o.style.color=o.getAttribute("active-color")}let c;u(o),e.forEach(((t,e)=>{t.addEventListener("click",(t=>{n(t.target)})),t.classList.contains("is-active")&&n(t)}));let r=0;const s=document.querySelector("header").offsetHeight,d=document.querySelector("header"),l=document.querySelector(".page");function a(t){if(c)return;let e;"mousemove"===t.type?e=t.clientY:"touchmove"===t.type&&(e=t.touches[0].clientY),e>d.offsetHeight?d.classList.add("scroll-up"):d.classList.remove("scroll-up")}function i(t,e){const o=t.getBoundingClientRect(),n=e.getBoundingClientRect(),c=o.top-50;return o.bottom+50>n.top&&c<n.bottom&&c<window.innerHeight&&o.bottom>0}function u(t){const e=document.querySelectorAll(".section");for(const o of e)if(i(o,t))return o;return null}document.addEventListener("mousemove",a),document.addEventListener("touchmove",a),l.addEventListener("scroll",(function(){c=!0})),setInterval((function(){c&&(function(){const t=l.scrollTop,e=u(o);Math.abs(r-t)<=5||(t>r&&t>s?document.querySelector("header").classList.add("scroll-up"):t<l.scrollHeight&&document.querySelector("header").classList.remove("scroll-up"),r=t,e&&n(document.querySelector(`[href="#${e.id}"]`)))}(),c=!1)}),250);const m=document.documentElement,p=getComputedStyle(m).getPropertyValue("--marquee-elements-displayed"),h=document.querySelector("ul.marquee-content");m.style.setProperty("--marquee-elements",h.children.length);for(let t=0;t<p;t++)h.appendChild(h.children[t].cloneNode(!0))}():"OZKY23 - Portfolio"===document.title&&fetch("./projects/index.json").then((t=>t.json())).then((t=>{const e=document.querySelector("#projects");t.forEach((t=>{const o=document.createElement("div");o.classList.add("post","card","p-4","mb-3","text-center","shadow","bg-body-tertiary","border-0");const n=t.metaData.topics.split(", "),c=t.metaData.tecnologies.split(", "),r=n.map((t=>`<span class="badge text-bg-dark">${t}</span>`)),s=c.map((t=>`<span class="badge rounded-pill text-bg-secondary">${t}</span>`));o.innerHTML=`\n\n\t\t\t\t\t<div class="py-3">${r.join(" ")} ${s.join(" ")}</div>\n\t\t\t\t\t<h2><a href="${t.url}" class="stretched-link display-3 text-decoration-none">${t.metaData.title}</a></h2>\n\t\t\t\t\t<p>${t.metaData.description}</p>\n\t\t\t\t`,e.appendChild(o)}))})).catch((t=>console.error(t)))}))})();