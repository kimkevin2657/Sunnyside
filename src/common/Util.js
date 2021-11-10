export default {
    isValidEmail: (address) => {
        let reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(address);
    },
    currencyValue: (value) => {
        return Number(value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    },
    // 콤마(,)표기 원화
    currency: (val, cipher) => {
        let number = String(val).replace(/,/g, ""), strSymbol = '', result = '';
        if (number.indexOf('.') !== -1) number = number.split('.')[0];
        if (Number(number) < 0) {
            strSymbol = '-';
            number = String(Math.abs(number));
        }
        cipher = (cipher) ? cipher : 3;
        let len = number.length, nIndex = len % cipher, nMax = len - cipher + 1;
        nIndex = (nIndex === 0) ? cipher : nIndex;
        if (len <= cipher || cipher < 1) return String(val).replace(/,/g, "");
        result = number.substring(0, nIndex);
        while (nIndex <= nMax) {
            result += ',' + number.substring(nIndex, nIndex + 3);
            nIndex += cipher;
        }
        if (String(val).indexOf('.') !== -1) result += ('.' + String(val).split('.')[1]);
        if (result.substring(0, 2) == '0,') {
            result = '0.' + result.substring(2, result.length)
        }
        return strSymbol + result;
    },
//소수점 8자리 초과 버림
    decimalPointEight : (value) => {
        var values;
        if (String(value).split('.').length > 1) {
            values = String(value).split('.');
            if (values[1].length > 8) {
                values = `${values[0]}.${values[1].substring(0, 8)}`
                return Number(values)
            } else {
                values = `${values[0]}.${values[1]}`
                return Number(values)
            }
        } else {
            return value
        }

    },

    decimalPoint :(value, legnth) => {
        var values;
        if (String(value).split('.').length > 1) {
            values = String(value).split('.');
            if (values[1].length > legnth ? legnth : 8) {
                values = `${values[0]}.${values[1].substring(0, legnth ? legnth : 8)}`
                return values
            } else {
                values = `${values[0]}.${values[1]}`
                return values
            }
        } else {
            return value
        }

    },
    // 비밀번호 유효성검사(영문대소문자, 숫자, 특수문자 혼합 8-15자리)
    passwordTest2 : (pw) => {
        let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
        return reg.test(pw);
    },
    isValidCreditCard: (value) => {
        value = value.toString().replace(/ /g, '');
        if (value === '') return false;
        if (isNaN(value)) return false;
        var nCheck = 0,
            nDigit = 0,
            bEven = false;
        value = value.replace(/\D/g, '');
        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n);
            nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9) {
                    nDigit -= 9;
                }
            }
            nCheck += nDigit;
            bEven = !bEven;
        }
        return nCheck % 10 === 0;
    },
    isValidExpirationDate: (value) => {
        if (value.length !== 7) return false;
        value = value.split(' / ');
        if (value[0] > 12) return false;
        if (value[1] < new Date().getFullYear().toString().substr(-2)) return false;
        return true;
    },
    isValidCVC: (value) => {
        if (value.length === 3 || value.length === 4) return true;
        return false;
    },
    getRandomArrayElement: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },
    makeRandomString: (length) => {
        let result = '';
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length),
            );
        }
        return result;
    },
    //글자자르기
    textSubstring: (text, length) => {
        let result = text;
        if (result?.length > length) {
            result = result.substring(0, length) + '...';
        }
        return result;
    },
    //해시태그 리스트 스트링변환 후 ... 처리
    hashtagtoStrting: (array, textLength, startIndex) => {
        let str = '';
        for (let i = startIndex != undefined ? startIndex : 0; i < array?.length; i++) {
            str += '#' + array[i].tagName + "";

        }
        if (str.length > textLength) {
            str = str.substring(0, textLength) + '..';
        }
        return str;
    },
    //+-추가 콤마 원화 표기
    setSignCommaPrice: (price) => {
        let result = Math.round(price)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (result.substring(0, 1) != '-') {
            result = '+' + result;
        }
        return result;
    },
    //콤마 원화 표기
    setCommaPrice: (price) =>
        Math.round(price)?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    //폰번호 체크
    phoneCheck: phone => /\d{10,11}/.test(phone),

    //휴대폰번호 자동 하이픈 
    autoHypenPhone: (str) => {
        var tmp = '';
        str = str.replace(/[^0-9]/g, '');
        if (str.length < 4) {
            return str;
        } else if (str.length < 7) {
            tmp += str.substr(0, 3);
            tmp += '-';
            tmp += str.substr(3);
            return tmp;
        } else if (str.length < 11) {
            tmp += str.substr(0, 3);
            tmp += '-';
            tmp += str.substr(3, 3);
            tmp += '-';
            tmp += str.substr(6);
            return tmp;
        } else {
            tmp += str.substr(0, 3);
            tmp += '-';
            tmp += str.substr(3, 4);
            tmp += '-';
            tmp += str.substr(7);
            return tmp;
        }
        return str;
    },
    //우편번호 체크
    postNumberCheck: postNumber => /\d{5,6}/.test(postNumber),
};
