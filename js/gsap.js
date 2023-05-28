// 註冊ScrollTrigger 、 TextPlugin 套件
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// 打字提示閃爍效果
gsap.fromTo(
    ".cursor",
    0,
    {
        visibility: "hidden",
    },
    {
        visibility: "visible",
        repeat: -1,
        yoyo: true,
        repeatDelay: 0.3,
    }
)

// 選取多個元素、觸發動畫
gsap.utils.toArray(".animation-wrapper").forEach((element) =>{
    if(element.classList.contains("from-left") || element.classList.contains("from-right")){
        hide(element);

        ScrollTrigger.create({
            trigger: element,
            start: 'top 50%',
            onEnter: function(){
                animated(element);
            },
            onEnterBack: function(){
                animated(element);
            },
            onLeave: function(){
                hide(element);
            },
        });
    }else if(element.classList.contains("typing")){
        const typing1Content = "放假不知道該去哪裡玩嗎";
        const typing2Content = "想知道各縣市有什麼美食";
        const typing3Content = "人氣住宿選擇有哪些";
        
        gsap.to(".typing1",{
            text: typing1Content,
            duration: 1.5,
            scrollTrigger: {
                trigger: ".typing1",
                toggleActions: "play pause resume reset",
            },
        });

        gsap.to(".typing2",{
            text: typing2Content,
            duration: 1.5,
            scrollTrigger: {
                trigger: ".typing2",
                toggleActions: "play pause resume reset",
            },
        });

        gsap.to(".typing3",{
            text: typing3Content,
            duration: 1.5,
            scrollTrigger: {
                trigger: ".typing3",
                toggleActions: "play pause resume reset",
            },
        });
    }
})

// 隱藏
function hide(element){
    gsap.set(element,{ opacity:0, visibility:"hidden" });
}

// 淡入動畫
function animated(element){
    let x = 0;
    if(element.classList.contains("from-left")){
        x = -100;
    }else if(element.classList.contains("from-right")){
        x = 100;
    }
    element.style.transform = `translate(${x}px, 0px)`;

    gsap.fromTo(
        element,
        { x: x, y: 0, opacity: 0, visibility: "hidden"},
        {
            duration: 1,
            delay: 0.2,
            x: 0,
            y: 0,
            visibility: "visible",
            opacity: 1,
            ease: "expo",
            overwrite: "auto",
        }
    );
}

// 滾動控制頁
const srollTL  = gsap.timeline({
    scrollTrigger:{
        trigger: ".scroll",
        pin: true,
        scrub: true,
    },
});

srollTL.to(".gate-top-1",{ xPercent: "-100" });
srollTL.to(".gate-bottom-1",{ xPercent: "100" }, "<");
srollTL.to(".gate-top-2",{ xPercent: "-100" });
srollTL.to(".gate-bottom-2",{ xPercent: "100" }, "<");
srollTL.to(".gate-top-3",{ xPercent: "-100" });
srollTL.to(".gate-bottom-3",{ xPercent: "100" }, "<");