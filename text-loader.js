var textFile = null;
function dl() {
    var txt = $("#text").val();
    //txt = txt.replace(/\n\r?/g, '<br />');
    var link= makeTextFile(txt);
    //document.getElementById('dl').href = link;
    window.open(link); 
};

function makeTextFile(text) {
    var data = new Blob([text], {type: 'text/plain'});
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
}; 