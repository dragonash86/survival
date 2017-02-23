//Init
$(window).ready(function() {
	_init();
});

//다운로드 버튼 기기별로 필요없는 건 숨기기
if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune|Android/)){
    $(".downloadNone").hide();
}

//Core
function _init() {
    _topNav();
    _animate();
    _owl_carousel();
    _lightbox();
    _scrollTo();
    _placeholder();
    _menuHeight();
    $("a[data-toggle=tooltip]").tooltip();
}

var _topMain = $('#topMain');
var _siteMap = $('.site_map');
var _siteMapContent = $('.site_map_content');
var _siteMapClose = $('.site_map_close');
var _btnMobile = $('.btn_mobile');
var _tGnb = $('.top_gnb');
var _pageTop = $('#page_top');

function _menuHeight() {
    var height = $(window).height() - 50;
    if ($(window).width() < 769) {
        _topMain.css({'height':height}); // 모바일 스크롤 높이 잡기
    } else {
        _topMain.removeAttr('style');
    }
}
$('.urlLink').on('change', function () {
    var url = $(this).val(); // get selected value
    if (url) { // require a URL
        window.open(url,'_blank');
    }
    return false;
});
$('#urlLink2').on('change', function () {
    var url = $(this).val(); // get selected value
    if (url) { // require a URL
        window.location = url; // redirect
    }
    return false;
});

if ($('#urlLink3').length > 0) {
    $('#urlLink3').on('change', function (e) {
        e.preventDefault();
        var url = $("#urlLink3 option:selected").val();
        $(".partner_wrap").hide();
        $("#"+url).show();
    });
}   

$('#urlLink4').on('change', function () {
    var url = $(this).val(); // get selected value
    if (url) { // require a URL
        window.location = url; // redirect
    }
    return false;
});

//사이트맵 클릭 시
_siteMap.bind("click", function() {
    _siteMapContent.addClass('open');
    $(".tab_nav.m_fix").css('z-index',150);
    $(".fix_prd,.btn_top").parent().fadeOut();
    $("html,body").css('overflow','hidden');
    enable_overlay();
});
_siteMapClose.bind("click", function() {
    _siteMapContent.removeClass('open');
    $(".tab_nav.m_fix").css('z-index',300);
    $("html,body").css('overflow','auto');
    if($(document).scrollTop() > 550) {
        $(".fix_prd,.btn_top").parent().show();
    }
    disable_overlay();
});

//메뉴 hover 시 z-index 설정
$(".nav_main").hover(function(){
    $(".tab_nav.m_fix").css('z-index',150);
}, function() {
    $(".tab_nav.m_fix").css('z-index',300);
});


// 'esc' key
$(document).keydown(function(e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if(code == 27) {
        disable_overlay();
        enable_scroll();
        _siteMapContent.removeClass('open');
        _btnMobile.removeClass('open');
        _tGnb.removeClass('in');
        $("html,body").css('overflow','auto');
    }
});

//모바일 GNB 열기
$(".btn_mobile").bind("click", function() {
    var _scrollTop = $(document).scrollTop();
    $(this).addClass('open');
    _pageTop.addClass('scroll_off').css({'top':-_scrollTop});
    $(".tab_nav").css('z-index',150);
    //현재 width 잡아주기 (position:fixed 때문에 컨텐츠 안보이는 현상)
    $(".bg_sub_1").attr('style', "width:"+window.innerWidth+"px");
    setTimeout(function(){
        disable_scroll();
        enable_overlay();
    }, 100);
});

//모바일 GNB 닫기
$('.m_top_close').bind("click", function() {
    var offset = $('#page_top').offset();
    var top = Math.abs(offset.top);
    $(".tab_nav").css('z-index',300);
    //열릴 때 잡힌 width 제거
    $(".bg_sub_1").removeAttr("style");
    disable_overlay();
    enable_scroll();
    _btnMobile.removeClass('open');
    _tGnb.removeClass('in');
    _pageTop.removeClass('scroll_off').css({'top':'0'});
    $('html, body').scrollTop(top);
});


//탭 활성화
if ($('#tabajax').length > 0) {
    var _subMenu = $('.sub_menu li');
    $('#tabajax .tab li').bind("click", function(e) {
        e.preventDefault();
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        $("."+$(this).closest('ul').attr("id")).hide();
        $("#"+$(this).find('a').attr("rel")).show();
        if($(this).hasClass('sub')) {
            _subMenu.removeClass('active');
            _subMenu.first().addClass('active');
        }
    });
}
if ($('.tab_license').length > 0) {
    $(".tab_license li").click(function (e) {
        e.preventDefault();
        var element = $(".buy_list_license li");
        var index = $(this).index();
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        element.hide();
        if (index === 0) {
            element.show();
        } else {
            $(".buy_list_license li:nth-child(" + index + ")").show();
        }
    });
}

// accordion
$(".accordion>li").click(function(e){
    e.preventDefault();
    if($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).find("div").slideUp(100, "easeOutExpo");
    } else {
        $(".accordion>li").removeClass('active');
        $(this).addClass('active');
        $(".accordion>li>div").parent().not(this).find("div").slideUp(100, "easeOutExpo");
        $(this).find("div").slideToggle(300, "easeOutExpo");
    }
});

// accordion - view(탭 안의 내용 선택시 탭 토글 기능이 동작되지 않도록)
$(".accordion_view li>a").click(function(e){
    e.preventDefault();
    if($(this).parent().hasClass('active')) {
        $(this).parent().removeClass('active');
        $(this).parent().find("div").slideUp(100, "easeOutExpo");
    } else {
        $(".accordion_view>li").removeClass('active');
        $(this).parent().addClass('active');
        $(".accordion_view>li>div").parent().parent().not(this).find("div").slideUp(100, "easeOutExpo");
        $(this).parent().find("div").slideToggle(300, "easeOutExpo");
        //뉴스레터 펼침시 스크롤 위치 제어
        if($(".accordion_view").parent().hasClass("center_list_letter")) {
            if($(window).width() > 768) {
                if($(window).scrollTop() > 1000) {
                    $('html, body').animate({scrollTop: $(this).offset().top - 1749}, 100);
                    //console.log("1-1 : "+$(window).scrollTop(),$(this).offset().top);
                } else {
                    $('html, body').animate({scrollTop: $(this).offset().top - 49}, 100);
                    //console.log("1-2 : "+$(window).scrollTop(),$(this).offset().top);
                }
            }
        }
        //동향보고서 펼침시 스크롤 위치 제어
        if($(".accordion_view").parent().hasClass("center_list_report")) {
            if($(window).width() > 768) {
                // console.log("현재위치 : "+$(window).scrollTop(),"오브젝트 위치 : "+$(this).offset().top);
                if($(window).scrollTop() > 750) {
                    $('html, body').animate({scrollTop: $(this).offset().top - 1088}, 500);
                } else {
                    $('html, body').animate({scrollTop: $(this).offset().top - 49}, 500);
                }
            }
        }
    }
});

//알약 전용백신 다운로드
$("#down_alyac li .col-md-12").click(function(e){
    e.preventDefault();
    if($(this).parent().hasClass("active")) {
        $(this).parent().removeClass("active");
        $(this).parent().find(".view").slideUp(100, "easeOutExpo");
    } else {
        $("#down_alyac li").removeClass("active");
        $(this).parent().addClass("active");
        $("#down_alyac .view").parent().not(this).find(".view").slideUp(100, "easeOutExpo");
        $(this).parent().find(".view").slideToggle(300, "easeOutExpo");
        if($(window).width() > 768) {
            if($(window).scrollTop() > 1000) {
                //$('html, body').animate({scrollTop: $(window).scrollTop() - $(this).offset().top }, 100);
                if($(window).scrollTop() > 2000) {
                    $('html, body').animate({scrollTop: $(this).offset().top - 1850}, 100);
                    //console.log("1-1 : "+$(window).scrollTop(),$(this).offset().top);
                } else {
                    $('html, body').animate({scrollTop: $(this).offset().top - 853}, 100);
                    //$('html, body').animate({scrollTop: $(this).offset().top - $(window).scrollTop() + 853}, 100);
                    //console.log("1-2 : "+$(window).scrollTop(),$(this).offset().top);
                }
            } else {
                $('html, body').animate({scrollTop: $(this).offset().top - 49}, 100);
                //console.log("2 : "+$(window).scrollTop(),$(this).offset().top);
            }
        }
    }
});
//메인 팝업
$(".main_popup .btn").click(function(e){
    e.preventDefault();
    $(this).parent().hide();
    if(!$(".main_popup").is(":visible")) {
        $(".main_popup").parent().find(".top_overlay").css("z-index",0);
        disable_overlay();
    }
});
/** 01. Top Nav
 **************************************************************** **/
function _topNav() {
    var addActiveClass = false;

    $("#topMain li.dropdown > a, #topMain li.dropdown_submenu > a").bind("click", function(e) {
        if($(this).attr('href') == '#') {
            e.preventDefault();
        }
        e.stopPropagation();

        if($(window).width() > 979) {
            return;
        }

        addActiveClass = $(this).parent().hasClass("resp_active");
        $("#topMain").find(".resp_active").removeClass("resp_active");

        if(!addActiveClass) {
            $(this).parents("li").addClass("resp_active");
        }
        return;
    });

    // Drop Downs - do not hide on click
    $("#topHead .dropdown_menu, #topNav .mega_menu .dropdown_menu").bind("click", function(e) {
        e.stopPropagation();
    });

    // #topHead Fixes
    window._headHeight = 130;
    var _topHead = $('#topHead');

    function _topGnb(){
        if($(window).width() > 769) {
            _topHead.css({'top':'auto'});
        } else {
            $('.btn_mobile').removeClass('open');
            $('.top_gnb').removeClass('in');
            setTimeout(function(){
                disable_overlay();
                enable_scroll();
            }, 100);
        }
    }

    function _topNavCalibrate() {
		if($("#topHead").length > 0) {
			_headHeight = $("#topHead").outerHeight();
			$("#wrapper").css({"padding-top":_headHeight + "px"});
			$("#topHead").addClass("fixed");
		}
	}

    // GNB top fixed
    function gnbTopFixed() {
        if(window.innerWidth >= 769) {
            if($(window).scrollTop() > 81) {
                _topHead.css('top',-81);
            } else {
                _topHead.css('top',0);
            }
        } else {
            _topHead.css('top',0);
        }
    }

    //제품 탭 클릭 시 이동
    if($(".page_scroll").length > 0){
        $(".page_scroll").click(function(e) {
        	e.preventDefault();
            var link = $(this).attr("href");
            if(window.innerWidth > 769) {
                if($(".tab_nav").hasClass("m_fix")) {
                    $("html,body").stop().animate({scrollTop:$(link).offset().top - 80}, 500);
                    //console.log("1-1");
                } else {
                    if($(this).index($(".tab_nav a")) === 0) {
                        $("html,body").stop().animate({scrollTop:$(link).offset().top - 142}, 500);
                        //console.log("1-2");
                    } else {
                        $("html,body").stop().animate({scrollTop:$(link).offset().top - 80}, 500);
                        //console.log("1-3");
                    }
                }
            } else {
                if($(".tab_nav").hasClass("m_fix")) {
                    if($(this).index($(".tab_nav a")) === 0) {
                        $("html,body").stop().animate({scrollTop:$(link).offset().top - 33}, 500);
                        //console.log("2-1-1");
                    } else {
                        $("html,body").stop().animate({scrollTop:$(link).offset().top - 80}, 500);
                        //console.log("2-1-2");
                    }
                } else {
                    if($(this).index($(".tab_nav a")) === 0) {
                        $("html,body").stop().animate({scrollTop:$(link).offset().top - 95}, 500);
                        //console.log("2-2");
                    } else {
                        $("html,body").stop().animate({scrollTop:$(link).offset().top - 80}, 500);
                        //console.log("2-3");
                    }
                }
            }
        });
    }

    //개인정보 처리방침 책갈피 기능
    $(".inf_scroll").click(function() {
        var link = $(this).attr("href");
        if($(window).width() > 769) {
            if($(".personal_top ul").hasClass("tit_ul")) {
                $("body").stop().animate({scrollTop:$(link).offset().top - 55}, 500);
            }
        } else {
            if($(".personal_top ul").hasClass("tit_ul")) {
                $("body").stop().animate({scrollTop:$(link).offset().top - 65}, 500);
            }
        }
    });

    $(".ransome_wrap .ransome_scroll").click(function() {
        var link = $(this).attr("href");
      	if($(".btn_wrap a").hasClass("ransome_scroll")) {
              $("body").stop().animate({scrollTop:$(link).offset().top - 47}, 500);
        }
    });

    //모바일에서 대메뉴 클릭시 액션 없게. width를 769로 해야하는 이유는 아이패드가 768
    function mLink() {
        $(".dropdown_toggle,.dropdown_submenu>a").not(".none_depth a").click(function(e) {
            if($(window).width() < 769) {
                e.preventDefault();
            }
        });
    }

    //스크롤 시
    $(window).scroll(function() {
        gnbTopFixed(); //제품탭 스크롤 시 GNB top fixed
        //제품 페이지 탭 fixed 및 여백 조절
        var _scrollTop = $(document).scrollTop();
        var _width = window.innerWidth;
        var _visible = $('.tab_nav').is(":visible");
        //PC
        if(_width > 768 &&  _scrollTop > 540 && _visible) {
            $('.tab_nav').addClass('m_fix');
            $('#overview').addClass('fixed_padding');
        } else if(_width > 768 && _scrollTop < 541 && _visible) {
            $('.tab_nav').removeClass('m_fix');
            $('#overview').removeClass('fixed_padding');
        }
        //MOBILE
        if(_width < 769 && _scrollTop > 220 && _visible) {
            $('.tab_nav').addClass('m_fix');
            $('#overview').addClass('fixed_padding');
        } else if(_width < 769 && _scrollTop < 220 && _visible) {
            $('.tab_nav').removeClass('m_fix');
            $('#overview').removeClass('fixed_padding');
        }
        //fixed 배너
        if(_scrollTop > 550 && _width > 1023) {
            $(".fix_prd").show();
            $(".fix_prd").parent().show();
        } else {
            $(".fix_prd").hide();
            $(".fix_prd").parent().hide();
        }
        //TOP 버튼, fixed 배너
        if(_scrollTop > 550) {
            $(".btn_top").parent().show();
        } else {
            $(".btn_top").parent().hide();
        }
    });

    //리사이징 시(안드로이드 주소창 버그로 모바일 분기)
    var filter = "win16|win32|win64|mac|macintel";
    if(navigator.platform) {
        if(filter.indexOf(navigator.platform.toLowerCase()) < 0) {
            _menuHeight();
            _topNavCalibrate();
        } else {
            $(window).resize(function() {
                if($(window).width() < 1280) {
                    _topNavCalibrate();
                    //사이트맵 열려있는 상태에서 리사이징 시 width 1280 미만이면 닫기
                    $('.site_map_content').removeClass('open');
                    disable_overlay();
                }
                if($(window).width() < 1023) {
                    $(".fix_prd").css("display","none");
                }
                //모바일
                if($(window).width() < 769) {
                    _topGnb();
                    mLink();
                }
                _topNavCalibrate();
                _menuHeight();
                gnbTopFixed();
                mLink();
                //모바일 크기에서 GNB를 열고 창을 최대화했을 때 레이아웃 깨짐 방지
                var offset = $('#page_top').offset();
                var top = Math.abs(offset.top);
                $(".tab_nav").css('z-index',300);
                $('.btn_mobile').removeClass('open');
                $('.top_gnb').removeClass('in');
                $('#page_top').removeClass('scroll_off');
                $('#page_top').css({'top':'0'});
                disable_overlay();
                enable_scroll();
                //사이트맵 최대화 시 깨짐 방지
                $('.site_map_content').removeClass('open');
                $("html,body").css('overflow','auto');
            });
        }
    }
    //모바일에서 대메뉴 클릭시 하위메뉴 드롭다운을 위해 href 액션 취소
    if($(window).width() < 769) {
        mLink();
    }
    //온로드 시 테블릿 사이즈 상단 여백 맞춤
    _topNavCalibrate();
}


/** 02. Animate
 **************************************************************** **/
function _animate() {

    // Animation [appear]
    $("[data-animation]").each(function() {
        var _t = $(this);

        if($(window).width() > 767) {

            _t.appear(function() {

                var delay = (_t.attr("data-animation-delay") ? _t.attr("data-animation-delay") : 1);

                if(delay > 1) _t.css("animation-delay", delay + "ms");
                _t.addClass(_t.attr("data-animation"));

                setTimeout(function() {
                    _t.addClass("animation_visible");
                }, delay);

            }, {accX: 0, accY: -150});

        } else {

            _t.addClass("animation_visible");

        }

    });

    // Bootstrap Progress Bar
    $("[data-appear-progress-animation]").each(function() {
        var $_t = $(this);

        if($(window).width() > 767) {

            $_t.appear(function() {
                _delay = 1;

                if($_t.attr("data-appear-progress-animation-delay")) {
                    _delay = $_t.attr("data-appear-progress-animation-delay");
                }

                if(_delay > 1) {
                    $_t.css("animation-delay", _delay + "ms");
                }

                $_t.addClass($_t.attr("data-appear-progress-animation"));

                setTimeout(function() {

                    $_t.addClass("animation_visible");

                }, _delay);

            }, {accX: 0, accY: -150});

        } else {

            $_t.addClass("animation_visible");

        }

    });


    $("[data-appear-progress-animation]").each(function() {
        var $_t = $(this);

        $_t.appear(function() {

            var _delay = ($_t.attr("data-appear-animation-delay") ? $_t.attr("data-appear-animation-delay"): 1);

            if(_delay > 1) {
                $_t.css("animation-delay", _delay + "ms");
            }

            $_t.addClass($_t.attr("data-appear-animation"));
            setTimeout(function() {

                $_t.animate({"width": $_t.attr("data-appear-progress-animation")}, 1000, "easeOutQuad", function() {
                    $_t.find(".progress_bar_tooltip").animate({"opacity": 1}, 500, "easeOutQuad");
                });

            }, _delay);

        }, {accX: 0, accY: -50});

    });

    /* Animation */
    $('.animate_from_top').each(function () {
        $(this).appear(function() {
            $(this).delay(150).animate({opacity:1,top:"0px"},1000);
        });
    });

    $('.animate_from_bottom').each(function () {
        $(this).appear(function() {
            $(this).delay(150).animate({opacity:1,bottom:"0px"},1000);
        });
    });


    $('.animate_from_left').each(function () {
        $(this).appear(function() {
            $(this).delay(150).animate({opacity:1,left:"0px"},1000);
        });
    });


    $('.animate_from_right').each(function () {
        $(this).appear(function() {
            $(this).delay(150).animate({opacity:1,right:"0px"},1000);
        });
    });

    $('.animate_fade_in').each(function () {
        $(this).appear(function() {
            $(this).delay(350).animate({opacity:1,right:"0px"},1000);
        });
    });
}


/** 04. OWL Carousel
 **************************************************************** **/

function _owl_carousel() {

    var total = $(".owl-carousel").length,
        count = 0;

    $(".owl-carousel").each(function() {

        var slider      = $(this);
        var options     = slider.attr('data-plugin-options');

        var defaults = {
            items:                  4,
            itemsCustom:            false,
            itemsDesktop:           [1170,4],
            itemsDesktopSmall:      [980,3],
            itemsTablet:            [768,2],
            itemsTabletSmall:       false,
            itemsMobile:            [479,1],
            singleItem:             true,
            itemsScaleUp:           false,

            slideSpeed:             200,
            paginationSpeed:        800,
            rewindSpeed:            1000,

            autoPlay:               false,
            stopOnHover:            true,

            navigation:             true,
            navigationText: [
                '<i class="fa fa_chevron_left"></i>',
                '<i class="fa fa_chevron_right"></i>'
            ],
            rewindNav:              false,
            scrollPerPage:          false,

            pagination:             false,
            paginationNumbers:      false,

            responsive:             true,
            responsiveBaseWidth:    window,

            baseClass:              "owl-carousel",
            theme:                  "owl-theme",

            lazyLoad:               false,
            lazyFollow:             true,
            lazyEffect:             "fade",

            autoHeight:             false,

            jsonPath:               false,
            jsonSuccess:            false,

            dragBeforeAnimFinish:   true,
            mouseDrag:              true,
            touchDrag:              true,

            transitionStyle:        false,

            addClassActive:         false,

            beforeUpdate:           false,
            afterUpdate:            false,
            beforeInit:             false,
            afterInit:              false,
            beforeMove:             false,
            afterMove:              false,
            startDragging:          false,
            afterLazyLoad:          false,
            afterAction:            false
        };

        var config = $.extend({}, defaults, options, slider.data("plugin-options"));
        slider.owlCarousel(config).addClass("owl-carousel-init");
    });

    //슬라이드 사용 시 메인배너면 동영상 재생(자동으로 재생 안되서 필요)
    if($(window).width() > 768) {
        if($(".main_bn").length > 0) {
            if($(".main_touchSlider video").length > 0) {
                $(".main_touchSlider video").get(0).play();
            }
        }
    }
    //메인 슬라이드 좌우 버튼 컨텐츠 오버시에만 노출
    $(".main_touchSlider .owl-buttons").hide();
    $(".main_bn").hover(function(){
        $(".main_touchSlider .owl-buttons").fadeIn();
    }, function() {
        $(".main_touchSlider .owl-buttons").fadeOut();
    });
    //메인 슬라이드 start, stop 컨트롤
    var mainSlider = $(".main_touchSlider");
    $(".main_bn .control").click(function(){
        if(!$(this).hasClass("start")) {
            $(this).addClass("start");
            mainSlider.trigger('owl.stop');
        } else {
            $(this).attr("class","control");
            mainSlider.trigger('owl.play',[5000]);
        }
    });
}

/** 06. LightBox
 **************************************************************** **/
function _lightbox() {

    if(typeof($.magnificPopup) == "undefined") {
        return false;
    }

    $.extend(true, $.magnificPopup.defaults, {
        tClose:         'Close',
        tLoading:       'Loading...',

        gallery: {
            tPrev:      'Previous',
            tNext:      'Next',
            tCounter:   '%curr% / %total%'
        },

        image:  {
            tError:     'Image not loaded!'
        },

        ajax:   {
            tError:     'Content not loaded!'
        }
    });

    $(".lightbox").each(function() {

        var _t          = $(this),
            options     = _t.attr('data-plugin-options'),
            config      = {},
            defaults    = {
                type:               'image',
                fixedContentPos:    false,
                fixedBgPos:         false,
                mainClass:          'mfp-no-margins mfp-with-zoom',
                image: {
                    verticalFit:    true
                },

                zoom: {
                    enabled:        false,
                    duration:       300
                },

                gallery: {
                    enabled: false,
                    navigateByImgClick: true,
                    preload:            [0,1],
                    arrowMarkup:        '<button title="%title%" type="button" class="mfp_arrow mfp_arrow_%dir%"></button>',
                    tPrev:              'Previou',
                    tNext:              'Next',
                    tCounter:           '<span class="mfp_counter">%curr% / %total%</span>'
                },
            };

        if(_t.data("plugin-options")) {
            config = $.extend({}, defaults, options, _t.data("plugin-options"));
        }

        $(this).magnificPopup(config);

    });
}


/** 07. ScrollTo
 **************************************************************** **/
function _scrollTo() {

    $("a.scrollTo").bind("click", function(e) {
        e.preventDefault();

        var href = $(this).attr('href');

        if(href != '#') {
            $('html,body').animate({scrollTop: $(href).offset().top -80 }, 300, 'easeInOutExpo');
        }
    });

    $("a.btn_top").bind("click", function(e) {
        e.preventDefault();
        $('html,body').animate({scrollTop: 0}, 700, 'easeInOutExpo');
    });
}

/** 10. Toggle
 **************************************************************** **/
function _toggle() {

    var $_t = this,
        previewParClosedHeight = 25;

    $("div.toggle.active > p").addClass("preview_active");
    $("div.toggle.active > div.toggle_content").slideDown(400);
    $("div.toggle > label").click(function(e) {

        var parentSection   = $(this).parent(),
            parentWrapper   = $(this).parents("div.toogle"),
            previewPar      = false,
            isAccordion     = parentWrapper.hasClass("toogle_accordion");

        if(isAccordion && typeof(e.originalEvent) != "undefined") {
            parentWrapper.find("div.toggle.active > label").trigger("click");
        }

        parentSection.toggleClass("active");

        if(parentSection.find("> p").get(0)) {

            previewPar                  = parentSection.find("> p");
            var previewParCurrentHeight = previewPar.css("height");
            var previewParAnimateHeight = previewPar.css("height");
            previewPar.css("height", "auto");
            previewPar.css("height", previewParCurrentHeight);

        }

        var toggleContent = parentSection.find("> div.toggle_content");

        if(parentSection.hasClass("active")) {

            $(previewPar).animate({height: previewParAnimateHeight}, 350, function() {$(this).addClass("preview_active");});
            toggleContent.slideDown(350);

        } else {

            $(previewPar).animate({height: previewParClosedHeight}, 350, function() {$(this).removeClass("preview_active");});
            toggleContent.slideUp(350);

        }

    });
}

/** 14. Placeholder
 **************************************************************** **/
function _placeholder() {

    //check for IE
    if(navigator.appVersion.indexOf("MSIE")!=-1) {

        $('[placeholder]').focus(function() {

            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }

        }).blur(function() {

            var input = $(this);
            if (input.val() === '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }

        }).blur();

    }

}

/** **************************************************************************************************************** **/

// scroll
function wheel(e) {
    e.preventDefault();
}

function disable_scroll() {
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = wheel;
}

function enable_scroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;
}

// overlay
function enable_overlay() {
    $("span.top_overlay").css({'display':'block'});
}
function disable_overlay() {
    $("span.top_overlay").css({'display':'none'});
}


/** @Facebook
 *************************************************** **/
/*
 https://developers.facebook.com/docs/plugins/like-button/

 ADD TO YOUR CODE (just change data-href, that's all):

 <div class="fb-like" data-href="https://developers.facebook.com/docs/plugins/" data-layout="button_count" data-action="like" data-show-faces="false" data-share="false"></div>
 */
if($("div.fb_like").length > 0) {

    $('body').append('<div id="fb_root"></div>');

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

}


/** AFTER RESIZE
 http://www.mcshaman.com/afterresize-js-$-plugin/
 **************************************************************** **/

( function( $ ) {
    "use strict";

    // Define default settings
    var defaults = {
        action: function() {},
        runOnLoad: false,
        duration: 500
    };

    // Define global variables
    var settings = defaults,
        running = false,
        start;

    var methods = {};

    // Initial plugin configuration
    methods.init = function() {

        // Allocate passed arguments to settings based on type
        for( var i = 0; i <= arguments.length; i++ ) {
            var arg = arguments[i];
            switch ( typeof arg ) {
                case "function":
                    settings.action = arg;
                    break;
                case "boolean":
                    settings.runOnLoad = arg;
                    break;
                case "number":
                    settings.duration = arg;
                    break;
            }
        }

        // Process each matching $ object
        return this.each(function() {

            if( settings.runOnLoad ) { settings.action(); }

            $(this).resize( function() {

                methods.timedAction.call( this );

            } );

        } );
    };

    methods.timedAction = function( code, millisec ) {

        var doAction = function() {
            var remaining = settings.duration;

            if( running ) {
                var elapse = new Date() - start;
                remaining = settings.duration - elapse;
                if( remaining <= 0 ) {
                    // Clear timeout and reset running variable
                    clearTimeout(running);
                    running = false;
                    // Perform user defined function
                    settings.action();

                    return;
                }
            }
            wait( remaining );
        };

        var wait = function( time ) {
            running = setTimeout( doAction, time );
        };

        // Define new action starting time
        start = new Date();

        // Define runtime settings if function is run directly
        if( typeof millisec === 'number' ) { settings.duration = millisec; }
        if( typeof code === 'function' ) { settings.action = code; }

        // Only run timed loop if not already running
        if( !running ) { doAction(); }

    };


    $.fn.afterResize = function( method ) {

        if( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        } else {
            return methods.init.apply( this, arguments );
        }

    };

})(jQuery);
