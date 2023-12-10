'use strict';

{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorSideLink: Handlebars.compile(document.querySelector('#template-author-side-link').innerHTML),
  };

  const opts = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post-author',
    tagsListSelector: '.tags.list',
    cloudClassCount: 4,
    cloudClassPrefix: 'tag-size-',
    authorsListSelector: '.authors.list',
  };

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const clickedLinkAttribute = clickedElement.getAttribute('href');

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const selectedArticle = document.querySelector(clickedLinkAttribute);

    /* [DONE] add class 'active' to the correct article */
    selectedArticle.classList.add('active');
  };

  const generateTitleLinks = function(customSelector = ''){

    /* remove contents of titleList */
    const titleList = document.querySelector(opts.titleListSelector);
    titleList.innerHTML = '';

    /* for each article */
    const articles = document.querySelectorAll(opts.articleSelector + customSelector);

    let html = '';

    for(let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

      /* create HTML of the link */
      // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);

      /* insert link into titleList */
      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();


  // /* My opts.ional function calculateTagsParams (with min & max function) */

  // const calculateTagsParams = function(tags){
  //   let tagCounterList = [];

  //   for(let tag in tags){
  //     tagCounterList.push(tags[tag]);
  //   }

  //   const minMaxObject = {};
  //   minMaxObject.min = Math.min(...tagCounterList);
  //   minMaxObject.max = Math.max(...tagCounterList);

  //   return minMaxObject;
  // };

  const calculateTagsParams = function(tags){
    const params = {max: 0, min: 999999};
    for(let tag in tags){
      // console.log(tag + ' is used ' + tags[tag] + ' times');
      if(tags[tag] > params.max){
        params.max = tags[tag];
      }
      if(tags[tag] < params.min){
        params.min = tags[tag];
      }
    }
    return params;
  };

  const calculateTagClass = function(count, params){
    const classNumber = Math.floor(((count - params.min) / (params.max - params.min)) * (opts.cloudClassCount - 1) + 1);
    return opts.cloudClassPrefix + classNumber;
  };

  const generateTags = function(){
    /* [NEW] create a new variable allTags with an empty array */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll(opts.articleSelector);

    /* START LOOP: for every article: */
    for(let article of articles) {

      /* find tags wrapper */
      const tagsWrapper = article.querySelector(opts.articleTagsSelector);
      tagsWrapper.innerHTML = '';

      /* make html variable with empty string */
      let html = '';

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');

      /* START LOOP: for each tag */
      for(let tag of articleTagsArray){

        /* generate HTML of the link */
        // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

        const linkHTMLData = {tagName: tag};
        const linkHTML = templates.tagLink(linkHTMLData);

        /* add generated code to html variable */
        html = html + linkHTML;

        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]){
          /* [NEW] add generated code to allTags array */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }

        /* END LOOP: for each tag */
      }

      /* insert HTML of all the links into the tags wrapper */
      tagsWrapper.innerHTML = html;

      /* END LOOP: for every article: */
    }

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opts.tagsListSelector);

    const tagsParams = calculateTagsParams(allTags);
    // console.log('tagsParams:', tagsParams);

    /* [NEW] create variable for all links HTML code */
    // let allTagsHTML = '';
    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      // const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li>';
      // allTagsHTML += tagLinkHTML;
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      });
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    // tagList.innerHTML = allTagsHTML;
    // console.log(allTagsData);
    tagList.innerHTML = templates.tagCloudLink(allTagsData);

  };

  generateTags();

  const tagClickHandler = function(event){
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for(let activeTagLink of activeTagLinks){

      /* remove class active */
      activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */
    }

    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */
    for(let tagLink of tagLinks){

      /* add class active */
      tagLink.classList.add('active');

      /* END LOOP: for each found tag link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function(){
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

    /* START LOOP: for each link */
    for(let tagLink of tagLinks){

      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();

  const generateAuthors = function(){
    let allAuthors = {};

    /* find all articles */
    const articles = document.querySelectorAll(opts.articleSelector);

    /* START LOOP: for every article: */
    for(let article of articles) {

      /* find author wrapper */
      const authorWrapper = article.querySelector(opts.articleAuthorSelector);
      authorWrapper.innerHTML = '';

      /* get author from data-author attribute */
      const articleAuthor = article.getAttribute('data-author');
      const articleAuthorID = articleAuthor.replace(' ', '-');

      /* generate HTML of the link */
      // const linkHTML = '<a href="#author-' + articleAuthorID + '"><span class="author-name">by ' + articleAuthor + '</span></a>';

      const linkHTMLData = {id: articleAuthorID, authorName: articleAuthor};
      const linkHTML = templates.authorLink(linkHTMLData);

      /* insert HTML of the link into the author wrapper */
      authorWrapper.innerHTML = linkHTML;

      if(!allAuthors[articleAuthor]){
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }

      /* END LOOP: for every article: */
    }
    console.log(allAuthors);

    const authorsList = document.querySelector(opts.authorsListSelector);

    // let allAuthorsHTML = '';
    const allAuthorsData = {authors: []};

    for(let author in allAuthors){
      const authorID = author.replace(' ', '-');

      allAuthorsData.authors.push({
        authorName: author,
        id: authorID,
        count: allAuthors[author],
      });

      // const authorLinkHTML = '<li><a href="#author-' + authorID + '">' + author + '</a> (' + allAuthors[author] +') </li>';
      // allAuthorsHTML += authorLinkHTML;
    }

    // authorsList.innerHTML = allAuthorsHTML;
    authorsList.innerHTML = templates.authorSideLink(allAuthorsData);
  };

  generateAuthors();

  const authorClickHandler = function(event){
    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "author" and extract author from the "href" constant */
    const articleAuthorID = href.replace('#author-', '');
    const author = articleAuthorID.replace('-', ' ');

    /* find all author links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

    /* START LOOP: for each active author link */
    for(let activeAuthorLink of activeAuthorLinks){

      /* remove class active */
      activeAuthorLink.classList.remove('active');

    /* END LOOP: for each active author link */
    }

    /* find all author links with "href" attribute equal to the "href" constant */
    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found author link */
    for(let authorLink of authorLinks){
      /* add class active */

      authorLink.classList.add('active');
      /* END LOOP: for each found author link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const authorClickListenersToTags = function(){
    /* find all links to authors */
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');

    /* START LOOP: for each link */
    for(let authorLink of authorLinks){

      /* add tagClickHandler as event listener for that link */
      authorLink.addEventListener('click', authorClickHandler);

      /* END LOOP: for each link */
    }
  };

  authorClickListenersToTags();
}


