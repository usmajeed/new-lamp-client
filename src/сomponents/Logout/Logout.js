import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'

const Logout = (props) => {

    useEffect(() => {
        props.logout()
    }, [props])

    return (
        <Redirect to={'/'} />
    )
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(null, mapDispatchToProps)(Logout)