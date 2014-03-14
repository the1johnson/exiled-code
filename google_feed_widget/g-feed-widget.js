google.load("feeds", "1");
var params = [],
    charCount = 130,
    titleCount = 50,
    container;

function setParams(){
    params.url = container.attr('data-rss');
    params.articles = container.attr('data-articles');
    params.category = container.attr('data-category');
}

function loadFeed(){
    var entries = 30,
        loaded = 0,
        feed = new google.feeds.Feed(params.url),
        reg_ex = new RegExp(params.category, "i");
    feed.setNumEntries(entries);
    feed.load(function(data){
        for(var i=0; i < data.feed.entries.length; i++){
            var entry = data.feed.entries[i],
                posturl = entry.link,
                categ = entry.categories.toString(),
                cont = entry.content,
                trimCont = cont.replace(/<(?:([a-zA-Z\?][\w:\-]*)(\s(?:\s*[a-zA-Z][\w:\-]*(?:\s*=(?:\s*"(?:\\"|[^"])*"|\s*'(?:\\'|[^'])*'|[^\s>]+))?)*)?(\s*[\/\?]?)|\/([a-zA-Z][\w:\-]*)\s*|!--((?:[^\-]|-(?!->))*)--|!\[CDATA\[((?:[^\]]|\](?!\]>))*)\]\])>/g, ""),
                postContent = trimCont.substr(0, charCount),
                title = entry.title,
                trimTitle = title.replace(/<(?:([a-zA-Z\?][\w:\-]*)(\s(?:\s*[a-zA-Z][\w:\-]*(?:\s*=(?:\s*"(?:\\"|[^"])*"|\s*'(?:\\'|[^'])*'|[^\s>]+))?)*)?(\s*[\/\?]?)|\/([a-zA-Z][\w:\-]*)\s*|!--((?:[^\-]|-(?!->))*)--|!\[CDATA\[((?:[^\]]|\](?!\]>))*)\]\])>/g, ""),
                titleTrim = trimTitle.substr(0, titleCount),
                html_block = (loaded == params.articles-1) ? '<a href="'+posturl+'" class="col-lg-4 last" target="_blank"><span class="news-item"><span class="news-heading">'+titleTrim+'</span><p>'+postContent+' [...]</p></span><span class="btn btn-default read-more" target="_blank" href="'+posturl+'">Read On</span></a>' : '<a href="'+posturl+'" class="col-lg-4" target="_blank"><span class="news-item"><span class="news-heading">'+titleTrim+'</span><p>'+postContent+' [...]</p></span><span class="btn btn-default read-more">Read On</span></a>';
                
            if (categ.search(reg_ex) > 0 && loaded<params.articles){
                loaded++;
                container.append(html_block);
            }
        }
    }); 
}

$(function(){
    container = $('#home-news');
    setParams();

});
google.setOnLoadCallback(loadFeed);