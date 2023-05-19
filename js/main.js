const searchResult = document.querySelector(".searchResult");
const categorySelect = document.querySelector(".categorySelect");
const link = document.querySelector(".navbar-nav");
const input = document.querySelector(".keyWord");
const send = document.querySelector(".send");
// let router = "";
// let className = "";
let pageName = "";
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
function renderCategory(data) {
    const tourCategory = {};
    let category = "";
    const filterData = data.filter( item =>{
        if(data == spotAry || data == activityAry){
            category = item.Class1;
        }else if (data == foodAry || data == hotelAry){
            category = item.Class;
        }
        return category !== undefined;
    });
    filterData.forEach( item => {
        if(data == spotAry || data == activityAry){
            category = item.Class1;
        }else if (data == foodAry || data == hotelAry){
            category = item.Class;
        }

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

// 判斷頁面載入對應初始資料
link.addEventListener("click", function (e) {
    sessionStorage.setItem("page", e.target.dataset.page);
    init();
})

// 組資料字串 & 畫面渲染
function getOriginData(page) {
    let str = "";
    let category = "";
    let name = "";
    let time = "";

    let filterData = page.filter(item => {
        if (page == spotAry || page == activityAry) {
            category = item.Class1;
        } else if (page == foodAry || page == hotelAry) {
            category = item.Class;
        }
        return item.Picture.PictureUrl1 !== undefined && category !== undefined;
    })
    filterData.forEach(item => {
        if (page == spotAry) {
            category = item.Class1;
            name = item.ScenicSpotName;
        } else if (page == activityAry) {
            category = item.Class1;
            name = item.ActivityName;
        } else if (page == foodAry) {
            category = item.Class;
            name = item.RestaurantName;
            time = `<p class="card-text">
                        <i class="fa-solid fa-clock pe-2"></i>營業時間 :
                        <span class="">${item.OpenTime}</span>
                    </p>`;
        } else if (page == hotelAry) {
            category = item.Class;
            name = item.HotelName;
        }
        str += `<div class="col">
                    <div class="card p-2">
                        <div class="spotImg">
                            <img src="${item.Picture.PictureUrl1}"
                                alt="${item.Picture.PictureDescription1}" style="height: 200px; object-fit: cover" class="w-100" />
                        </div>
                        <div class="card-body p-20">
                            <h5 class="card-title fw-bold">${name}</h5>
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
}

function keywordSearch() {
    let filterData = spotAry.filter( item => item.ScenicSpotName.match(input.value.trim()));
    console.log(filterData);
}
send.addEventListener("click",keywordSearch);

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