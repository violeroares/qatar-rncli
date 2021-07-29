export function getParsedDate(strDate) {
  var strSplitDate = String(strDate).split(' ');
  var date = new Date(strSplitDate[0]);
  // alert(date);
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!

  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  date = dd + '-' + mm + '-' + yyyy;
  return date.toString();
}

export function getParsedDateAndTime(strDate) {
  var strSplitDate = String(strDate).split(' ');
  var date = new Date(strSplitDate[0]);
  // alert(date);
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!

  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var hh = date.getHours();
  if (hh < 10) {
    hh = '0' + hh;
  }

  var min = date.getMinutes();
  if (min < 10) {
    min = '0' + min;
  }
  date = dd + '-' + mm + '-' + yyyy + ' ' + hh + ':' + min +"h";
  return date.toString();
}

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function validateNumber(text) {
  const re = /^\d*\.?\d*$/;
  return re.test(text);
}