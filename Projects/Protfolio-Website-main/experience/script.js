$(document).ready(function () {
  // mobile menu
  $("#menu").click(function () {
    $(this).toggleClass("fa-times");
    $(".navbar").toggleClass("nav-toggle");
  });

  $(window).on("scroll load", function () {
    $("#menu").removeClass("fa-times");
    $(".navbar").removeClass("nav-toggle");

    if (window.scrollY > 60) {
      document.querySelector("#scroll-top").classList.add("active");
    } else {
      document.querySelector("#scroll-top").classList.remove("active");
    }
  });
});

/* ===== SCROLL REVEAL CONFIG ===== */
const srtop = ScrollReveal({
  origin: "top",
  distance: "80px",
  duration: 1000,
  reset: true,
});

/* ===== EXPERIENCE DATA LOAD ===== */
function getExperience() {
  return fetch("./experience.json").then((res) => res.json());
}

function renderExperience(items) {
  const timeline = document.querySelector(".experience .timeline");
  let html = "";

  items.forEach((exp, index) => {
    const side = index % 2 === 0 ? "left" : "right";

    html += `
      <div class="container ${side}">
        <div class="content">
          <div class="tag">
            <h2>${exp.title}</h2>
          </div>
          <div class="desc">
            <h3>${exp.role}</h3>
            <p>${exp.period}</p>
            <p>${exp.description}</p>
          </div>
        </div>
      </div>
    `;
  });

  timeline.innerHTML = html;

  // Scroll reveal after content injected
  srtop.reveal(".experience .timeline", { delay: 400 });
  srtop.reveal(".experience .timeline .container", { interval: 200 });
}

getExperience().then(renderExperience);

/* ===== Tawk.to Live Chat ===== */
var Tawk_API = Tawk_API || {},
  Tawk_LoadStart = new Date();
(function () {
  var s1 = document.createElement("script"),
    s0 = document.getElementsByTagName("script")[0];
  s1.async = true;
  s1.src = "https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6";
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");
  s0.parentNode.insertBefore(s1, s0);
})();

// disable developer mode
document.onkeydown = function (e) {
  if (e.keyCode == 123) return false;
  if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) return false;
  if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0)) return false;
  if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) return false;
  if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) return false;
};

/* dynamic title + favicon */
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    document.title = "Experience | Portfolio Vivek Jangam";
    $("#favicon").attr("href", "/assets/images/favicon.png");
  } else {
    document.title = "Come Back To Portfolio";
    $("#favicon").attr("href", "/assets/images/favhand.png");
  }
});
