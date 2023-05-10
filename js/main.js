const searchResult = document.querySelector(".searchResult");
const categorySelect = document.querySelector(".categorySelect");
const tourCategory = {};
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
    getOriginData();
}
init();

// 呼叫 API 服務取得欲顯示在初始畫面的資料進行過濾、渲染
function getOriginData() {
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24top=20&%24format=JSON`, {
        headers: getAuthorizationHeader()
    })
        .then(res => {
            const tourismData = res.data;
            let str = "";
            let filterData = tourismData.filter( item => item.Picture.PictureUrl1 !== undefined && item.Class1 !== undefined);
            filterData.forEach(item => {
                str +=`<div class="col">
                        <div class="card p-2">
                            <div class="spotImg">
                                <img src="${item.Picture.PictureUrl1}"
                                    alt="${item.Picture.PictureDescription1}" style="height: 200px; object-fit: cover" class="w-100" />
                            </div>
                            <div class="card-body p-20">
                                <h5 class="card-title fw-bold">${item.ScenicSpotName}</h5>
                                <p class="card-text">
                                    <i class="fa-solid fa-location-dot pe-2"></i>${item.Address}
                                </p>
                                <span class="badge rounded-pill bg-primary">${item.Class1}</span>
                            </div>
                        </div>
                    </div>`
            })
            searchResult.innerHTML = str;
        })
}

// 取得分類種類
function renderCategory() {
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?&%24format=JSON`, {
        headers: getAuthorizationHeader()
    })
    .then( res => {
        const data = res.data;
        const filterData = data.filter( item => item.Class1 !== undefined);
        // 使用物件存取分類種類及數量
        filterData.forEach( item => {
            if(tourCategory[item.Class1] == undefined){
                tourCategory[item.Class1] = 1;
            }else {
                tourCategory[item.Class1] += 1;
            }
        })
        // 物件轉陣列
        const tourCategoryAry = Object.keys(tourCategory);

        let str = `<option selected class="d-none" value="">找分類</option>`;
        tourCategoryAry.forEach(item => str += `<option value="${item}">${item}</option>`);
        categorySelect.innerHTML = str;
    })
}
renderCategory();

// header圖片輪播
let carouselData = ["https://images.unsplash.com/photo-1556115908-233c785befbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80", "https://images.unsplash.com/photo-1621848296279-7751546e9acc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1190&q=80", "https://images.unsplash.com/photo-1583395145517-1e3177037600?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"];

let order = 0;

carousel();
function carousel() {
    if (order >= carouselData.length - 1) {
        order = 0;
    } else {
        order += 1;
    }
    document.querySelector(".header").style.backgroundImage = `url(${carouselData[order]})`;
    setTimeout(carousel, 4000)
}
