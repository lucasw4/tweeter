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
        <span class="date">${timeago.format(tweetObj["created_at"])}</span>
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

  // GET request from /tweets url
  const loadTweets = function () {
    $.get("/tweets", function (data) {
      renderTweets(data);
    });
  };

  // Retreives last element from array and calls renderSpecificTweet on it. Made to render a new tweet on form submission.
  const newTweetLoader = function () {
    $.get("/tweets", function (data) {
      const lastElement = data.slice(-1)[0];
      renderSpecificTweet(lastElement);
      $(`#tweet-text`).val("");
      $("output.counter").val(140);
    });
  };

  loadTweets();

  // Loops over each object of tweets and renders them to the webpage using createTweetElement
  const renderTweets = function (data) {
    data.forEach((object) => {
      const tweet = createTweetElement(object);
      $(".display-tweet").append(tweet);
    });
  };

  // Renders specific tweet on form submission without looping through all the tweets
  const renderSpecificTweet = function (tweet) {
    $(".display-tweet").prepend(createTweetElement(tweet));
  };

  // POST request sends data from textarea on form submission
  $("form").submit(() => {
    window.event.preventDefault();
    if ($(`#tweet-text`).val() === "") {
      alert("Your tweet must not be empty!");
    } else if ($("#tweet-text").val().length > 140) {
      alert("Your tweet must not be longer than 140 characters!");
    } else {
      const data = $("#tweet-text").serialize();
      $.post("/tweets", data).then(newTweetLoader);
    }
  });
});
