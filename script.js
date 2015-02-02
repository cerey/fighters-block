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
var animating = false;
var monster_attack = 1;
var monster_speed = 500;
var interval = null;
var counter = 0;
var exp = 0;
var exp_granted = false;
var counter = 0;
var monster_name = "";
var placeholder = "Hello, adventurer! Reach your word count goal to defeat the enemy, before you run out of HP. ";
date.setTime(date.getTime() + (999*24*60*60*1000));
date = date.toUTCString();
$(document).ready(function()
{
           // if (window['localStorage'] !== null)  {
            //localStorage.setItem('text', this.value);
            //localStorage.getItem('text');
            //chrome bug???
        //}
    if (window['localStorage'] == null) {
        $('#text').val("crying & debugging");
        //placeholder = placeholder + "It looks like local storage isn't supported, so please keep a backup of your writing as you go.";
    } else {
        //placeholder = placeholder + "Your writing will be saved locally as you go, but it would be a good idea to keep a backup anyway.";
        //$("#text").attr("value", localStorage.getItem("text"));
        $('#text').val(localStorage.getItem('text'));
    }        

    //$("#text").attr('placeholder', placeholder);

    if (getCookie("user_hp") != null) {
        user_hp = parseInt(getCookie("user_hp"));
    }

    if (getCookie("exp") == null) {
        document.cookie = "exp=0;";
    } 

    if (getCookie("exp_granted") != null && getCookie("exp_granted") == "true") {
        exp_granted = true;
    }

    if (getCookie("monster_name") != null) {
        monster_name = getCookie("monster_name");
    }
    if (getCookie("exp") != null)
        exp = parseInt(getCookie("exp"));

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
                if (!animating) {
                    animating = true;
                    $("#enemyimg").attr("src","img/1-2.gif");
                    setTimeout ( function() {
                        $("#enemyimg").attr("src","img/1-1.gif");
                        animating = false;
                    }, 1000 );
                }
                user_hp -= monster_attack;
                if (user_hp <= 0) {
                    user_hp = 0;
                    if (!exp_granted) {
                        exp_granted = true;
                        document.cookie = "exp_granted=true; expires=" + date;
                        $("#notifsymbol").html("j");
                        $("#notifsymbol").css('color', '#E5959E');
                        $("#exp_temp").html("Out of HP...");
                        shownotif();
                    }

                }
                updateBars();
            }
        }, monster_speed);
    }
    refreshInterval();
    function updateBars() {
        var color;
        if (monster_hp_bar > 80) {
            color = color5;
            $("#enemy").css('opacity', 1);

        }
        else if (monster_hp_bar > 60) {
            color = color4;
            $("#enemy").css('opacity', .8);

        }
        else if (monster_hp_bar > 40) {
            color = color3;
            $("#enemy").css('opacity', .6);

        }
        else if (monster_hp_bar > 20) {
            color = color2;
            $("#enemy").css('opacity', .4);

        }
        else {
            color = color1;
            $("#enemy").css('opacity', .2);

        }

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

        document.cookie = "user_hp=" + user_hp + "; expires=" + date;


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
        if (window['localStorage'] !== null)  {
            localStorage.setItem('text', this.value);
            localStorage.getItem('text');
            //chrome bug???
        }

        if (!paused && user_hp > 0) {
            user_hp += 1;
            if ((user_hp) > 100)
                user_hp = 100;  
            $("#animmagic").attr("src","img/set/novice-mage/" + (counter % 10) + ".png");
            counter++;
  
        }
        var matches = this.value.match(/[\u4E00-\u9FFF]|[a-zA-Z0-9]+/g);
        var words = matches ? matches.length : 0;
        if (user_hp > 0)
            monster_hp = total_monster_hp - words;
        if (monster_hp <= 0) {
            monster_hp = 0;
            if (!exp_granted ) {
                exp_granted = true;
                document.cookie = "exp_granted=true; expires=" + date;
                var exp_temp = parseInt(getCookie("exp_temp"))
                document.cookie = "exp=" + (exp + exp_temp);
                if (exp_temp > 0)
                    $("#exp_temp").html(+ exp_temp + " EXP!");
                else
                    $("#exp_temp").html("Completed!");
                shownotif();
            }
        }
        monster_hp_bar = Math.round(monster_hp / total_monster_hp * 100);
        updateBars();
    }).keyup();

    $('[data-tooltip]').addClass('tooltip');
    $('.tooltip').each(function() {  
        $(this).append('<span class="tooltip-content">' + $(this).attr('data-tooltip') + '</span>');  
    });
 }); 

function minimize() {
        var bheightmax = $(window).height() - 30 + "px"; 
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
        var bheight = $(window).height() - 270 + "px"; 
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
    $('#help').css({
            'display': 'none',
            'z-index': '-1'
        });
    $('.monsters').css({
            'display': 'none'
        });
    $('#smallcontainer').css({
            'display': 'none'
        }); 
    $('#total_monster_hp').html(total_monster_hp);
    $('#monster_name').html(monster_name);
    monster_hp = total_monster_hp;
    $('#monster_hp').html(total_monster_hp);
    document.cookie = "words=" + total_monster_hp + "; expires=" + date;
    document.cookie = "monster_name=" + monster_name + "; expires=" + date;
    document.cookie = "exp_granted=false; expires=" + date;
    exp_granted = false;
    document.cookie = "exp_temp="+counter+"; expires="+date;
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

function clearmonsters(vmin, vmax, multiplier, name) {
    monster_name = name;
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
        counter = Math.round(multiplier * temp);
        $('#sliderexp').html(counter);
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
        $('#exp').html(getCookie("exp"));
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
        $("#fight").css('background-image', 'url(\'img/bg2.png\')');
        break;
    case "2":
        $("#container").css('background-color', "#1a1334");
        $("body").css('background-color', "#26294a");
        $("#text").css('color', "#999ca7");
        $("#fight").css('background-image', 'url(\'img/bg6.png\')');
        break;
    case "3":
        $("#container").css('background-color', "#5a8a81");
        $("body").css('background-color', "#51574a");
        $("#text").css('color', "#ccf2ff");
        $("#fight").css('background-image', 'url(\'img/bg3.png\')');
        break;
    case "4":
        $("#container").css('background-color', "#eeeade");
        $("body").css('background-color', "#d5c6b0");
        $("#text").css('color', "#4c3f37");
        $("#fight").css('background-image', 'url(\'img/bg5.png\')');
        break;
    case "5":
        $("#container").css('background-color', "#e0ecf4");
        $("body").css('background-color', "#9ebcda");
        $("#text").css('color', "#4d004b");
        $("#fight").css('background-image', 'url(\'img/bg1.png\')');
        break;
    case "6":
    $("#container").css('background-color', "#222");
    $("body").css('background-color', "#333");
    $("#text").css('color', "#eee");
    $("#fight").css('background-image', 'url(\'img/bg4.png\')');
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

function newMonster() {
    document.cookie = "user_hp=100; expires=" + date;
    document.cookie = "words=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    location.reload();
}

function shownotif() {
    $('#expnotif').css({
        'opacity' : '.6',
        'left' : '40px'
    });
    setTimeout ( function() {
        $('#expnotif').css({
            'opacity' : '0',
            'left' : '-200px'
        });            
    }, 2000 );
}