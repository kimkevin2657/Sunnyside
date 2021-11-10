import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Platform,
} from 'react-native';
import { Device, Color } from '@common';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import Icon from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';

class ModalResultMap extends React.PureComponent {
    constructor(props) {
        super(props);

        let initialCoordinats = {
            latitude: Number(this.props.experiences[0].lat),
            longitude: Number(this.props.experiences[0].lon),
            latitudeDelta: 0.5,
            longitudeDelta: 0.1,
        };

        this.state = {
            coordinates: initialCoordinats,
            loadMap: false,
            experienceSelected: null,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ loadMap: true });
        }, 500);
    }

    selectExperience = (experienceSelected) => {
        this.setState(
            {
                experienceSelected: null,
            },
            () => {
                this.setState({
                    experienceSelected,
                });
            },
        );
    };

    deselectExperience = () => {
        this.setState({
            experienceSelected: null,
        });
    };

    renderCluster = (cluster, onPress) => {
        const pointCount = cluster.pointCount,
            coordinate = cluster.coordinate;

        return (
            <Marker coordinate={coordinate} onPress={onPress}>
                <View style={styles.clusterStyle}>
                    <Text style={styles.clusterText}>{pointCount}</Text>
                </View>
            </Marker>
        );
    };

    renderMarker = (data) => (
        <CustomMarker
            key={data.id || Math.random()}
            experience={data}
            selectExperience={this.selectExperience}
        />
    );

    getCoordinates = (item) => {
        return [Number(item.lon), Number(item.lat)];
    };

    render() {
        return (
            <View style={styles.wrap}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.titleContainer}>
                    <TouchableOpacity
                        style={styles.closeIconContainer}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Icon name="close" style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.contentWrap}>
                    {this.state.loadMap && (
                        <ClusteredMapView
                            style={styles.clusterContainer}
                            data={this.props.experiences}
                            accessor={this.getCoordinates}
                            initialRegion={this.state.coordinates}
                            provider={PROVIDER_GOOGLE}
                            ref={(r) => {
                                this.map = r;
                            }}
                            renderMarker={this.renderMarker}
                            renderCluster={this.renderCluster}
                        />
                    )}
                    {this.state.experienceSelected != null && (
                        <React.Fragment>
                            <View style={styles.cardContainer}>
                            </View>
                        </React.Fragment>
                    )}
                </View>
            </View>
        );
    }
}

class CustomMarker extends React.PureComponent {
    selectExperience = () => {
        this.props.selectExperience(this.props.experience);
    };

    render() {
        return (
            <Marker
                coordinate={{
                    latitude: Number(this.props.experience.lat),
                    longitude: Number(this.props.experience.lon),
                }}
                onPress={this.selectExperience}>
                <View style={styles.markerContainer}>
                    <Text style={styles.rateText}>
                        ${this.props.experience.rate_per_person}
                    </Text>
                </View>
                <View style={[styles.triangle, this.props.style]} />
            </Marker>
        );
    }
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        flex: 1,
        position: 'absolute',
        padding: 10,
        zIndex: 2,
        ...Platform.select({
            ios: {
                paddingTop: Device.isIphoneX ? 48 : 25,
                height: Device.isIphoneX ? 100 : 80,
            },
            android: {
                top: 0,
                height: 80,
            },
        }),
    },
    closeIconContainer: {
        backgroundColor: Color.text,
        width: 40,
        height: 40,
        opacity: 0.5,
        borderRadius: 50,
        paddingTop: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 22,
        color: Color.background,
    },
    contentWrap: {
        zIndex: 1,
        flex: 1,
    },
    clusterContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        backgroundColor: Color.primary,
        padding: 5,
        borderRadius: 5,
    },
    rateText: {
        color: '#ffffff',
        fontWeight: '500',
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: Color.primary,
        transform: [{ rotate: '180deg' }],
        alignSelf: 'center',
    },
    cardContainer: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clusterStyle: {
        backgroundColor: Color.clusterBackground,
        borderRadius: 50,
        borderColor: Color.primary,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
    },
    clusterText: {
        color: Color.primary,
        fontWeight: '500',
    },
});

const mapStateToProps = (state) => {
    return {
        experiences: state.explore.experienceResults.experiences,
    };
};

export default connect(mapStateToProps)(ModalResultMap);
