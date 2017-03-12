function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    window.clock.textContent = h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i;}
    return i;
}


function getUser() {
  var gid = QueryString.id;
  var url = 'http://localhost:80/api/user?gid=' + gid;

  getAjax(url, function(data){
    data = JSON.parse(data);

    var profile = new Vue({
      el: '#profile_info',
      data: {
        name: greeting(data.firstname + " " + data.lastname, new Date()) ,
        photo: data.photo
      }
    });

    setInterval(function(){
      greeting(data.firstname + " " + data.lastname, new Date(), true);
    },60000 * 10);
  });

}

function greeting(name, date, elem = false) {
  var greeting = "";
  if(date.getHours() < 12){
    greeting = "Good morning " + name + "!";
  }else if(date.getHours() >= 12 && date.getHours() < 19 ){
    greeting = "Hi " + name;
  }else{
    greeting = "Good evening, " + name + "!";
  }
  if(elem)
    window.the_name.textContent = "" + greeting;

  return greeting;

}


function getIssues() {
  var gid = QueryString.id;
  var url = 'http://localhost:80/api/user/' + gid + "/issues";

  getAjax(url, function(data){
    data = JSON.parse(data);
    window.issue_list.innerHTML = "";
    var has_issues = (data.length > 0) ? true : false;
    window.issues.classList.remove("hidden");
    if(data.length > 0){

      for (var i = 0; i < data.length; i++) {
        var element = document.createElement("li");
        var heading_item = document.createElement("h3");
        var paragraph_item = document.createElement("p");
        heading_item.textContent = data[i].title;
        paragraph_item.textContent = "Repository: " + data[i].repository.name + " Assigned by: " + data[i].user.login;
        element.appendChild(heading_item);
        element.appendChild(paragraph_item);
        window.issue_list.appendChild(element);
      }

    }else{
      // add paragraph
      var p = document.createElement("p");
      p.textContent = "No issue at the moment";
      window.issues.appendChild(p);
    }

  });

}

function getNewsArticles() {
  var gid = QueryString.id;
  var url = 'http://localhost:80/api/user/' + gid + '/articles';
  getAjax(url, function(data){
    data = JSON.parse(data);
    getArticle(data.articles);
  });
}

function getRandomJoke() {
  var url = 'http://localhost:80/api/joke';

  getAjax(url, function(data){
    data = JSON.parse(data);
    window.chuck_joke.innerHTML = "";
    var paragraph_item = document.createElement("p");
    paragraph_item.textContent = data.value.joke;
    window.chuck_joke.appendChild(paragraph_item);
  });
}

function getArticle(articles) {
  var article = articles[Math.floor(Math.random()*articles.length)];
  window.newsarcticle.innerHTML = "";

  var element = document.createElement("img");
  var div_el = document.createElement("div");
  var heading_item = document.createElement("h3");
  var paragraph_item = document.createElement("p");
  element.src = article.urlToImage;
  heading_item.textContent = article.title;
  paragraph_item.textContent = article.description + " By: " + article.author;
  window.newsarcticle.appendChild(element);
  div_el.appendChild(heading_item);
  div_el.appendChild(paragraph_item);
  window.newsarcticle.appendChild(div_el);

  var qrcode = new QRCode("qr_code", {
      text: article.url,
      width: 128,
      height: 128,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
  });

  qrcode.clear();
  qrcode.makeCode(article.url);
}

function showMessage() {
  window.popup.innerHTML = "";
  window.popup.classList.remove("hidden");
  var paragraph_item = document.createElement("p");
  paragraph_item.textContent = 'Forget about your tasks for a minute. Strech out and chill for a moment!';
  window.popup.appendChild(paragraph_item);
  setTimeout(
    function() {
      window.popup.classList.add("hidden");
    }, 60000);
}

getNewsArticles();
getIssues();
getUser();
startTime();
getRandomJoke();
setInterval(showMessage, 60000 * 60);
setInterval(getRandomJoke, 60000 * 5);
setInterval(getNewsArticles, 60000);
setInterval(getIssues, 300000);
