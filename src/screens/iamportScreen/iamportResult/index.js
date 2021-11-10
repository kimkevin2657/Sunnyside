import React from 'react';
import { View, Text, StyleSheet,SafeAreaView,TouchableOpacity,BackHandler } from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import { commonApi } from '@common/ApiConnector';


class iamportResult extends React.PureComponent {
    constructor(props) {
        super(props);
        this.resultData = this.props.navigation.getParam('resultData');
        this.certData = this.props.navigation.getParam('certData');
        console.log(this.resultData)
        console.log(this.certData)
        
    };

    async validationCheck() {
        console.log('validation')
        console.log(this.resultData);
        console.log(this.certData.imp_uid);
        console.log('validation')
// {"error_code": null, "error_msg": null, "imp_uid": "imp_269181001787", "merchant_uid": "mid_1624366179233", "pg_provider": "danal", "pg_type": "certification", "success": true}
        const params = {
            imp_uid : this.certData.imp_uid, //imp_619801221355
            merchant_uid : this.certData.merchant_uid, //mid_1624258800604
            success : this.certData.success, // true
            process : this.resultData.certData.process, // signUp (회원가입 휴대폰인증), userCert(본인인증)
            error_code : this.certData.error_code,
            error_msg : this.certData.error_msg,
            pg_provider : this.certData.pg_provider,
            pg_type : this.certData.pg_type
        }
        const signinParam = {
            mb_id : this.resultData.certData.mbId, // dkkim@upchain.kr
            mb_password : this.resultData.certData.mbPassword, // 1qaz2wsx#EDC
            mb_Name : this.resultData.certData.mbName, // 김동균
            mb_trade_password : "1111",
            mb_cf_code : this.resultData.certData.mbCfCode, // "" (추천인코드 공백가능)
            mb_marketing_use_yn : this.resultData.certData.mbMarketingUseYn, // Y
        }

        console.log('danalParam ::::', params)
        console.log('signParam ::::', signinParam)

        const rs = commonApi('post', '/member/open/securityProcDanalHistory',params)
        console.log('params ::::', params)
        rs.then((result) => {
                console.log('result:', result)
                console.log("cert ok")
                //인증성공
                if (params.success == true){
                    //인증내용이 회원가입일 경우
                    if (params.process == "signUp" ) {
                    const signinResult = commonApi('put', 'auth/open/addUser', signinParam)
                    .then((result) => {
                    console.log("add user result:::",result)
                    SimpleToast.show('confirm phone certification.\nplease check your email.', SimpleToast.SHORT)
                    this.props.navigation.navigate('GmcLoginScreen')
                    }).catch((error) => {
                    console.log('sign in error', error)
                    SimpleToast.show('certification fail. please try again.', SimpleToast.SHORT)
                    this.props.navigation.goBack()
                    }) 
                    } else if (params.process == "findId") {
                        //아이디 찾기일 경우
                        console.log('findID', this.resultData  )
                        this.props.navigation.navigate('FindUserIdComplet',{resultData: this.resultData})
                    } else if (params.process == "findPw") {
                        //비밀번호 찾기 일 경우

                        console.log("find pw parammmm::",this.resultData)
                        console.log("find pw parammmm::",this.resultData.certData.mbId)
                        let findPwParam = {
                            mb_id : this.resultData.certData.mbEmail
                        }
                        const findPasswordResult = commonApi('post', 'member/open/passwordSend', findPwParam)
                    .then((result) => {
                    console.log("find pw result:::",result)
                    // SimpleToast.show('temp password was send to your email.\nplease check your email.', SimpleToast.SHORT)
                    this.props.navigation.navigate('FindUserPwComplet',{resultData: this.resultData.certData.mbEmail})
                    }).catch((error) => {
                    console.log('find pw error', error)
                    SimpleToast.show('certification fail. try again.', SimpleToast.SHORT)
                    this.props.navigation.navigate('GmcLoginScreen')
                    }) 

                    } else if (params.process == "updateInfo") {
                        //회원정보 변경 일 경우
                        SimpleToast.show('Member information has been changed. Please log in again.', SimpleToast.SHORT)
                        this.props.navigation.navigate('GmcLoginScreen')
                    } else {
                        //단순 본인인증일 경우
                        SimpleToast.show('confirm user certification.', SimpleToast.SHORT)
                        this.props.navigation.navigate('DepositMain')
                    }
                } else {
                    console.log('sign in error', error)
                    SimpleToast.show('certification fail. please try again.', SimpleToast.SHORT)
                    this.props.navigation.goBack()
                }
                
            })
            .catch((error) => {
                console.log('error', error)
                SimpleToast.show('certification fail. please try again.', SimpleToast.SHORT)
                this.props.navigation.goBack()
            })
    }

    // moveDetailOrder() {
    //     const productType = this.order?.productType;
    //     this.props.navigation.navigate('Profile');
    //     if (productType == 'GENERAL') {
    //         this.props.navigation.push('ProductOrderHistory');
    //     }
    //     if (productType == 'TICKET') {
    //         this.props.navigation.push('TicketOrderHistory');
    //     }
    //     if (productType == 'SUBSCRIPTION') {
    //         this.props.navigation.navigate('Subscription');
    //     }
    // }

    componentDidMount() {
        this.validationCheck();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);


    }

    handleBackPress() {
        console.log("block back button");
        return true;
    }


    render() {
        console.log('resultData:::', this.resultData);

        // this.validationCheck();

        // 결제정보
        // const labelData = [
        //     { lable: '상품가격', value: `${Util.setCommaPrice(this.order.originPrice || 0)}원` },
        //     { lable: '사용포인트', value: `-${Util.setCommaPrice(this.order.usedPoint || 0)}원` }
        // ];
        // const totalData = {
        //     totalTitle: '총 결제금액',
        //     totalContent: `${Util.setCommaPrice(this.data.amount || 0)}원`
        // };
        return (
            <>
            <Text > </Text>
            </>
        );
    };
};


export default iamportResult;