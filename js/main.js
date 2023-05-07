let carouselData = ["https://images.unsplash.com/photo-1556115908-233c785befbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80","https://images.unsplash.com/photo-1621848296279-7751546e9acc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1190&q=80","https://images.unsplash.com/photo-1583395145517-1e3177037600?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"];

// header圖片輪播
let order = 0;

carousel();
function carousel(){
    if(order >= carouselData.length - 1){
        order = 0;
    }else{
        order += 1;
    }
    document.querySelector(".header").style.backgroundImage  = `url(${carouselData[order]})`;
    setTimeout(carousel,4000)
}
