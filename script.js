var height = $(window).height() - 30 + "px"; 
var height_max = $(window).height() + "px"; 
var paused = false;
$(document).ready(function()
{
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

    document.getElementById("container").style.height = height;
    $('#text').niceScroll({
        cursorwidth: 10,
        cursorborder: "8px solid #fff",
        cursorborderradius: "80px",
        cursoropacitymax: .75,
        hidecursordelay: 2500
    });

    $('#total_monster_hp').html(total_monster_hp);
    $('#monster_hp').html(monster_hp);
    $('#user_hp').html(user_hp);
    $('#hpbox').keyup(function() {
        total_monster_hp = document.getElementById("hpbox").value;
        $('#total_monster_hp').html(total_monster_hp);
        updateBars();

    });
    $('#text').keydown(function(e) {
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
        user_hp += 1;
        if ((user_hp) > 100)
            user_hp = 100;
        var matches = this.value.match(/\b/g);
        wordCounts[this.id] = matches ? matches.length / 2 : 0;
        var words = 0;
        $.each(wordCounts, function(k, v) {
            words += v;
        });
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