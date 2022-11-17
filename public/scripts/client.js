/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {
  // Returns a jquery object containing tweet data
  const createTweetElement = function (tweetObj) {
    const $tweet = $(`<article>
      <header class="tweet-list">
        <img class="tweet-avatar" src=${tweetObj.user["avatars"]} />
        <h4 class="user-name">${tweetObj.user["name"]}</h4>
        <h4 class="user-handle">${tweetObj.user["handle"]}</h4>
      </header>
      <div class="tweet-details">
        <p>
          ${tweetObj.content["text"]}
        </p>
      </div>
      <footer class="tweet-footer">
        <span class="date">${tweetObj["created_at"]}</span>
        <div class="icons">
          <a href="www.google.com"><i class="fa-solid fa-flag"></i></a>
          <div class="space"></div>
          <a href="www.google.com"><i class="fa-solid fa-retweet"></i></a>
          <div class="space"></div>
          <a href="www.google.com"><i class="fa-solid fa-heart"></i></a>
          <div class="space"></div>
        </div>
      </footer>
    </article>`);
    return $tweet;
  };

  // Loops over each object of tweets and renders them to the webpage using createTweetElement
  const renderTweets = function (data) {
    data.forEach((object) => {
      const tweet = createTweetElement(object);
      $(".display-tweet").append(tweet);
    });
  };
  renderTweets(tweetData);
});
