export class HelpersUtils {
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description shuffle an array
   * @param {Array} a - the Array being shuffled
   * @returns  {Promise<Array>}
   */
  async shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description check if there dublicates in an array
   * @param {Array<object>} values - the Array being checked
   * @returns  {Promise<boolean>}
   */
  async checkDublicates(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (String(arr[i]._id) == String(arr[j]._id)) {
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Acknowledgment : This Function Is Inspired By 'https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site/23259289#23259289'
   */
  async dateSince(date) {
    if (typeof date !== 'object') {
      date = new Date(date);
    }
    let seconds = Math.floor((Date.now() - date) / 1000);
    let intervalType;
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      intervalType = 'yr';
    } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        intervalType = 'mon';
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          intervalType = 'day';
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            intervalType = 'h';
          } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              intervalType = 'min';
            } else {
              interval = seconds;
              intervalType = 'sec';
            }
          }
        }
      }
    }

    if (interval > 1 || interval === 0) {
      intervalType += 's';
    }

    return `${interval} ${intervalType}`;
  }
  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @descriptionthis function add to array but this array has limit
   * @param {Array<Object>} arr -array of data
   * @param {Number} limit  - the limit should be
   * @param {Object} pushedData Data should add to array
   * @returns {Array<Object>} after delete
   */
  async addTolimitedArray(arr: Array<any>, limit: number, pushedData: {}) {
    if (arr.length >= limit) {
      arr.splice(0, 1);
    }
    arr.push(pushedData);
    return arr;
  }
}
