dateSince = function (date) {
  if (typeof date !== "object") {
    date = new Date(date);
  }
  let seconds = Math.floor((Date.now() - date) / 1000);
  let intervalType;
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = "yr";
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = "mon";
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = "day";
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "h";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "min";
          } else {
            interval = seconds;
            intervalType = "sec";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += "s";
  }

  return interval + " " + intervalType;
};
delay = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
