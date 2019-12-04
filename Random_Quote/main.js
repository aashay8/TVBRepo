const COLORS = ['#16a085', '#27ae60', '#2c3e50', '#f39c12', '#e74c3c', '#9b59b6', '#FB6964', '#342224', "#472E32", "#BDBB99", "#77B1A9", "#73A857"];

var $ = (selector) => document.querySelectorAll(selector)
function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
docReady(function(){
    var quotes = {}
fetch('https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json')
.then(data=> data.json())
    .then((json)=>{
     quotes = json;   
    quoteChange();
})
.catch((error)=> {alert('error in fetch')})


function quoteChange(){
    let color = COLORS[Math.floor(Math.random()*(COLORS.length))]
    let quote = quotes.quotes[Math.floor(Math.random()*(quotes.quotes.length))]
    $('#quote')[0].innerHTML = quote.quote;
    $('#author')[0].innerHTML = quote.author;
    $('body')[0].style.background = color
    $('button')[0].style.background = color
}

$('#new-quote')[0].onclick = function(){
    quoteChange();
}
})