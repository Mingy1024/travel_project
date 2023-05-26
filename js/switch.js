const link = document.querySelector(".navbar-nav");
const loading = document.querySelector(".loading");

link.addEventListener("click", e => {
    sessionStorage.setItem("page", e.target.dataset.page);
});

// loading
function loadingFuc() {
    loading.classList.remove("d-none");
    setTimeout(() => loading.classList.add("d-none"),1500);
}
loadingFuc();