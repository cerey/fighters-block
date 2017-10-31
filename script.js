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
var exp_granted;
var counter = 0;
var monster_name = "Not-A-Block";
var exp_red = 0;
var exp_quin = -1;
var exp_karen = 0;  
var placeholder = "Hello, adventurer! Reach your word count goal to defeat the enemy, before you run out of HP. \n\nBe sure to check out the upper right corner for menu options, including customization and minimized mode to hide animations.";
date.setTime(date.getTime() + (999*24*60*60*1000));
date = date.toUTCString();
var current_fighter = "red";
$(document).ready(function()
{
    $('.tooly').tooltipster({
         theme: 'tooltipster-shadow'
         });
    if (window['localStorage'] == null) {
        placeholder = placeholder + "\n\nIt looks like local storage isn't supported, so please keep a backup of your writing as you go.";
    } else {
        placeholder = placeholder + "\n\nYour writing will be saved locally as you go, but it would be a good idea to keep a backup anyway.";
        $('#text').val(localStorage.getItem('text'));
    }        

    $("#text").attr('placeholder', placeholder);

    if (getCookie("user_hp") != null) {
        user_hp = parseInt(getCookie("user_hp"));
    }

    if (getCookie("current_fighter") == null) {
    } else {
        current_fighter= getCookie("current_fighter");
    }

    if (getCookie("exp_red") == null) {
        document.cookie = "exp_red=0;";
    }  else {
         exp_red = parseInt(getCookie("exp_red"));
    }

    if (getCookie("exp_quin") == null) {
        document.cookie = "exp_quin=-1;"; 
    } else {
        exp_quin = parseInt(getCookie("exp_quin"));
    }

    if (getCookie("exp_karen") == null) {
        document.cookie = "exp_karen=0;"; 
    } else {
        exp_karen = parseInt(getCookie("exp_karen"));
    }

    if (getCookie("exp_granted") != null && getCookie("exp_granted") == "true") {
        exp_granted = true;
    } else {
        exp_granted = false;
    }

    if (getCookie("monster_name") != null) {
        monster_name = getCookie("monster_name");
    }


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

    paused = true;
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
        if (user_hp > 80) {
            jQuery.favicon('img/favicon5.png');
            colorh = color5; }
        else if (user_hp > 60) {
            jQuery.favicon('img/favicon4.png');
            colorh = color4; }
        else if (user_hp > 40) {
            jQuery.favicon('img/favicon3.png');
            colorh = color3; }
        else if (user_hp > 20) {
             jQuery.favicon('img/favicon2.png');
            colorh = color2;}
        else {
            colorh = color1;
            jQuery.favicon('img/favicon1.png'); }

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
        selectFighter(1);
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
    $("body").on('keydown', '#text', function(e) { 
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
            $("#animmagic").attr("src","img/set/"+current_fighter+"/" + (counter % 10) + ".png");
            counter++;
  
        }
        var matches = this.value.match(/[\u4e00-\u9fa5]|\S+/g);
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
                //add exp for new fighters
                var current_exp = 1;
                if (current_fighter == "quin") {
                    exp_quin = parseInt(exp_quin) + parseInt(total_monster_hp);
                    document.cookie = "exp_quin=" + exp_quin + "; expires=" + date;
                    current_exp = exp_quin;
                } else if (current_fighter == "karen") {
                    exp_karen = parseInt(exp_karen) + parseInt(total_monster_hp);
                    document.cookie = "exp_karen=" + exp_karen + "; expires=" + date;
                    current_exp = exp_karen;
                } else {
                    exp_red = parseInt(exp_red) + parseInt(total_monster_hp);
                    document.cookie = "exp_red=" + exp_red + "; expires=" + date;
                    current_exp = exp_red;
                }

                //check if unlocked new fighters
                if (expToLevel (current_exp) >= 11 && exp_quin < 0)
                {
                    exp_quin = 1;
                    document.cookie = "exp_quin=1; expires=" + date;
                }
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

function pausey() {
    if (paused) {
        paused = false;
        $('.pausebutton').html("O");
    }
    else {
        paused = true;
        $('.pausebutton').html("S");
    }
}

function clearbox() {//this is the one that runs every time page is refreshed
    $('#dialogbox').css({
            'display': 'none'
        });
    $('#help').css({
            'display': 'none',
            'z-index': '-1'
        });
    $('.selectbox').css({
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
    document.cookie = "exp_temp="+counter+"; expires="+date;
    checkFighter();
}


function clearmonsters() { //this is the one that runs only once per monster
    $('.selectbox').css({
            'display': 'none'
        });    
    $('#smallcontainer').css({
            'z-index': '13'
        }); 
    total_monster_hp = document.getElementById('num').value;   
    counter =  total_monster_hp;
    document.cookie = "current_fighter=" + current_fighter+ "; expires=" + date;
    paused = false;
    exp_granted = false;
    user_hp = 100;
    clearbox();
}
   

function checkFighter() {
     if(current_fighter == "quin") { //do animations for different fighters...
       $('#avatar').attr('src', 'img/set/quin.gif');       
    } else if (current_fighter == "karen") {
    $('#avatar').attr('src', 'img/set/karen.gif');  
    }

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
        //todo probably put this all in 1 method
        if (current_fighter=="quin") {
            $('#exp').html(getCookie("exp_quin"));
            $('#level').html(expToLevel(getCookie("exp_quin")));
        } else if (current_fighter=="karen") {
            $('#exp').html(getCookie("exp_karen"));
            $('#level').html(expToLevel(getCookie("exp_karen")));
        } else {
            $('#exp').html(getCookie("exp_red"));
            $('#level').html(expToLevel(getCookie("exp_red")));        
        }

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
        $("html, body").css('background-color', "#eee");
        $("#text").css('color', "#000");
        $("#fight").css('background-image', 'url(\'img/bg2.png\')');
        break;
    case "2":
        $("#container").css('background-color', "#1a1334");
        $("html, body").css('background-color', "#26294a");
        $("#text").css('color', "#999ca7");
        $("#fight").css('background-image', 'url(\'img/bg6.png\')');
        break;
    case "3":
        $("#container").css('background-color', "#5a8a81");
        $("html, body").css('background-color', "#51574a");
        $("#text").css('color', "#ccf2ff");
        $("#fight").css('background-image', 'url(\'img/bg3.png\')');
        break;
    case "4":
        $("#container").css('background-color', "#eeeade");
        $("html, body").css('background-color', "#d5c6b0");
        $("#text").css('color', "#4c3f37");
        $("#fight").css('background-image', 'url(\'img/bg5.png\')');
        break;
    case "5":
        $("#container").css('background-color', "#e0ecf4");
        $("html, body").css('background-color', "#9ebcda");
        $("#text").css('color', "#4d004b");
        $("#fight").css('background-image', 'url(\'img/bg1.png\')');
        break;
    case "6":
        $("#container").css('background-color', "#222");
        $("html, body").css('background-color', "#333");
        $("#text").css('color', "#eee");
        $("#fight").css('background-image', 'url(\'img/bg4.png\')');
        break;
    case "7":
        $("#container").css('background-color', "#000");
        $("html, body").css('background-color', "#1A1717");
        $("#text").css('color', "#3CFF00");
        $("#fight").css('background-image', 'url(\'img/hacked.png\')');
        break;
    
    case "8":
        $("#container").css('background-color', "#5E3E67");
        $("html, body").css('background-color', "#90748A");
        $("#text").css('color', "#FFC759");
        $("#fight").css('background-image', 'url(\'img/spooked.png\')');
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

function clearAndNew() {
    $('#text').val("");
    localStorage.setItem('text', "");
    newMonster();
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

function selectMonster(num) {
    switch(num)
    {
        case 0:
            monster_name = "?";
            $("#monstername").html(monster_name);
            $("#monsterdesc").html("This monster has yet to be discovered. Keep an eye out for newcomers in development.");
            break;
        case 1:
            monster_name = "Not-A-Block";
            $("#monstername").html(monster_name);
            $("#monsterdesc").html("A native of the Blocky Woods, this oblong has been ostracized all its life for its strange appearance.");
    }
}

function selectFighter(num) {
    switch(num)
    {
        case 0:
            $("#fightername").html("?");
            $("#fighterdesc").html("This fighter is MIA. Keep an eye out for newcomers in development.");
            break;
        case 1:
            $("#fightername").html("Red (Level " + expToLevel(exp_red)+ ")");
            $("#fighterdesc").html("A mage from Somewhereshire; rumors say she's trying to hunt a certain carnivore prowling these parts.");
            current_fighter = "red";
            break;
        case 2:
            if (exp_quin > 0) {
                $("#fightername").html("Quin (Level " + expToLevel(exp_quin)+ ")");
                $("#fighterdesc").html("A scribe returning from the great NaNoWriMo Festival, famous for being an ambidextrous dual-wielder.");
                current_fighter = "quin";
            }   else {
                $("#fightername").html("Quin (Locked)");
                $("#fighterdesc").html("A scribe returning from the great NaNoWriMo Festival. Reach level 11 and catch his eye.");
            }     
            break;
        case 3:
            $("#fightername").html("Karen (Level " + expToLevel(exp_karen)+ ")");
            $("#fighterdesc").html("Nearfield's premier bookkeeper, noodle connoisseur, and dragon slayer. Eternally beautiful.");
            current_fighter = "karen";
            break;

    }
}

function addExp(fighter, num) {

}

function expToLevel(num) {
     return Math.floor((Math.sqrt(633+128*num)-11)/37) + 1;
    //return Math.floor(num/150) + 1;
}