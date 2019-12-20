import React, {useState, useEffect} from 'react';
import ProvidersList from '../components/ProvidersList';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as ProviderAction from "../actions/provider";
import {CircularProgress} from "@material-ui/core";

const ProviderPage = (props) => {
    const {refreshProviders, providers, addProvider, removeProvider, updateProvider} = props;
    const [updating, setUpdating] = useState(true);

    /**
     * Because the state holding providers is not updated when orders or products are created
     * and these associations are only useful here (providers orders or providers products)
     */
    useEffect(() => {
        refreshProviders();
        setUpdating(false);
    }, []);

    if (updating) {
        return <CircularProgress/>
    } else {
        return (
            <ProvidersList providers={providers} actions={{addProvider, removeProvider, updateProvider}}/>
        )
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ProviderAction, dispatch);
}

function mapStateToProps(state) {
    return {
        providers: state.providers
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProviderPage);
