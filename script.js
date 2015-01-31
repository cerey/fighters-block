var bheight = $(window).height() - 270 + "px"; 
var bheightmax = $(window).height() - 30 + "px"; 
var paused = false;
var minimized = false;
var total_monster_hp = 100;
var monster_hp = total_monster_hp;
var user_hp = 100;
var wordCounts = {};
var color1 = "#E5959E";
var color2 = "#F6BA9E";
var color3 = "#FFE5A3";
var color4 = "#C1D193";
var color5 = "#78AE8C";
var monster_hp_bar = 100;
var settings = false;
var slidey = null;
var user = false;
var date = new Date();
var monster_attack = 1;
var monster_speed = 500;
var interval = null;
date.setTime(date.getTime() + (999*24*60*60*1000));
date = date.toUTCString();
$(document).ready(function()
{
    if (getCookie("font") != null)
        $("#text").css('font-family', getCookie("font"));

    if (getCookie("speed") != null) 
        monster_speed = getCookie("speed");

    if (getCookie("attack") != null)
        monster_attack = getCookie("attack");

    if (getCookie("size") != null)
        $("#text").css('font-size', getCookie("size"));

    if (getCookie("wide") != null)
        changeWide(getCookie("wide"));

    if (getCookie("color") != null)
        changeColor(getCookie("color"));


    $('#text').css({
            'height': bheight
        }); 
    $('#speedselect').selectOrDie({
        placeholder: "Monster Speed",
        onChange: function() { 
            clearInterval(interval);
            monster_speed = $(this).val();
            refreshInterval();
            document.cookie = "speed=" + $(this).val() + "; expires=" + date;
        }
    }); 
    $('#attackselect').selectOrDie({
        placeholder: "Monster Attack",
        onChange: function() { 
            monster_attack = $(this).val();
            document.cookie = "attack=" + $(this).val() + "; expires=" + date;
        }
    });     
    $('#fontselect').selectOrDie({
        placeholder: "Font",
        onChange: function() { 
            $("#text").css('font-family', $(this).val());
            document.cookie = "font=" + $(this).val() + "; expires=" + date;
        }
    });
    $('#sizeselect').selectOrDie({
        placeholder: "Text Size",
        onChange: function() { 
            $("#text").css('font-size', $(this).val());
            document.cookie = "size=" + $(this).val() + "; expires=" + date;

        }
    });
    
    $('#widescreen').selectOrDie({
        placeholder: "Display",
        onChange: function() {
            changeWide($(this).val());
        }
    });

    $('#themeselect').selectOrDie({
        placeholder: "Theme",
        onChange: function() { 
            changeColor($(this).val());
        }
    });

    function refreshInterval() {
        interval = setInterval(function() {
            if (monster_hp > 0 && !paused) {
                user_hp -= monster_attack;
                if (user_hp < 0)
                    user_hp = 0;
                updateBars();
            }
        }, monster_speed);
    }
    refreshInterval();
    function updateBars() {
        var color;
        if (monster_hp_bar > 80)
            color = color5;
        else if (monster_hp_bar > 60)
            color = color4;
        else if (monster_hp_bar > 40)
            color = color3;
        else if (monster_hp_bar > 20)
            color = color2;
        else
            color = color1;

        var colorh;
        if (user_hp > 80)
            colorh = color5;
        else if (user_hp > 60)
            colorh = color4;
        else if (user_hp > 40)
            colorh = color3;
        else if (user_hp > 20)
            colorh = color2;
        else
            colorh = color1;

        $('#monster_hp').html(monster_hp);
        $('#user_hp').html(user_hp);

        $("#monster_progressbar span").css('width', monster_hp_bar +'%');
        $('#user_progressbar span').css('width', user_hp +'%');
        $('#monster_progressbar span').css('background-color', color);
        $('#user_progressbar span').css('background-color', colorh);

    }

        $('#text').niceScroll({
            cursorwidth: 10,
            cursorborder: "8px solid transparent",
            cursorborderradius: "80px",
            cursoropacitymax: .75,
            hidecursordelay: 2500
        });

    if (getCookie("words") == null) {
        $('.monsters').flexslider({
            animation: "slide"
        });
        $('.monsters').flexslider("pause") 
    } else {
        total_monster_hp = parseInt(getCookie("words"));
        clearbox();
    }

    if (monster_hp > 0) {
        //todo
        $('#total_monster_hp').html(total_monster_hp);
        $('#monster_hp').html(monster_hp);
    }
    $('#user_hp').html(user_hp);
    $('#text').keyup(function(e) {
        //They see me tabbin', they hatin' 
        if(e.keyCode === 9) {
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var $this = $(this);
        var value = $this.val();
        $this.val(value.substring(0, start)
                    + "\t"
                    + value.substring(end));
        this.selectionStart = this.selectionEnd = start + 1;
        e.preventDefault();
    }
        if (!paused) {
            user_hp += 1;
            if ((user_hp) > 100)
                user_hp = 100;    
        }
        var matches = this.value.match(/[\u4E00-\u9FFF]|[a-zA-Z0-9]+/g);
        var words = matches ? matches.length : 0;
        monster_hp = total_monster_hp - words;
        if (monster_hp < 0)
            monster_hp = 0;
        monster_hp_bar = Math.round(monster_hp / total_monster_hp * 100);
        updateBars();
    }).keyup();

    $('[data-tooltip]').addClass('tooltip');
    $('.tooltip').each(function() {  
        $(this).append('<span class="tooltip-content">' + $(this).attr('data-tooltip') + '</span>');  
    });
 }); 

function minimize() {
        minimized = true;
        $('#min').css({
            'display': 'none'
        });
        $('#max').css({
            'display': 'inline'
        });
        $('#hp').css({
            'display': 'none'
        });
        $('#fight').css({
            'display': 'none'
        });
        $('#monster_progressbar').css({
            'height': '3px',
            'margin-top' : '-11px'
        });
        $('#user_progressbar').css({
            'height': '3px',
            'margin-top' : '0px'
        });
        $('#text').css({
            'height': bheightmax
        });
        if (settings) {
            showsettings();
        }
        if (user) {
            showuser();
        }

}

function maximize() {
        minimized = false;
        $('#min').css({
            'display': 'inline'
        });
        $('#max').css({
            'display': 'none'
        });
        $('#monster_progressbar').css({
            'height': '15px',
            'margin-top' : '202px'
        });
        $('#user_progressbar').css({
            'height': '15px',
            'margin-top' : '3px'
        });
        $('#hp').css({
            'display': 'inline',
        });

        $('#text').css({
            'height': bheight
        });
        $('#fight').css({
            'display': 'inline',
        });
}

function pause() {
    if (paused) {
        paused = false;
    }
    else {
        paused = true;
    }
}

function clearbox() {
    $('#dialogbox').css({
            'display': 'none'
        });
    $('.monsters').css({
            'display': 'none'
        });
    $('#smallcontainer').css({
            'display': 'none'
        }); 
    $('#total_monster_hp').html(total_monster_hp);
    monster_hp = total_monster_hp;
    $('#monster_hp').html(total_monster_hp);
    document.cookie = "words=" + total_monster_hp + "; expires=" + date;

}

function showmonsters () {
    $('.monsters').css({
            'display': 'inline'
        });
    $('#smallcontainer').css({
            'z-index': '-1'
        });
    document.querySelector('.range-bar').remove();
}

function clearmonsters(vmin, vmax, multiplier) {
    $('.monsters').css({
            'display': 'none'
        });    
    $('#smallcontainer').css({
            'z-index': '13'
        }); 
    $('#slidercounter').html(vmin);  
    $('#slidermultiplier').html(multiplier);  
    $('#sliderexp').html(Math.round(multiplier * vmin)); 
    total_monster_hp = vmin;   
    slidey = document.querySelector('.slider')
      , initChangeInput = new Powerange(slidey, {hideRange: true, min: vmin, max: vmax, start: vmin});
    slidey.onchange = function() {
        var temp = slidey.value;
        $('#slidercounter').html(temp);
        $('#sliderexp').html(Math.round(multiplier * temp));
        total_monster_hp = temp;
    };
}

function showsettings() {
    if (user) {
            showuser();
        }
    if (settings) {
        $('#settings').css({
            'right': '-300px',
            'opacity' : '0',
            'z-index' : '-1'
        });

    } else {
        $('#settings').css({
            'right': '0px',
            'opacity' : '.8',
            'z-index' : '5'
        });
    }
    settings = !settings;
}

function showuser() {
    if (settings) {
            showsettings();
        }
    if (user) {
        $('#user').css({
            'right': '-300px',
            'opacity' : '0',
            'z-index' : '-1'
        });

    } else {
        $('#user').css({
            'right': '0px',
            'opacity' : '.8',
            'z-index' : '5'
        });
    }
    user = !user;
}

function changeColor(col) {
    document.cookie = "color=" + col + "; expires=" + date;
    switch (col)
    {
    case "1":
        $("#container").css('background-color', "#fff");
        $("body").css('background-color', "#eee");
        $("#text").css('color', "#000");
        break;
    case "2":
        $("#container").css('background-color', "#1a1334");
        $("body").css('background-color', "#26294a");
        $("#text").css('color', "#01545a");
        break;
    case "3":
        $("#container").css('background-color', "#447c69");
        $("body").css('background-color', "#51574a");
        $("#text").css('color', "#74c493");
        break;
    case "4":
        $("#container").css('background-color', "#eeeade");
        $("body").css('background-color', "#d5c6b0");
        $("#text").css('color', "#4c3f37");
        break;
    case "5":
        $("#container").css('background-color', "#e0ecf4");
        $("body").css('background-color', "#9ebcda");
        $("#text").css('color', "#4d004b");
        break;
    case "6":
    $("#container").css('background-color', "#222");
    $("body").css('background-color', "#555");
    $("#text").css('color', "#eee");
    break;
    }
}

function changeWide(wide) { 
    if (wide == "narrow") {
        $("#container").css('width', "800px");
        $("#text").css('width', "720px");
    } else {
        $("#container").css('width', "100%");
        var w = $(window).width() - 80 + 'px';
        $("#text").css('width', w);
    } 
    document.cookie = "wide=" + wide + "; expires=" + date;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return null;
}