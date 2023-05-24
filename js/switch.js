const link = document.querySelector(".navbar-nav");

link.addEventListener("click", e => {
    sessionStorage.setItem("page", e.target.dataset.page);
});
