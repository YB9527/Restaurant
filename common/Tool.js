



//检查是否数据
var checkIsDouble = function (value) {
  var patrn = /^(-)?\d+(\.\d+)?$/;
  return !(patrn.exec(value) == null);
};

function number_format(number, decimals, dec_point, thousands_sep) {

  if (number == 0 || number == 0.00) {
    return 0;
  }
  /*
  * 参数说明：
  * number：要格式化的数字
  * decimals：保留几位小数
  * dec_point：小数点符号
  * thousands_sep：千分位符号
  * */
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {

      return parseFloat(n).toFixed(prec);
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


exports.number_format = number_format;

//金额符号
function moneySymbol(money, bit) {
  if (!money) {
    return money;
  }
  if (bit !== undefined) {
    return number_format(money, bit, '.', ',');
  } else {
    let lastpointindex = (money + "").indexOf(".");
    if (lastpointindex > 0) {
      return number_format(money, (money + "").length - lastpointindex - 1, '.', ',');
    } else {
      return number_format(money, 0, '.', ',');
    }
  }
}

exports.moneySymbol = moneySymbol;


//通过属性来分组
var groupByAttribute = function (array, attribute) {
  let map = {};
  if (array) {
    for (let item of array) {
      let key = item[attribute];
      let group = map[key];
      if (group) {
        group.push(item);
      } else {
        let list = [item];
        map[key] = list;
      }
    }
  }

  return map;
};
exports.groupByAttribute = groupByAttribute;

//通过属性来
var groupByAttributeSingle = function (array, attribute) {
  let map = {};
  if (array) {
    for (let item of array) {
      let key = item[attribute];
      map[key] = item;

    }
  }

  return map;
};
exports.groupByAttributeSingle = groupByAttributeSingle;

/**
 *文字小数 或者 小数 保留小数位数
 * @param value 计算的值
 * @param bit 保留的位数 ，如果没有就保留2位
 * @param defalut 结果异常时，返回的值
 * @returns {number}
 */
var toFixed = function (value, bit, defalut) {


  if (value) {
    value = parseFloat(value);
    if (value !== 0) {
      bit = bit === undefined ? 2 : bit;
      return parseFloat(value.toFixed(bit));
    }
  }
  return defalut ? defalut : 0;
};
exports.toFixed = toFixed;



var sumValue = function (v1, v2, bit) {
  let value = (v1.toFixed(bit)) * 1 + (v2.toFixed(bit)) * 1;
  return value.toFixed(2)*1;
};
exports.sumValue = sumValue;

/**
 * 计算总页数
 * @param total 总条数
 * @param pageSigle 每页显示个数
 * @returns {number}
 */
var computedPageTotal = function (total,pageSigle) {
  if(total <=0 || pageSigle<= 0){
    return 0;
  }
  let pageCount = total / pageSigle;
  if ((pageCount + "").indexOf(".") !== -1) {
    pageCount = parseInt(pageCount) + 1;
  }
  return pageCount;
};
exports.computedPageTotal = computedPageTotal;


var pushArray = function (base,datas) {
  if(datas && datas instanceof  Array){
    for (let data of datas){
      base.push(data);
    }
  }
};
exports.pushArray = pushArray;


var str2Date = function (strTime) {

  var  date = strTime.replace(/-/g,'/');
  var timestamp = new Date(date).getTime();
// 根据毫秒数构建 Date 对象
  return new Date(timestamp);

};
exports.str2Date = str2Date;

var date2Str = function (date) {
  if(! (date instanceof  Date)){
    return "";
  }
  var year = date.getFullYear(); //获取完整的年份(4位,1970-????)
  var month =date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
  var day = date.getDate(); //获取当前日(1-31)
  var dateString =  year + "-" + month + "-" + day;
  return dateString;
};
exports.date2Str = date2Str;

var dateTime2Str = function (date) {
  if(! (date instanceof  Date)){
    return "";
  }
  var year = date.getFullYear(); //获取完整的年份(4位,1970-????)
  var month =date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
  var day = date.getDate(); //获取当前日(1-31)
  let HH = date.getHours() ;
  let mm = date.getMinutes();
  let ss = date.getSeconds();
  var dateString =  year + "-" + month + "-" + day+" "+HH+":"+mm+":"+ss;
  return dateString;
};
exports.dateTime2Str = dateTime2Str;

var uuid =  function  () {
     var  s = [];
     var  hexDigits =  "0123456789abcdef" ;
     for  ( var  i = 0; i < 36; i++) {
         s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
     }
     s[14] =  "4" ;   // bits 12-15 of the time_hi_and_version field to 0010
     s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);   // bits 6-7 of the clock_seq_hi_and_reserved to 01
     s[8] = s[13] = s[18] = s[23] =  "-" ;
 
     var  uuid = s.join( "" );
     return  uuid;
}
exports.uuid = uuid;