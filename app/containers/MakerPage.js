import React, {useState, useEffect} from 'react';
import MakersList from '../components/MakersList';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as MakerAction from "../actions/maker";
import {CircularProgress} from "@material-ui/core";

const MakerPage = (props) => {
    const {refreshMakers, makers, addMaker, removeMaker, updateMaker} = props;
    const [updating, setUpdating] = useState(true);

    /**
     * Because the state holding providers is not updated when orders or products are created
     * and these associations are only useful here (providers orders or providers products)
     */
    useEffect(() => {
        refreshMakers();
        setUpdating(false);
    }, []);

    if (updating) {
        return <CircularProgress/>
    } else {
        return (
            <MakersList makers={makers} actions={{addMaker, removeMaker, updateMaker}}/>
        )
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(MakerAction, dispatch);
}

function mapStateToProps(state) {
    return {
        makers: state.makers
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MakerPage);
