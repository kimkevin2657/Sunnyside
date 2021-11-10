import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont();
export default class TabBarIcon extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { icon, text, tintColor } = this.props;
        return (
            <View style={styles.content}>
                <Icon
                    name={icon}
                    ref={(comp) => (this._image = comp)}
                    style={[styles.icon, { color: '#BEBEBE' }]}
                />
                <Text style={[styles.text, { color: '#858585' }]}>{text}</Text>
            </View>
        );
    }
}

TabBarIcon.propTypes = {
    type: PropTypes.string,
    icon: PropTypes.any,
    tintColor: PropTypes.string,
};

const styles = StyleSheet.create({
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        alignContent:'center',
        fontSize: 25,
    },
    text: {
        fontSize: 12,
    },
});
