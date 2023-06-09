import createPagination from './module/createPagination.js';
const searchResult = document.querySelector(".searchResult");
const categorySelect = document.querySelector(".categorySelect");
const link = document.querySelector(".navbar-nav");
const input = document.querySelector(".keyWord");
const send = document.querySelector(".send");
const citySelect = document.querySelector(".citySelect");
const resultInfo = document.querySelector(".resultInfo");
const paginationElement = document.querySelector(".pagination");
const loading = document.querySelector(".loading");
let pageName = "";
let category = "";
let title = "";
let time = "";
let dataId = "";
let detail = "";
let detail2 = "";
let totalData = [];
let filterData = [];
let searchData = [];


// API認證
function getAuthorizationHeader() {
    const parameter = {
        grant_type: "client_credentials",
        client_id: "b10711038-4718ef17-bb2b-4453",
        client_secret: "0c320cb7-dd00-4c31-b6ed-56cb88d143ec"
    };
    let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
    axios({
        method: "post",
        url: auth_url,
        dataType: "JSON",
        data: parameter,
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        }
    })
        .then(res => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
        })
        .catch(err => {
            console.log(err);
        })
}

// 串接 api 取得資料
async function getData(page) {
    loadingFuc();
    await axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/${page}?&%24format=JSON`, {
        headers: getAuthorizationHeader()
    })
        .then(res => {
            totalData = res.data;
        });
    await renderCategory(totalData);
    filterData = totalData.filter(item => {
        category = unifyClass(totalData, item);
        return item.Picture.PictureUrl1 !== undefined && category !== undefined;
    })

    searchData = filterData;
    let pagesLength = Math.ceil(searchData.length / 12);
    let pagination = createPagination({
        pagesLength,
        onChange: updateElements,
    })
    pagination.setPage(1);
    
    paginationElement.addEventListener("click", e => {
        const { action, value } = e.target.dataset;
        const newPage = Number(value);
        const currentPage = pagination.getCurrentPage();

        if (!action || currentPage == newPage) { return; }

        pagination[action](newPage);
    })

    // 搜尋按鈕監聽
    send.addEventListener("click", () => {
        searchData =  keywordSearch(filterData);
        pagesLength = Math.ceil(searchData.length / 12);
        pagination = createPagination({
            pagesLength,
            onChange: updateElements,
        })
        pagination.setPage(1);
    });
}

// 初始化
async function init() {
    pageName = sessionStorage.getItem("page");
    switch (pageName) {
        case "spot":
            await getData("ScenicSpot");
            break;
        case "food":
            await getData("Restaurant");
            break;
        case "hotel":
            await getData("Hotel");
            break;
        case "activity":
            await getData("Activity");
            break;
    }
}
init();

// 根據頁數顯示對應資料
function updateElements({ currentPage, pages }) {
    let dataLength = searchData.length;
    const currentIndex = (currentPage - 1) * 12;
    loadingFuc();
    renderData(searchData.slice(currentIndex, currentIndex + 12));
    renderPageNum(pages,dataLength);
}

// 依資料筆數渲染分頁列
function renderPageNum(pages,dataLength) {
    let str = "";
    if(!dataLength){
        str = "";
    }else{
        pages.forEach(item => {
            if (item.value == "Prev") {
                str += `<li class="page-item">
                            <a class="page-link border-0" href="#result" aria-label="Prev" data-action="${item.action}" data-value="${item.value}">
                                &laquo;
                            </a>
                        </li>`;
            } else if (item.value == "Next") {
                str += `<li class="page-item">
                            <a class="page-link border-0" href="#result" aria-label="Next" data-action="${item.action}" data-value="${item.value}">
                                &raquo;
                            </a>
                        </li>`;
            } else {
                str += `<li class="page-item ${item.isActive ? "active" : ""}"><a class="page-link border-0" href="#result" data-action="${item.action}" data-value="${item.value}">${item.value}</a></li>`;
            }
        })
    }
    paginationElement.innerHTML = str;
}

// 進行資料分類 & 將分類結果顯示在搜尋列 select 選單
function renderCategory(page) {
    const tourCategory = {};
    const filterData = page.filter(item => {
        category = unifyClass(page, item);
        return category !== undefined;
    });
    filterData.forEach(item => {
        category = unifyClass(page, item);
        if (tourCategory[category] == undefined) {
            tourCategory[category] = 1;
        } else {
            tourCategory[category] += 1;
        }
        const tourCategoryAry = Object.keys(tourCategory);
        let str = `<option selected class="d-none" value="">找分類</option>`;
        tourCategoryAry.forEach(item => str += `<option value="${item}">${item}</option>`);
        categorySelect.innerHTML = str;
    })
}

// 辨別頁面
function discern(page, item) {
    let spot = page.every(item => item.ScenicSpotName);
    let activity = page.every(item => item.ActivityName);
    let food = page.every(item => item.RestaurantName);
    let hotel = page.every(item => item.HotelName);
    return {
        spot: spot,
        activity: activity,
        food: food,
        hotel: hotel
    }
}

// 統一資料的 種類 屬性名稱
function unifyClass(page, item) {
    let pages = discern(page, item);
    if (pages.spot || pages.activity) {
        category = item.Class1;
    } else if (pages.food || pages.hotel) {
        category = item.Class;
    }
    return category;
}

// 統一資料的 標題 屬性名稱
function unifyName(page, item) {
    let pages = discern(page, item);
    time = "";

    if (pages.spot) {
        title = item.ScenicSpotName;
    } else if (pages.activity) {
        title = item.ActivityName;
    } else if (pages.food) {
        title = item.RestaurantName;
        time = `<p class="card-text">
                    <i class="text-moonstone fa-solid fa-clock pe-2"></i>營業時間 :
                    <span class="">${item.OpenTime}</span>
                </p>`;
        return title;
    } else if (pages.hotel) {
        title = item.HotelName;
    }
    return title;
}

// 統一資料的 ID 屬性名稱
function unifyId(page, item) {
    let pages = discern(page, item);

    if (pages.spot) {
        dataId = item.ScenicSpotID;
    }else if (pages.activity) {
        dataId = item.ActivityID;
    }else if (pages.food) {
        dataId = item.RestaurantID;
    }else if (pages.hotel) {
        dataId = item.HotelID;
    }
    return dataId;
}

// 渲染 modal 內的細節內容
function renderDetail(page, item) {
    let pages = discern(page, item);

    if(pages.spot){
        detail = `<i class="text-payne fa-solid fa-phone pe-2"></i> 連絡電話 : ${item.Phone}`;
        detail2 = `<i class="text-rose fa-solid fa-location-dot pe-2"></i> 地址 : ${item.Address}`;
    }else if (pages.food) {
        detail = `<i class="text-payne fa-solid fa-phone pe-2"></i> 連絡電話 : ${item.Phone}`;
        detail2 = `<i class="text-moonstone fa-solid fa-clock pe-2"></i>營業時間 : ${item.OpenTime}`;
    }else if (pages.hotel) {
        detail = `<i class="text-payne fa-solid fa-phone pe-2"></i> 連絡電話 : ${item.Phone}`;
        if (item.ServiceInfo) {
            detail2 = `<i class="text-payne fa-solid fa-house-signal pe-2"></i>設施、服務 : ${item.ServiceInfo}`;
        }else {
            detail2 = `<i class="text-rose fa-solid fa-location-dot pe-2"></i> 地址 : ${item.Address}`;
        }
    }else if (pages.activity) {
        detail = `<i class="text-payne fa-solid fa-people-group pe-2"></i>主辦單位 : ${item.Organizer}`;
        detail2 = `<i class="text-rose fa-solid fa-location-dot pe-2"></i> 地址 : ${item.Address}`;
    }
}

// 判斷頁面載入對應初始資料
link.addEventListener("click", function (e) {
    sessionStorage.setItem("page", e.target.dataset.page);
    citySelect.value = "";
    categorySelect.value = "";
    input.value = "";
    init();
})

// 組資料字串 & 畫面渲染
function renderData(page) {
    let cardStr = "";
    let modalStr = "";
    if(!page.length){
        cardStr = `<div class="noContent w-100 d-flex flex-column align-items-center">
                  <img src="./images/no-content.png" alt="">
                  <p class="fs-2 mb-0 mt-3">很抱歉，查無此資料!</p>
               </div>`
    }else{
        page.forEach(item => {
            category = unifyClass(page, item);
            title = unifyName(page, item);
            dataId = unifyId(page, item);
            renderDetail(page, item);
            
            // 組卡片字串
            cardStr += `<div class="col">
                        <div class="card p-2 h-100" data-bs-toggle="modal" data-bs-target="#${dataId}">
                            <div class="resultImg">
                                    <img src="${item.Picture.PictureUrl1}"
                                        alt="${item.Picture.PictureDescription1}" style="height: 200px; object-fit: cover" class="w-100" />
                            </div>
                            <div class="card-body p-20">
                                <h5 class="card-title fw-bold">${title}</h5>
                                <p class="card-text mb-2">
                                    <i class="text-rose fa-solid fa-location-dot pe-2"></i>${item.Address}
                                </p>
                               ${time}
                            </div>
                            <div class="card-footer">
                                <span class="badge rounded-pill bg-hookerGreen">${category}</span>
                            </div>
                        </div>
                    </div>`;
            // 組 modal 字串
            modalStr += `<div class="modal" id="${dataId}" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-scrollable modal-xl">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h2 class="modal-title fw-bold text-hookerGreen" id="exampleModalLabel">${title}</h2>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div class="modal-body">
                                <div class="container-fluid">
                                    <img class="modalImg w-100" src="${item.Picture.PictureUrl1}" alt="${item.Picture.PictureDescription1}">
                                    <h3 class="mt-3 mb-0">詳細介紹 :</h3>
                                    <p class="p-3">${item.Description}</p>
                                    <div class="row row-cols-1 row-cols-lg-2">
                                      <div class="col">${detail}</div>
                                      <div class="col mt-2 mt-lg-0">${detail2}</div>
                                    </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>`
        })
    }
    searchResult.innerHTML = cardStr + modalStr;
    showResult(searchData);
}

// 搜尋結果欄位顯示
function showResult(data) {
    let result = "";
    switch (pageName) {
        case "spot":
            result = "所有景點";
            break;
        case "food":
            result = "所有美食";
            break;
        case "hotel":
            result = "所有旅宿";
            break;
        case "activity":
            result = "所有活動";
            break;
    }

    if (citySelect.value == "" && categorySelect.value == "" && input.value == "") {
        resultInfo.innerHTML = `<p>以下為「<span class="result fs-5"> ${result} </span>」的搜尋結果</p><p class="d-flex align-items-center mt-2 mt-sm-0">共有 <span class="resultNum px-1 fs-5">${data.length}</span> 筆搜尋結果</p>`;
    } else {
        resultInfo.innerHTML = `<p>以下為「<span class="result fs-5"> ${citySelect.value} ${categorySelect.value} ${input.value}</span>」的搜尋結果</p><p class="d-flex align-items-center mt-2 mt-sm-0">共有<span class="resultNum px-1 fs-5">${data.length}</span>筆搜尋結果</p>`;
    }
}

// 縣市、分類、關鍵字搜尋
function keywordSearch(page) {
    let cityData = page.filter(item => {
        category = unifyClass(page, item);
        if (item.Address && category) {
            if (citySelect.value) {
                if (item.City) {
                    return item.City.includes(citySelect.value);
                } else {
                    return item.Address.includes(citySelect.value);
                }
            } else {
                return item;
            }
        }
    });
    let categoryData = cityData.filter(item => {
        category = unifyClass(page, item);
        if (categorySelect.value) {
            return category.includes(categorySelect.value);
        } else {
            return item;
        }
    })
    let keyWordData = categoryData.filter(item => {
        title = unifyName(page, item);
        return title.includes(input.value.trim())
    });
    return keyWordData;
}

// loading
function loadingFuc() {
    loading.classList.remove("d-none");
    setTimeout(() => loading.classList.add("d-none"),1500);
}