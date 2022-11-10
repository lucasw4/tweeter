$(document).ready(function () {
  $("#tweet-text").on("input", function () {
    const max = 140;
    const inputNum = $(this).val().length;
    let countingNum = max - inputNum;

    const $counter = $(this).parent().find(".counter");
    $counter.text(countingNum);

    if (countingNum < 0) {
      $($counter).addClass("below-limit");
    } else {
      $($counter).removeClass("below-limit");
    }
  });
});
