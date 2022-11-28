function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' giây trước'; // ' seconds ago'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' phút trước'; // ' minutes ago'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' giờ trước'; // ' hours ago'
  } else if (elapsed < msPerMonth) {
    return 'khoảng ' + Math.round(elapsed / msPerDay) + ' ngày trước'; // 'approximately ' ' days ago'
  } else if (elapsed < msPerYear) {
    return 'khoảng ' + Math.round(elapsed / msPerMonth) + ' tháng trước'; // 'approximately ' ' months ago'
  } else {
    return 'khoảng ' + Math.round(elapsed / msPerYear) + ' năm trước'; // 'approximately ' ' years ago'
  }
}

export default timeDifference;
