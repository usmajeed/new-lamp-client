import React, {useRef} from 'react'
import {CHANGE_COLOR} from '../../../../redux/actions/actionTypes'
import {connect} from "react-redux"
import styled from 'styled-components'


import Plus from '../../../../images/tools/Plus.svg'







const AnimDrawer = (props) => {

    const inputRef = useRef(null)


    return (

    )
}

function mapStateToProps(state) {
    return {
        color: state.canvas.color
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeColor: (color) => dispatch({
            type: CHANGE_COLOR,
            color
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnimDrawer);