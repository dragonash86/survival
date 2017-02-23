Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('');
};

$(function() {
    var TODAY_SECURITY_LEVEL_ARRAY = {
        NORMAL: 'level_4/정상',
        CAUTION: 'level_3/주의',
        WARNING: 'level_1/경고',
        DANGER: 'level_2/위험'
    };


    function setTodaySecurityLevel(todaySecurityLevel) {
        var todayLevel = TODAY_SECURITY_LEVEL_ARRAY[todaySecurityLevel];
        $('#todayLevel').addClass(todayLevel.split('/')[0]);
        $('#todayLevel').text(todayLevel.split('/')[1]);
    }

    function setTodaySecurityDate(securityDate) {
        $('#todayLevelDate').text(securityDate);
    }

    $.get('/today/security', function(result) {
        if (result != undefined && result.result == true) {
            setTodaySecurityLevel(result.securitLevel);
            setTodaySecurityDate(result.date);
            $('#todaySecurityLevelSection').show();
        }
    });
});

function getParam(key) {
    var _parammap = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function() {
        function decode(s) {
            return decodeURIComponent(s.split('+').join(' '));
        }

        _parammap[decode(arguments[1])] = decode(arguments[2]);
    });

    return _parammap[key];
}

function activeCategory(category) {
    var checkString = category;
    if (category === undefined) {
        checkString = 'ALL';
    }
    var listTag = $('ul[class=tab] li a');
    listTag.each(function(item) {
        if ($(listTag[item]).text().replace(/ /g, '') == checkString.replace(/ /g, '')) {
            $(listTag[item]).parent('li').addClass('active');
        }
    });
    var mobileTag = $('.tab_mobile option');
    mobileTag.each(function(item) {
        if ($(mobileTag[item]).text().replace(/ /g, '') == checkString.replace(/ /g, '')) {
            $(mobileTag[item]).attr('selected', true);
        }
    });

}

function setPagenationCategory(category, q) {
    var pageTag = $('.paginate a');
    pageTag.each(function(item) {
        var url = $(pageTag[item]).attr('href') + '?' + (category !== undefined ? ('category=' + category) : '');
        if (q !== null && q !== undefined) {
            url += "q=" + encodeURI(q);
        }
        $(pageTag[item]).attr('href', url);
    });
}

function setNewsLetter(success) {
    $.ajax({
        url: '/mainNewsletterAPI',
        type: 'GET',
        dataType: 'json',
        success: success,
        error: function(request, status, error) {
            // alert('code:' + request.status + '\n' + 'message:' + request.responseText + '\n' + 'error:' + error);
        }
    });
}

if ($(".main_notice").length > 0) {
    setNewsLetter(function(result) {
        $('#commonSense p').text('');
        $('#commonSense strong').text('');
        $('#column strong').text('');
        $('#column p').text('');

        $('#column strong').text(result.data.column.title);
        $('#column p').text(result.data.column.content);
        $('#column').attr('href', '/securityCenter/column/view/' + result.data.column.id);


        $('#commonSense p').text(result.data.commonSense.content);
        $('#commonSense strong').text(result.data.commonSense.title);
        $('#commonSense').attr('href', '/securityCenter/commonSense/view/' + result.data.commonSense.id);
        $('.security_trends strong').text(result.data.alyacBlog.title);
        $('.security_trends p').html(result.data.alyacBlog.content);
        $('.security_trends a').attr('href', result.data.alyacBlog.url);

        $('#security_vulnerability_1 p').text(result.data.securityVulnerability[0].content);
        $('#security_vulnerability_1 strong').text(result.data.securityVulnerability[0].title);
        $('#security_vulnerability_1').attr('href', '/securityCenter/securityVulnerability/view/' + result.data.securityVulnerability[0].id);

        $('#security_vulnerability_2 p').text(result.data.securityVulnerability[1].content);
        $('#security_vulnerability_2 strong').text(result.data.securityVulnerability[1].title);
        $('#security_vulnerability_2').attr('href', '/securityCenter/securityVulnerability/view/' + result.data.securityVulnerability[1].id);

    });
}

if ($(".security_trends").length > 0) {
    var report_img = [{
            "img": "/images/security_trends_img_1.png"
        },
        {
            "img": "/images/security_trends_img_2.png"
        },
        {
            "img": "/images/security_trends_img_3.png"
        },
        {
            "img": "/images/security_trends_img_4.png"
        },
        {
            "img": "/images/security_trends_img_5.png"
        }
    ];
    var reportNum = Math.floor(Math.random() * report_img.length);
    var secureImg = $("#secure_img");
    secureImg.attr({
        src: report_img[reportNum].img
    });
}

// 배너 랜덤
if ($(".site_map").length > 0) {
    var sitemap_banner = [{
            "url": "/product/securedisk",
            "img": "/images/banner_sitemap_1.jpg",
            "alt": "시큐어디스크 : 문서중앙화를 통해 내부자료 유출,유실 방지부터 기업자산관리까지! 한번에 해결하세요"
        },
        {
            "url": "/product/imas_cloud",
            "img": "/images/banner_sitemap_2.jpg",
            "alt": "IMAS : APT 방어를 위한 통합 보안의 중심! 지능형 악성코드 분석 시스템"
        }
    ];
    var sitemapNum = Math.floor(Math.random() * sitemap_banner.length);
    var siteBanner = $("#sitemap_banner");
    var siteBannerImg = $("#sitemap_banner img");
    siteBanner.attr({
        href: sitemap_banner[sitemapNum].url
    });
    siteBannerImg.attr({
        src: sitemap_banner[sitemapNum].img,
        alt: sitemap_banner[sitemapNum].alt
    });
}

var category = getParam("category");
activeCategory(category);
setPagenationCategory(category, getParam("q"));

function getSplitFirstURI(url) {
    return url.split("/")[1];
}

function setMobileSelectActive() {
    var mobileTag = $('.tab_mobile option');
    var checkString = $(".tab li[class=active]").text();
    mobileTag.each(function(item) {
        //console.log($(mobileTag[item]).text().replace(/ /g, ''));
        if ($(mobileTag[item]).text().replace(/ /g, '') == checkString.replace(/ /g, '')) {
            $(mobileTag[item]).attr('selected', true);
        }
    });
}

setMobileSelectActive();

var input = getSplitFirstURI($(location).attr('pathname'));
var menuActiveTag = $('ul[class=nav_main] li.mega_menu_fullwidth > a');
menuActiveTag.each(function(item) {
    //console.log(item);
    if (getSplitFirstURI($(menuActiveTag[item]).attr("href")) == input) {
        $(this).addClass("active");
    }
});

var menuMbActiveTag = $('ul[class=sub_menu] li a');
menuMbActiveTag.each(function(item) {
    //console.log(item);
    if (window.location.pathname == $(menuMbActiveTag[item]).attr("href")) {
        $(this).closest('li.mega_menu_fullwidth').addClass("resp_active");
        $(this).closest('li.dropdown_submenu').addClass("resp_active");
        $(this).addClass("active");
    }
});

if ($("input[name=q]").length > 0) {
    $("button[type=submit]").click(function() {
        if ($("input[name=q]").val() === "") {
            alert("검색어를 입력해주세요");
            return false;
        }
    });
}
