let spotAry = [];
let foodAry = [];
let hotelAry = [];
let activityAry = [];
const link = document.querySelector(".navbar-nav");

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

function getOriginData() {
    axios.get("https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?&%24format=JSON",{
        headers: getAuthorizationHeader()
    })
    .then( res => spotAry = res.data);
    axios.get("https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?&%24format=JSON",{
        headers: getAuthorizationHeader()
    })
    .then( res => foodAry = res.data);
    axios.get("https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?&%24format=JSON",{
        headers: getAuthorizationHeader()
    })
    .then( res => hotelAry = res.data);
    axios.get("https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?&%24format=JSON",{
        headers: getAuthorizationHeader()
    })
    .then( res => activityAry = res.data);
}
// getOriginData();

link.addEventListener("click", e => {
    sessionStorage.setItem("page",e.target.dataset.page);
    spotAry = JSON.stringify(spotAry);
    foodAry = JSON.stringify(foodAry);
    hotelAry = JSON.stringify(hotelAry);
    activityAry = JSON.stringify(activityAry);

    // sessionStorage.setItem("spotAry",spotAry);
    // sessionStorage.setItem("foodAry",foodAry);
    // sessionStorage.setItem("hotelAry",hotelAry);
    // sessionStorage.setItem("activityAry",activityAry);
});