var height = $(window).height() - 30 + "px"; 
var height_max = $(window).height() + "px"; 
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
var timerInterval = 500;
var settings = false;
$(document).ready(function()
{
    $('#fontselect').selectOrDie({
        placeholder: "Font",
        onChange: function() { 
            $("#text").css('font-family', $(this).val());
        }
    });
    $('#sizeselect').selectOrDie({
        placeholder: "Text Size",
        onChange: function() { 
            $("#text").css('font-size', $(this).val());
        }
    });
    
    $('#widescreen').selectOrDie({
        placeholder: "Paper Display",
        onChange: function() { 
            if ($(this).val() == "narrow") {
                $("#container").css('width', "800px");
                $("#text").css('width', "720px");
            } else {
                $("#container").css('width', "100%");
                var w = $(document).width() - 80;
                $("#text").css('width', w + "px");
            } 
        }
    });

    $('#themeselect').selectOrDie({
        placeholder: "Theme",
        onChange: function() { 
            switch ($(this).val())
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
    });

    setInterval(function() {
        if (monster_hp > 0 && !paused) {
            user_hp -= 1;
            if (user_hp < 0)
                user_hp = 0;
            updateBars();
        }
    }, timerInterval);

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

    $('.monsters').flexslider({
        animation: "slide"
    });
    $('.monsters').flexslider("pause") //Pause slideshow`


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
        $('#monster_progressbar').css({
            'height': '3px',
            'margin-top' : '-11px'
        });
        $('#user_progressbar').css({
            'height': '3px',
            'margin-top' : '0px'
        });
        $('#text').css({
            'height': "90%"
        });
        if (settings) {
            showsettings();
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
            'margin-top' : '20px'
        });
        $('#user_progressbar').css({
            'height': '15px',
            'margin-top' : '3px'
        });
        $('#hp').css({
            'display': 'inline',
        });

        $('#text').css({
            'height': '80%'
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
    updateBars();

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
    var slidey = document.querySelector('.slider')
      , initChangeInput = new Powerange(slidey, {hideRange: true, min: vmin, max: vmax, start: vmin});
    slidey.onchange = function() {
        var temp = slidey.value;
        $('#slidercounter').html(temp);
        $('#sliderexp').html(Math.round(multiplier * temp));
        total_monster_hp = temp;
    };
}

function showsettings() {
    if (settings) {
        $('#settings').css({
            'display': 'none'
        });
    } else {
        $('#settings').css({
            'display': 'inline'
        });
    }
    settings = !settings;
}