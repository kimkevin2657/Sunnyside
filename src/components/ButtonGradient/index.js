import React from 'react';
import { TouchableOpacity, Platform, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Color } from '@common';

export default class ButtonGradient extends React.PureComponent {
    render() {
        let {
            textColor,
            text,
            onPress,
            containerStyle,
            disabled,
            fullWidth,
            textStyle,
            backgroundColor,
            kakao,
            apple,
        } = this.props;
        let colorGradient = [backgroundColor || Color.gradientPrimary, backgroundColor || Color.gradientSecundary];
        let shadowColor = { shadowColor: Color.gradientShadom };

        if (!textColor) {
            textColor = Color.gradientForeground;
        }

        if (disabled) {
            colorGradient = [
                Color.gradientPrimaryDisabled,
                Color.gradientSecundaryDisabled,
            ];
            shadowColor = { shadowColor: 'transparent' };
        }

        return (
            <TouchableOpacity
                disabled={disabled}
                activeOpacity={0.7}
                style={[
                    styles.containerRegular,
                    styles.shadow,
                    shadowColor,
                    containerStyle,
                ]}
                onPress={onPress}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={colorGradient}
                    style={[
                        styles.gradientContainer,
                        fullWidth ? styles.fullWidth : null,
                        { paddingHorizontal: this.props.paddingHorizontal },
                    ]}>
                    {kakao &&
                        <Image source={require('../../images/logos/KakaoSymbol.png')}
                            style={styles.logo}></Image>
                    }
                    {apple &&
                        <Image source={require('../../images/logos/appleLogo.png')}
                            style={styles.logo}></Image>
                    }
                    <Text
                        style={[
                            styles.regularText,
                            fullWidth ? styles.fullWidth : null,
                            { color: textColor },
                            textStyle,
                        ]}>
                        {text}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    containerRegular: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 44,
        borderRadius: 8,
    },
    shadow: {
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        backgroundColor: 'transparent',
    },
    logo: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },
    gradientContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flexDirection: 'row',
        borderRadius: 8,
        paddingHorizontal: 30,
    },
    fullWidth: {
        width: Platform.isPad ? 400 : '100%',
    },
    regularText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

ButtonGradient.defaultProps = {
    text: '',
    containerStyle: {},
    textStyle: {},
    disabled: false,
    type: 'regular',
    fullWidth: false,
    progressText: 'Uploading File',
    paddingHorizontal: 30,
};
