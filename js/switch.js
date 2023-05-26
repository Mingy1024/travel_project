const link = document.querySelector(".navbar-nav");
const spot =document.querySelector(".spot");
const food =document.querySelector(".food");
const hotel =document.querySelector(".hotel");
const loading = document.querySelector(".loading");

link.addEventListener("click", e => {
    sessionStorage.setItem("page", e.target.dataset.page);
});

spot.addEventListener("click", e => {
    sessionStorage.setItem("page", e.target.dataset.page);
});
food.addEventListener("click", e => {
    sessionStorage.setItem("page", e.target.dataset.page);
});
hotel.addEventListener("click", e => {
    sessionStorage.setItem("page", e.target.dataset.page);
});

// loading
function loadingFuc() {
    loading.classList.remove("d-none");
    setTimeout(() => loading.classList.add("d-none"),1500);
}
loadingFuc();