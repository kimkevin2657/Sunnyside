import React from 'react';
/* 아임포트 모듈을 불러옵니다. */
import IMP from 'iamport-react-native';
/* 로딩 컴포넌트를 불러옵니다. */
import Loading from '../iamportLoading';
import SimpleToast from 'react-native-simple-toast';

class iamportMain extends React.PureComponent {
    constructor(props) {
        super(props);
        this.certData = this.props.navigation.getParam('certData');

        console.log("12321333123131",this.certData)
        this.state = {
            certData : this.certData,
            response : {}
        }
    };


 callBack = (response) => {
        console.log('response',response);
        this.props.navigation.replace('IamportResult',{resultData : this.state, certData : response });
        
        // if (response.success == true) {
        //     this.props.navigation.replace('iamportResult',{resultData : this.state});
        // } else {
        //     SimpleToast.show('인증에 실패 하였습니다. 다시 시도 해 주세요.', SimpleToast.SHORT)
        //     this.props.navigation.goBack()
        // }

        
 }




    render() {

        /* [필수입력] 본인인증에 필요한 데이터를 입력합니다. */
  const data = {
    merchant_uid: `mid_${new Date().getTime()}`,
    // company: 'GMCLABS',
    carrier: this.certData.carrierCode,
    name: this.certData.mbName,
    phone: this.certData.mbPhone,
    min_age: '',
  };

        return (
            <>
                <IMP.Certification
      userCode={'imp30018661'}  // 가맹점 식별코드
    //   tierCode={'ABC'}      // 티어 코드: agency 기능 사용자에 한함
      loading={<Loading />} // 웹뷰 로딩 컴포넌트
      data={data}           // 본인인증 데이터
      callback={response => this.callBack(response)}
    //   callback={response => this.props.navigation.replace('PaymentComplete', { response, data, order })}   // 본인인증 종료 후 콜백
    />
            </>
        );
    }

}
export default iamportMain;