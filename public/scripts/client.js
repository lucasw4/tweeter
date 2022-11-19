/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Escape function to prevent malicious code from being executed
const escapeFn = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

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
          ${escapeFn(tweetObj.content["text"])}
        </p>
      </div>
      <footer class="tweet-footer">
        <span class="date">${timeago.format(tweetObj["created_at"])}</span>
        <div class="icons">
          <a href=""><i class="fa-solid fa-flag"></i></a>
          <div class="space"></div>
          <a href=""><i class="fa-solid fa-retweet"></i></a>
          <div class="space"></div>
          <a href=""><i class="fa-solid fa-heart"></i></a>
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

  // CSS for error-div hidden by default to prevent it showing for a split second while jquery loads, hide the div with jquery and then make it visible again
  $(".error-div").hide();
  $(".error-div").css("visibility", "visible");
  $(".new-tweet").hide();
  $(".new-tweet").css("visibility", "visible");
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

  const displayTweetForm = function () {
    $(".new-tweet").slideToggle(500, () => {
      $("#tweet-text").focus();
    });
  };

  // Nav button created, when clicks slides the new-tweet form either up or down and then focuses it.
  $(".compose-tweet-btn").on("click", () => {
    displayTweetForm();
  });

  // When button clicked, scroll to top and display tweet form
  $(".footer-to-top").on("click", () => {
    $(window).scrollTop(0);
    displayTweetForm();
  });

  // Makes button only appear when position of screen is > 100px from the top
  $(window).scroll(() => {
    $(".footer-to-top").toggleClass("scrolled", $(this).scrollTop() > 100);
  });

  // Checks to see if tweet content is empty, or over character limit and renders an error to webpage, otherwise sends POST request with the data to /tweets
  const validateTweet = function () {
    if ($(`#tweet-text`).val() === "") {
      $(".error-div").text("Sorry, but your tweet can't be empty.").slideDown();
    } else if ($("#tweet-text").val().length > 140) {
      $(".error-div")
        .text("Your tweet can't exceed 140 characters")
        .slideDown();
    } else {
      $(".error-div").slideUp();
      const data = $("#tweet-text").serialize();
      $.post("/tweets", data).then(newTweetLoader);
    }
  };

  // POST request sends data from textarea on form submission
  $("form").submit(() => {
    window.event.preventDefault();
    if ($(".error-div").text() !== "") {
      $(".error-div").slideUp(500, function () {
        validateTweet();
      });
    } else {
      validateTweet();
    }
  });
});
