import axios from 'axios';
import { store } from '@redux/store';
import NavigationService from '@app/navigation/NavigationService';
import SimpleToast from 'react-native-simple-toast';


//ex) 
// const response = commonApi('post', `/shop/${idx}/follow`, params);
// response.then(res =>    ...)

// host 주소
const host = 'http://221.168.38.148:18080/api/v1';

export function getHost() {
    return host;
}

export async function commonApi(type, url, params) {

    var resultData;

    let commonConnector = axios.create({
        baseURL: host,
        timeout: 10000,
        method: type,
        headers: {
            Authorization: 'Bearer ' + store.getState().user.accessToken,
        },
    });

    if (type == 'get' || type == 'GET') {
        // get 호출
        await commonConnector
            .get(url, {
                params: {
                    ...params,
                },
            })
            .then((response) => {
                resultData = response.data;
            })
            .catch((error) => {
                console.log("get error", error)
                resultData = errorClassifier(error.response)
            });
    } else if (type == 'post' || type == 'POST') {
        // post 호출
        await commonConnector
            .post(url,null, {
                params,
            })
            .then((response) => {
                resultData = response.data;
            })
            .catch((error) => {
                console.log("post error url", url)
                console.log("post error", error)
                resultData = errorClassifier(error.response)
            });
    } else if (type == 'put' || type == 'PUT') {
        // put 호출
        await commonConnector
            .put(url,null,{
                params,
            })
            .then((response) => {
                resultData = response.data;
            })
            .catch((error) => {
                resultData = errorClassifier(error.response)
            });
    } else if (type == 'delete' || type == 'DELETE') {
        // delete 호출
        await commonConnector
            .delete(url, {
                params: {
                    ...params,
                },
            })
            .then((response) => {
                resultData = response.data;
            })
            .catch((error) => {
                resultData = errorClassifier(error.response)
            });
    } else if (type == 'patch' || type == 'PATCH') {
        // patch 호출
        await commonConnector
            .patch(url, {
                params: {
                    ...params,
                },
            })
            .then((response) => {
                console.log('@@',response);
                resultData = response.data;
            })
            .catch((error) => {
                resultData = errorClassifier(error.response)
            });
    }


    return resultDataChecker(resultData, type, url, params);
}

// 에러 분류기 : 에러 발생시 해당 에러를 파싱하여 string결과값으로 분류한다.
// 입력값 :   error.response
// 결과값 : 해당 에러 안내문구
function errorClassifier(error) {
    var errorResult = '';

    console.log('check api error for debuging : ', error)
    console.log(error.data.code)

    switch (error.status) {
        case 400:
            // 잘못된 요청
            errorResult = error.data.error;
            SimpleToast.show('server connection error. \nPlease Try later.', SimpleToast.SHORT)


            break;
        case 401:
            // 잘못된 인증
            if (error.data.code == '1101') {
                errorResult = 'expired token';
            }
            else if (error.data.code == '1106' || error.data.code == '1108') {
                errorResult = 'user idx not found';
            }
            else if (error.data.code == '1104') {
                errorResult = 'Login is required.';
            }
            else if (error.data.code == '1109') {
                errorResult = 'logout user request';
            }
            else if (error.data.code == '1112') {
                errorResult = 'duplicate seller signup request';
            } else {
                errorResult = 'undefined error'
            }

            break;
        case 402:
            // 미승인 요청
            errorResult = error.data.error;
            SimpleToast.show('서버 접속이 원활하지 않습니다. \n잠시 후 다시 시도해주세요.', SimpleToast.SHORT)
            break;
        case 403:
            // 요청 거부
            errorResult = error.data.error;
            SimpleToast.show('서버 접속이 원활하지 않습니다. \n잠시 후 다시 시도해주세요.', SimpleToast.SHORT)
            break;
        case 404:
            // 잘못된 요청 (컨텐츠 없음)
            errorResult = error.data.error;
            SimpleToast.show('서버 접속이 원활하지 않습니다. \n잠시 후 다시 시도해주세요.', SimpleToast.SHORT)
            break;
        case 408:
            // 응답시간 초과 (10sec)
            errorResult = error.data.error;
            SimpleToast.show('서버 접속이 원활하지 않습니다. \n잠시 후 다시 시도해주세요.', SimpleToast.SHORT)
            break;
        case 500:
            // 서버오류 발생
            errorResult = error.data.error;
            SimpleToast.show('서버 접속이 원활하지 않습니다. \n잠시 후 다시 시도해주세요.', SimpleToast.SHORT)

            break;
        case 501:
            // 서버 내 기능 미구현
            errorResult = error.data.error;
            SimpleToast.show('서버 접속이 원활하지 않습니다. \n잠시 후 다시 시도해주세요.', SimpleToast.SHORT)

            break;
        case 502:
            // 서버 내 잘못된 응답
            SimpleToast.show('서버 접속이 원활하지 않습니다. \n잠시 후 다시 시도해주세요.', SimpleToast.SHORT)
            errorResult = error.data.error;
            break;
        default:
            errorResult = error.status;
            break;
    }

    return errorResult;


}

function goLockScreen() {
    SimpleToast.show('Token Refresh was failed go to login.', SimpleToast.SHORT);
    NavigationService.navigate('GmcLoginScreen');
}

// 결과값 체커 : 통신결과값들 중 에러가 발생했을때 체크함.
// 입력값 :   resultData : 통신결과값
// 결과값 : 응답 객체
async function resultDataChecker(resultData, type, url, params) {

    // 만약 호출이 401에러가 발생하면 토큰 갱신 후 해당 요청을 재귀시킴.
    if (resultData == 'expired token') {

        // 무한재귀를 막는 스위치
        var isFinishRecursive = false;
        // 토큰 재발행 요청
        var authResult = await authApi();

        // 토큰 재발행 실패시 (리프레시 토큰이 만료된 경우)
        if (authResult == 'need update Token') {
           //토큰 갱신 실패시 (ex.리프레시 토큰의 만료 등) 로그인 화면으로 강제 이동
            NavigationService.navigate('GmcLoginScreen');
        }

        if (authResult == 'token update success') {
            isFinishRecursive = true
            resultData = 'ok'
        }

        //재발행 성공했을 경우
        if (isFinishRecursive == true) {

            //토큰 재발행이 끝나면 재귀시킴.
            await commonApi(type, url, params)
                .then((apiResult) => {
                    resultData = apiResult
                })
        }
    }

    //정상 데이터가 아니거나 알수없는 에러코드일 경우 로그인 화면으로 이동시킴.
    if (resultData === undefined || resultData == 'undefined error') {
        resultData = 'wrong token';
        NavigationService.navigate('GmcLoginScreen');
    }

    return resultData
}

//인증 api 커넥터 : 401에러 발생시 토큰을 재발급 한다.
//결과값 : 토큰발행 결과 정보 문자열
async function authApi() {

    var restResult;

    console.log("ref token", store.getState().user.refreshToken)

    commonConnector = axios.create({
        baseURL: host,
        timeout: 10000,
        method: 'get',
        headers: {
            Authorization: 'Bearer ' + store.getState().user.refreshToken,
        },
    });

    //리프레시 토큰으로 엑세스 토큰을 받는다.
    await commonConnector
        .get('auth/open/getAccessToken')
        .then((response) => {

            console.log("authApi result", response)

            //통신에 성공하여 200 status를 받았지만, api서버의 결과가 false일 경우 토큰만료로 판정함.
            //그러므로 api서버의 결과가 true일 경우에만 토큰 재발급. 아닐 경우 재로그인 필요.
            if (response.data.success == true) {
                //결과(api token)을 store.user에 할당
                store.getState().user.accessToken = response.data.data.accessToken;

                //store에 저장한다.
                store.dispatch({
                    type: 'SET_USER',
                    payload: store.getState().user,
                });

                //성공했음을 리턴
                restResult = 'token update success'
            } else {
                //토큰의 재발행이 필요함을 리턴
                restResult = 'need update Token'
            }
        })
        .catch((error) => {
            //토큰 갱신 실패시 (ex.리프레시 토큰의 만료 등) 로그인 화면으로 강제 이동
            SimpleToast.show('Token Refresh was failed go to login', SimpleToast.SHORT);
            store.dispatch({
                type: 'CLEAR_USER',
                payload: store.getState().user,
            });

            NavigationService.navigate('GmcLoginScreen');
        });

    return restResult;
}

// 외부 api 커넥터 : 택배조회 등 외부 서비스에 요청시 사용한다.
// 입력값 :   type : 요청 타입
//          baseUrl : 요청 url 도메인
//          url : 요청 url
//          params : 요청 파라미터
// 결과값 : 응답 객체
// export async function externalApi(type, baseUrl, url, params) {

//     var resultData;

//     commonConnector = axios.create({
//         baseURL: baseUrl,
//         timeout: 10000,
//         method: type,
//     });

//     if (type == 'get' || type == 'GET') {
//         // get 호출
//         await commonConnector
//             .get(url, {
//                 params: params
//             })
//             .then((response) => {
//                 resultData = response;
//             })
//             .catch((error) => {
//                 resultData = errorClassifier(error.response)
//             });
//     } else if (type == 'post' || type == 'POST') {
//         // post 호출
//         await commonConnector
//             .post(url,
//                 params
//             )
//             .then((response) => {
//                 resultData = response.data;
//             })
//             .catch((error) => {
//                 resultData = errorClassifier(error.response)
//             });
//     }

//     return resultData;
// }

// //카카오 api 커넥터
// // 입력값 :   type : 요청 타입
// //          url : 요청 url
// //          params : 요청 파라미터
// // 결과값 : 응답 객체
// export async function kakaoApi(type, url, params) {

//     var resultData;

//     commonConnector = axios.create({
//         baseURL: 'https://kapi.kakao.com/v1/',
//         timeout: 10000,
//         method: type,
//         headers: {
//             Authorization: 'Bearer ' + store.getState().user.kakaoAccessToken,
//         },
//     });

//     if (type == 'get' || type == 'GET') {
//         // get 호출
//         await commonConnector
//             .get(url, {
//                 params: params
//             })
//             .then((response) => {
//                 resultData = response;
//             })
//             .catch((error) => {
//                 resultData = errorClassifier(error.response)
//             });
//     } else if (type == 'post' || type == 'POST') {
//         // post 호출
//         await commonConnector
//             .post(url,
//                 params
//             )
//             .then((response) => {
//                 resultData = response.data;
//             })
//             .catch((error) => {
//                 resultData = errorClassifier(error.response)
//             });
//     }

//     return resultData;
// }

// export async function fileUploadApi(type, url, formData) {

//     var resultData;

//     commonConnector = axios.create({
//         baseURL: host,
//         timeout: 10000,
//         method: type,
//         headers: {
//             Authorization: 'Bearer ' + store.getState().user.goodchAccessToken,
//         },
//     });

//     if (type == 'post' || type == 'POST') {
//         await commonConnector
//             .post(url, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             })
//             .then((response) => {
//                 resultData = response.data;
//             })
//             .catch((error) => {
//                 resultData = errorClassifier(error.response)
//             });
//     } else if (type == 'put' || type == 'PUT') {
//         await commonConnector
//             .put(url, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             })
//             .then((response) => {
//                 resultData = response.data;
//             })
//             .catch((error) => {
//                 resultData = errorClassifier(error.response)
//             });
//     }

//     return resultDataChecker(resultData, type, url, formData);
// }
