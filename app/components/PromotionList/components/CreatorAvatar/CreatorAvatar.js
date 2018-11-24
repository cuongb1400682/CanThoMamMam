import React, {Component} from "react";
import {View} from "react-native";
import {Avatar} from "react-native-elements";
import {database} from '../../../../../app/utils/FirebaseUtils';
import PropTypes from "prop-types";
import {isEmpty} from "../../../../utils/StringUtils";

class CreatorAvatar extends Component {
    static propTypes = {
        creatorId: PropTypes.string,
        style: PropTypes.any
    };

    static defaultProps = {
        creatorId: null,
        style: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            url: ""
        };
    }

    componentDidMount() {
        const {creatorId} = this.props;

        if (creatorId) {
            this.userRef = database.ref(`/users/${creatorId}`);

            this.userRef.on("value", snap => {
                const userInfo = snap.val();

                if (userInfo && !isEmpty(userInfo.avatar)) {
                    this.setState({
                        url: userInfo.avatar
                    })
                }
            })
        }
    }

    componentWillMount() {
        if (this.userRef) {
            this.userRef.off();
        }
    }

    render() {
        const {creatorId, style} = this.props;
        const {url} = this.state;

        console.log("url = ", url);

        if (!creatorId || isEmpty(url)) {
            return null;
        }

        return (
            <View style={style}>
                <Avatar
                    medium
                    rounded
                    source={{uri: url}}
                    activeOpacity={0.7}
                />
            </View>
        );
    }
}

export default CreatorAvatar;
