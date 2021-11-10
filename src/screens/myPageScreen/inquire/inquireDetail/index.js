import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    Platform,
    TouchableOpacity,
    ScrollView,
    TextInput,
    BackHandler,
    Alert,
    Image
} from 'react-native';
import { Color } from '@common';
import { store } from '@redux/store';
import { commonApi, getHost, fileUploadApi } from '@common/ApiConnector';
import CheckBox from '@react-native-community/checkbox';
import RectangleButton from '../../../../components/_gmcCustom/RectangleButton';
import BottomTab from '../../../../components/_gmcCustom/BottomTab';
import HeaderBar from '../../../../components/_gmcCustom/HeaderBar';
import SimpleToast from 'react-native-simple-toast';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
class InquiryDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.imgTempNameList = []
        this.imgTempPathList = []

        this.state={
            inquireTitle: '',
            inquireContent: '',
            fileName:"",
            imgPathList: [],
            imgNameList: [],
            qnaInfo: {},
            cameraList: [],
            isChecked: false,
            pickerOpen: false,
            isModify:false,
            selectedCategory: '',
            modifySelectedCategory: '',
            categoryList: [
            { label: 'Deposit Inquiry', value: 'CA20'},
            { label: 'Wallet Inquiry', value: 'CA21'},
            { label: 'Other Inquiries', value: 'CA22'}
            ],
            replyList: [],
            imgList:[],
            inquireIdx: this.props.navigation.getParam('inquireIdx', '')
        }
    }


    uploadAlert = () => {
        const options = {
            mediaType: 'photo',
            // selectionLimit: 5,
            // quality:5

        }
        this.addImageLibary(options)
    }
    addImageLibary = (options) => {
        this.setState({
            cameraList: [],
            fileName:""
        })
        console.log('???')
        ImagePicker.openPicker({
            multiple: true,
            mediaType:'photo',
        }).then(images => {
            var temp = []
            console.log(images,'123')
            var fileName= ""
            if (images.length > 0) {
                if (Platform.OS == 'ios') {
                    console.log(images, 'IOS')
                    fileName = images[0].filename
                    images.map((img, idx) => {
                        temp.push(img.sourceURL)
                    })
                }
                if (Platform.OS == "android") {
                    if (images.length > 5) {
                        SimpleToast.show('The maximum number of files is five.',SimpleToast.SHORT)
                    } else {
                        fileName = images[0].path.split('/').pop()
                        images.map((img, idx) => {
                            temp.push(img.path)
                        })
                    }
                }
            }
            this.setState({
                cameraList: temp,
                fileName: fileName
            })
            }
        )
    }
    modifyQna = () => {
        this.setState({
            isModify: true,
        })
        this.setState({
            inquireTitle: this.state.qnaInfo.bq_title,
            inquireContent: this.state.qnaInfo.bq_contents,
        })
    }
    deleteQna = () => {
        const params = {
            "bq_idx": String(this.state.inquireIdx)
        };
        const response = commonApi('post', '/board/qnaBoardDelete', params);
        response.then((result ) => {
            if (result.success) {
                console.log(result)
                this.props.navigation.replace('InquireMain')
            } else {
                SimpleToast.show(result.message, SimpleToast.SHORT)
            }
        })
            .catch(e => {
                console.log(e)
            });
    }
    deleteQnaAlert = () => {
        Alert.alert(
            "are you sure delete inquiry?",
            "",
            [
                {
                    text: "cancel",
                    onPress: () => console.log("conso")
                },
                {
                    text: "confirm",
                    onPress: () => this.deleteQna()
                },
            ]
        );
       
    }
    getQnaDetail() {
        let param = { bq_idx: this.state.inquireIdx }
        const response = commonApi('post', `/board/qnaDetailInfo`, param);
        response.then((res) => {
            if(res.success) {
                this.setState({
                    qnaInfo: res.data.result,
                    imgList : res.data.fileList
                })
                console.log(res.data,'data')
                this.state.categoryList.map((category) => {
                    if (res.data.result.bq_category == category.value) {
                        this.setState({
                            selectedCategory : category
                        })
                    }
                })
                if (res.data.result.bq_category)
                if (res.data.Replylist != null) {
                    this.setState({
                        replyList: res.data.Replylist
                    })
                }
            } else {
                SimpleToast.show(res.message, SimpleToast.SHORT)
            }
        }).catch(e => {
            console.log('error:: ',e);
        })
    }

    componentDidMount() {
        this.setState({
            selectedCategory: this.state.categoryList[0]
        })
        if(this.state.inquireIdx != '') {
            this.getQnaDetail();
        }
    }
    delay(value,ths) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var imgTempPath = ''
                var imgTempName = ''
                const formData = new FormData();
                formData.append("userfiles", {
                    name: value,
                    uri: value.replace('file://', Platform.OS === 'android' ? 'file://' : ''),
                    type: value.endsWith('jpg') ? 'image/jpeg' : 'image/png',
                });
                console.log(formData,'123123')
                const formResult = fileUploadApi('post','/board/qnaBoardImageInsert', formData, {
                }).then((res) => {
                    console.log(res.data.s3path, '222')
                    imgTempPath = ("\"" + res.data.s3path + "\"");
                    // console.log(this.imgTempPathList,'12312312')
                    ths.imgTempPathList.push(imgTempPath)
                    ths.setState({
                        imgPathList: imgTempPath
                    })
                    imgTempName = ("\"" + res.data.s3path.replace("client/tempFile/", "") + "\"");
                    ths.imgTempNameList.push(imgTempName)
                    ths.setState({
                        imgNameList: imgTempName
                    })
                    resolve();
                }).catch((e) => console.log(e,'err'))
            }, 500)
        })
    }

    async onPressInquire(imageList) {
        console.log(imageList,'imgageList')
        for (let i = 0; i < imageList.length; i++) {
            await this.delay(imageList[i],this);
        }
        if (this.state.inquireTitle == '') {
            SimpleToast.show('Please enter title.', SimpleToast.SHORT)
        } else if (this.state.inquireContent == '') {
            SimpleToast.show('Please enter contents.', SimpleToast.SHORT)
        } else {
            if (this.state.isModify) {
                const params = {
                    "bq_idx": String(this.state.inquireIdx),
                    "bq_category": this.state.selectedCategory.value,
                    "bq_title": this.state.inquireTitle,
                    "bq_contents": this.state.inquireContent,
                    "bq_filePath": this.state.imgPathList.length > 0 ? encodeURIComponent("[" + this.state.imgPathList + "]") : encodeURIComponent("[]"),
                    "bq_fileName": this.state.imgPathList.length > 0 ? encodeURIComponent("[" + this.state.imgNameList + "]") : encodeURIComponent("[]")
                }
                console.log(this.state.isModify, params)
                const response = commonApi('put', '/board/qnaBoardUpdate', params);
                response.then((res) => {
                    if (res.success) {
                        SimpleToast.show('inquiry modify finish', SimpleToast.SHORT);
                        // history.push('/mypage/MyInquiryList')
                        this.props.navigation.replace('InquireMain')
                    } else {
                        SimpleToast.show('Server Connection Failed', SimpleToast.SHORT);

                    }
                })
                    .catch(e => {
                        console.log('ERROR :::', e)
                    });
            } else {
                const params = {
                    "bq_category": this.state.selectedCategory.value,
                    "bq_title": this.state.inquireTitle,
                    "bq_contents": this.state.inquireContent,
                    "bq_filePath": encodeURIComponent("[" + this.state.imgPathList + "]"),
                    "bq_fileName": encodeURIComponent("[" + this.state.imgNameList + "]")
                }
                const response = commonApi('put', '/board/qnaBoardInsert', params);
                response.then((res) => {
                    if (res.success) {
                        SimpleToast.show('Inquire finish', SimpleToast.SHORT)
                        this.props.navigation.navigate('MyPageMain')
                    } else {
                        SimpleToast.show(res.message, SimpleToast.SHORT)
                    }
                }).catch(e => {
                    console.log('error:: ', e);
                })
            }
        }
    }

    onChangeTitleValue = (val) => {
        this.setState({
            inquireTitle: val 
        })
    }

    onChangeContentValue = (val) => {
        this.setState({
            inquireContent: val 
        })
    }

    setOpen = () => {
        this.setState({
            pickerOpen: !this.state.pickerOpen
        });
    }

    setValue = (callback) => {
        this.setState(state => ({
            selectedCategory: callback(state.label)
        }));
    }
  
    render() {
        return (
            <>
            <ScrollView style={{ backgroundColor:Color.white}}>
                <HeaderBar border iconOnPress={()=>{this.props.navigation.goBack()}} title="My Inquiry"></HeaderBar>
                    {this.state.inquireIdx == '' || this.state.isModify ?
                <ScrollView style={styles.bodyContainer}>
                    <View style={{marginHorizontal: 15}}>
                        <DropDownPicker
                            placeholder={''}
                            style={styles.dropDownContainer}
                            textStyle={{fontSize:16, color:'#858585'}}
                            dropDownContainerStyle={{borderColor: '#D7D6D6'}}
                            open={this.state.pickerOpen}
                            items={this.state.categoryList}
                            setOpen={this.setOpen}
                            disabled={this.state.isModify}    
                            value={String(this.state.selectedCategory.value)}
                            setValue={this.setValue}
                        />
                              
                        <TextInput
                            style={[styles.dropDownContainer, this.state.inquireTitle == '' && {color: '#858585'}]}
                            placeholder={'Please enter title.'}
                            placeholderTextColor={'#858585'}
                            selectionColor="grey"
                            multiline
                            value={this.state.inquireTitle}
                            onChangeText={this.onChangeTitleValue}
                            />
                       

                        <TextInput
                            multiline ={true}
                            style={[styles.contentContainer, this.state.inquireContent == '' && {color: '#858585'}]}
                            placeholder={
                                "-We will address your inquiry and try to respond as soon as possible.\n\n-The answer may be rejected if there are expressions that cause shame, such as abusive language, character infringement, or sexual harassment.\n-In the case of a duplicate inquiry, it may be deleted at random."
                            }
                            placeholderTextColor={'#858585'}
                            selectionColor="grey"
                            value={this.state.inquireContent}
                            onChangeText={this.onChangeContentValue}
                                />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' ,paddingVertical:20}}>
                            {this.state.imgList.map((img) => {
                                console.log(img.file_url)
                                return (
                                    <Image source={{ uri: img.sign_url }} resizeMode={'contain'} style={{ width: '50%', height: 320 }} />
                                )
                            })}
                        </View>
                        {/* <View style={styles.contentContainer}>
                            <Text style={styles.bigText}>Please enter contents.{'\n'}</Text>
                            <Text style={styles.smallText}>-We will address your inquiry and try to respond as soon as possible.{'\n'}-The answer may be rejected if there are expressions that cause shame, such as abusive language, character infringement, or sexual harassment.{'\n'}-In the case of a duplicate inquiry, it may be deleted at random.</Text>
                        </View> */}
                        <View style={{paddingVertical: 30, borderBottomColor: '#BEBEBE', borderBottomWidth: 1}}>
                            <View style={styles.uploadContainer}>
                                    <TouchableOpacity style={styles.uploadButton} onPress={() => this.uploadAlert()}>
                                    <Text style={styles.buttonText}>Upload</Text>
                                </TouchableOpacity>
                                <View style={styles.uploadLabel}>
                                            <Text style={styles.labelText}>{this.state.fileName == "" ? "No selected file" : this.state.fileName.length > 0 && this.state.fileName.length > 20 ? this.state.fileName.substr(0, 20) + '...' : this.state.fileName}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop: 10}}>
                            <Text style={styles.smallText}>You can attach a total of 5 image files (jpg, png) less than 5MB.{'\n'}</Text>
                            <Text style={styles.smallText}>· Email, phone number, and information are collected to assist customers and improve service according to the inquiry you may ask.{'\n'}· Collected personal information will be deleted after being stored for the time of membership withdrawal or a period based on relevant laws and regulations.{'\n'}· Please click the ‘Inquire’ button if you agree on collecting personal information. (The collected personal information is not used for any purpose other than assistance.){'\n'}· Customers have a right to deny the agreement regarding personal information collected from Dfians wallet. In case of disagreement, part of the service such as 1:1 Inquiry and answer confirmation is restricted. </Text>
                        </View>
                        <View style={{flexDirection:'row', marginTop: 30}}>
                            <CheckBox
                                value={this.state.isChecked}
                                style={styles.checkBox}
                                tintColors={{
                                    true: '#3a7bd5',
                                    false: '#858585'
                                }}
                                onValueChange={(bool) => { 
                                    this.setState({
                                        isChecked : bool,
                                    })
                                }}
                                    />
                                <TouchableOpacity onPress={() => this.setState({
                                isChecked : !this.state.isChecked
                            })}>
                                <Text style={styles.agreeText}>I agree with the DFian Wallet’s policy above.</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.isChecked ?
                            <RectangleButton
                                title={'Inquire'}
                                style={{height: 52, marginHorizontal: 10, marginVertical: 50}}
                                onPress={() => this.onPressInquire(this.state.cameraList)}
                            /> :
                            <RectangleButton
                                disable
                                title={'Inquire'}
                                style={{height: 52, marginHorizontal: 10, marginVertical: 50}}
                            />
                        }
                    </View>
                </ScrollView> :
                <ScrollView style={[styles.bodyContainer,{marginBottom:40}]}>
                        <View style={[styles.contentHeader]}>
                        <Text style={styles.headerTitle}>My Inquiry</Text>
                        <Text style={styles.headerDate}>{this.state.qnaInfo.reg_date}</Text>
                    </View>
                    <View style={{paddingHorizontal: 15}}>
                        <View style={styles.dropDownContainer}>
                            {this.state.categoryList.map((category) => {
                                if (category.value == this.state.qnaInfo.bq_category) {
                                    return (
                                        <Text style={{ fontSize: 16 }}>{category.label}</Text>
                                    )
                                }
                                
                            })}
                        </View>
                        <View style={styles.dropDownContainer}>
                            <Text style={{fontSize: 16}}>{this.state.qnaInfo.bq_title}</Text>
                        </View>
                                <View style={[styles.contentContainer, this.state.replyList.length > 0 && { marginBottom: 20 }]}>
                                    <Text style={{ fontSize: 16 }}>{this.state.qnaInfo.bq_contents}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 20 }}>
                                    {this.state.imgList.map((img) => {
                                        console.log(img.file_url)
                                        return (
                                            <Image source={{ uri: img.sign_url }} resizeMode={'contain'} style={{ width: '50%', height: 320 }} />
                                        )
                                    })}
                                </View>
                    </View>
                            {this.state.qnaInfo.bq_confirm == "Y" && this.state.replyList && this.state.replyList.map((value, index) => {
                        return (
                            <View style={{ paddingHorizontal: 15 }}>
                                <View style={[styles.dropDownContainer, { marginBottom: 0 ,borderBottomWidth:0}]}>
                                    <Text style={{ fontSize: 16 ,fontWeight:'bold'}}>Admin Reply</Text>
                                </View>
                                <View style={styles.contentContainer}>
                                    <Text style={{ fontSize: 16 }}>{value.bqr_contents}</Text>
                                </View>
                            </View>
                        )
                    })}
                    <View style={{flexDirection:'row',justifyContent:'space-between', marginTop:20, paddingHorizontal:15}}>
                        <RectangleButton disable={this.state.qnaInfo.bq_confirm == "Y" ? true : false} onPress={() => this.modifyQna()} style={{height:53, flexGrow:1, flexBase:1, marginRight:5}} title={"Modify"}></RectangleButton>
                        <RectangleButton onPress={() => this.deleteQnaAlert()} style={{ height: 53, flexGrow: 1,flexBase:1,  marginLeft:5}} title={'Delete'}></RectangleButton>
                    </View>
                </ScrollView>
                }
            </ScrollView>
            <BottomTab navigation={this.props.navigation}/>
            </>
        );
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        height: 52,
        marginHorizontal: 20,
    },
    bodyContainer: {
        
        paddingTop: 20,
        
        
        // marginBottom: 40,
        
    },
    dropDownContainer: {
        minHeight: 50,
        borderWidth: 1,
        borderColor: '#D7D6D6',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginBottom: 20,
        fontSize: 16,
        color: 'black',
        borderRadius: 0
    },
    contentContainer: {
        minHeight: 270,
        borderWidth: 1,
        borderColor: '#D7D6D6',
        paddingHorizontal: 10,
        paddingVertical: 10,
        textAlignVertical: 'top',
        flexWrap:'wrap',
        fontSize: 16,
        color: 'black'
    },
    bigText: {
        fontSize: 16,
        color :'#858585'
    },
    smallText: {
        fontSize: 14,
        color :'#858585'
    },
    uploadContainer: {
        flexDirection: 'row',
        height: 50,
    },
    uploadButton: {
        height: 50,
        flex: 3,
        justifyContent:'center',
        backgroundColor:'#1B2937',
    },
    uploadLabel: {
        height: 50,
        flex: 7,
        justifyContent:'center',
        backgroundColor:'#FAFAFA',
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
        textAlign:'center'
    },
    labelText: {
        fontSize: 16,
        color: '#858585',
        marginLeft: 10
    },
    checkBox: {
        height: 20,
        flexShrink:0,
    },
    agreeText: {
        fontSize: 16,
        color: '#4A4A4A'
    },
    contentHeader: {
        height: 60,
        
        justifyContent:'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EAEAEA',
        marginBottom: 20,
        
    },
    headerTitle: {
        fontSize: 16,
        color: '#4A4A4A',
        marginLeft: 15
    },
    headerDate: {
        fontSize: 12,
        color: '#929292',
        marginTop: 10,
        marginLeft: 15
    },
});


export default InquiryDetail;
