import React, {useRef, useState} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import Edit from '../../../images/tools/Draw.svg'

const UserNameWrapper = styled.div`
  position: relative;
  width: 70%;
  
  input {
    text-overflow: ellipsis;
    z-index: 200;
    padding: 0;
    width: 100%;
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    font-size: 1.4vw;
    border: none;
    text-align: center;
    background: none;
    outline: none;
    cursor: pointer;
    
    &:focus {
      background: white;
      box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.25);
    }
  }
  
  .edit {
    cursor: pointer;
    z-index: 50;  
    top: 0.5vh;
    right: -2.5vh;
    position: absolute;
    height: 2vh;
  }
`
const UserName = (props) => {
}

function mapStateToProps(state) {
    return {
        userName: state.authentication.userName,
        userId: state.authentication.userId,
        token: state.authentication.token,
        email: state.authentication.email
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserName);