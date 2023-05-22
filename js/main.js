const searchResult = document.querySelector(".searchResult");
const categorySelect = document.querySelector(".categorySelect");
const link = document.querySelector(".navbar-nav");
const input = document.querySelector(".keyWord");
const send = document.querySelector(".send");
const citySelect = document.querySelector(".citySelect");
const resultInfo = document.querySelector(".resultInfo");
let pageName = "";
let category = "";
let title = "";
let time = "";
const spotAry = JSON.parse(sessionStorage.getItem("spotAry"));
let foodAry = JSON.parse(sessionStorage.getItem("foodAry"));
let hotelAry = JSON.parse(sessionStorage.getItem("hotelAry"));
let activityAry = JSON.parse(sessionStorage.getItem("activityAry"));

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

// 初始化
function init() {
    pageName = sessionStorage.getItem("page");
    switch (pageName) {
        case "spot":
            getOriginData(spotAry);
            renderCategory(spotAry);
            break;
        case "food":
            getOriginData(foodAry);
            renderCategory(foodAry);
            break;
        case "hotel":
            getOriginData(hotelAry);
            renderCategory(hotelAry);
            break;
        case "activity":
            getOriginData(activityAry);
            renderCategory(activityAry);
            break;
    }
}
init();

// 進行資料分類 & 將分類結果顯示在搜尋列 select 選單
function renderCategory(page) {
    const tourCategory = {};
    const filterData = page.filter( item =>{
        category = unifyClass(page,item);
        return category !== undefined;
    });
    filterData.forEach( item => {
        category = unifyClass(page,item);
        if(tourCategory[category] == undefined) {
            tourCategory[category] = 1;
        }else{
            tourCategory[category] += 1;
        }
        const tourCategoryAry = Object.keys(tourCategory);
        let str = `<option selected class="d-none" value="">找分類</option>`;
        tourCategoryAry.forEach( item => str += `<option value="${item}">${item}</option>`);
        categorySelect.innerHTML = str;
    })
}

// 統一資料的 種類 屬性名稱
function unifyClass(page,item) {
    let spot = page.every( item => item.ScenicSpotName);
    let activity = page.every( item => item.ActivityName);
    let food = page.every( item => item.RestaurantName);
    let hotel = page.every(item => item.HotelName);

    if(spot || activity){
        category = item.Class1;
    }else if (food || hotel){
        category = item.Class;
    }
    return category;
}

// 統一資料的 標題 屬性名稱
function unifyName(page,item) {
    let spot = page.every( item => item.ScenicSpotName);
    let activity = page.every( item => item.ActivityName);
    let food = page.every( item => item.RestaurantName);
    let hotel = page.every(item => item.HotelName);

    if (spot) {
        title = item.ScenicSpotName;
    } else if (activity) {
        title = item.ActivityName;
    } else if (food) {
        title = item.RestaurantName;
        time = `<p class="card-text">
                    <i class="fa-solid fa-clock pe-2"></i>營業時間 :
                    <span class="">${item.OpenTime}</span>
                </p>`;
    } else if (hotel) {
        title = item.HotelName;
    }
    return title;
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
function getOriginData(page) {
    let str = "";
    let filterData = page.filter(item => {
        category = unifyClass(page,item);
        return item.Picture.PictureUrl1 !== undefined && category !== undefined;
    })
    filterData.forEach(item => {
        category = unifyClass(page,item);
        title = unifyName(page,item); 
        str += `<div class="col">
                    <div class="card p-2">
                        <div class="spotImg">
                            <img src="${item.Picture.PictureUrl1}"
                                alt="${item.Picture.PictureDescription1}" style="height: 200px; object-fit: cover" class="w-100" />
                        </div>
                        <div class="card-body p-20">
                            <h5 class="card-title fw-bold">${title}</h5>
                            <p class="card-text mb-2">
                                <i class="fa-solid fa-location-dot pe-2"></i>${item.Address}
                            </p>
                           ${time}
                            <span class="badge rounded-pill bg-primary">${category}</span>
                        </div>
                    </div>
                </div>`;
    })
    searchResult.innerHTML = str;
    showResult(filterData);
}

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

    if(citySelect.value == "" && categorySelect.value == "" && input.value == ""){
        resultInfo.innerHTML = `<p>以下為「<span class="result fs-5"> ${result} </span>」的搜尋結果</p><p class="d-flex align-items-center mt-2 mt-sm-0">共有 <span class="resultNum px-1 fs-5">${data.length}</span> 筆搜尋結果</p>`;
    }else{
        resultInfo.innerHTML = `<p>以下為「<span class="result fs-5"> ${citySelect.value} ${categorySelect.value} ${input.value}</span>」的搜尋結果</p><p class="d-flex align-items-center mt-2 mt-sm-0">共有<span class="resultNum px-1 fs-5">${data.length}</span>筆搜尋結果</p>`;
    }
}

// 縣市、分類、關鍵字搜尋
function keywordSearch(page) {
    let cityData = page.filter( item => {
        category = unifyClass(page,item);
        if (item.Address && category) {
            if(citySelect.value){
                if(item.City){
                    return item.City.includes(citySelect.value);
                }else{
                    return item.Address.includes(citySelect.value);
                }
            }else{
                return item;
            }
        }
    });
    let categoryData = cityData.filter( item => {
        category = unifyClass(page,item);
        if(categorySelect.value){
            return category.includes(categorySelect.value);
        }else{
            return item;
        }
    })
    let keyWordData = categoryData.filter( item => {
        title = unifyName(page,item);
        return title.includes(input.value.trim())
    });
    getOriginData(keyWordData)
}

// 搜尋按鈕監聽
send.addEventListener("click",() => {
    pageName = sessionStorage.getItem("page");
    switch (pageName) {
        case "spot":
            keywordSearch(spotAry);
            break;
        case "food":
            keywordSearch(foodAry);
            break;
        case "hotel":
            keywordSearch(hotelAry);
            break;
        case "activity":
            keywordSearch(activityAry);
            break;
    }
});

// getOriginData(spotAry);
// 呼叫 API 服務取得欲顯示在初始畫面的資料進行過濾、渲染
// function getOriginData(router) {
//     axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/${router}?%24top=20&%24format=JSON`, {
//         headers: getAuthorizationHeader()
//     })
//         .then(res => {
//             const tourismData = res.data;
//             let str = "";
//             let category = "";
//             let name = "";
//             let time = "";

//             let filterData = tourismData.filter(item => {
//                 // 判斷是從哪支 api 抓回來的資料並進行過濾
//                 if(router == "ScenicSpot" || router == "Activity"){
//                     category = item.Class1;
//                 }else if(router == "Restaurant" || router == "Hotel"){
//                     category = item.Class;
//                 }
//                 return item.Picture.PictureUrl1 !== undefined && category !== undefined;
//             } );
//             filterData.forEach(item => {
//                 // 過濾完的資料根據不同物件屬性組字串
//                 if(router == "ScenicSpot"){
//                     category = item.Class1;
//                     name = item.ScenicSpotName;

//                 }else if(router == "Activity"){
//                     category = item.Class1;
//                     name = item.ActivityName;
//                 }else if(router == "Restaurant"){
//                     category = item.Class;
//                     name = item.RestaurantName;
//                     time = `<p class="card-text">
//                                 <i class="fa-solid fa-clock pe-2"></i>營業時間 :
//                                 <span class="">${item.OpenTime}</span>
//                             </p>`;
//                 }else if(router == "Hotel"){
//                     category = item.Class;
//                     name = item.HotelName;
//                 }
//                 str += `<div class="col">
//                         <div class="card p-2">
//                             <div class="spotImg">
//                                 <img src="${item.Picture.PictureUrl1}"
//                                     alt="${item.Picture.PictureDescription1}" style="height: 200px; object-fit: cover" class="w-100" />
//                             </div>
//                             <div class="card-body p-20">
//                                 <h5 class="card-title fw-bold">${name}</h5>
//                                 <p class="card-text mb-2">
//                                     <i class="fa-solid fa-location-dot pe-2"></i>${item.Address}
//                                 </p>
//                                ${time}
//                                 <span class="badge rounded-pill bg-primary">${category}</span>
//                             </div>
//                         </div>
//                     </div>`
//             })
//             searchResult.innerHTML = str;
//         })
// }


// 取得分類種類
// function renderCategory() {
//     axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?&%24format=JSON`, {
//         headers: getAuthorizationHeader()
//     })
//         .then(res => {
//             const data = res.data;
//             const filterData = data.filter(item => item.Class1 !== undefined);
//             // 使用物件存取分類種類及數量
//             filterData.forEach(item => {
//                 if (tourCategory[item.Class1] == undefined) {
//                     tourCategory[item.Class1] = 1;
//                 } else {
//                     tourCategory[item.Class1] += 1;
//                 }
//             })
//             // 物件轉陣列
//             const tourCategoryAry = Object.keys(tourCategory);

//             let str = `<option selected class="d-none" value="">找分類</option>`;
//             tourCategoryAry.forEach(item => str += `<option value="${item}">${item}</option>`);
//             categorySelect.innerHTML = str;
//         })
// }
// renderCategory();