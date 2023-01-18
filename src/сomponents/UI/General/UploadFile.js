import React, {useEffect, useState} from 'react'
import {canvasRef} from '../../Redactor/Canvas/Canvas'
import styled, {css} from 'styled-components'
import Select from 'react-select'

const baseButtonStyle = css`
  border: none;
  outline: none;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-size: 2.2vh;
  font-weight: 300;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
`
const baseMessageStyles = css`
  background-color: #D0FFBF;
  position: absolute;
  width: 35%;
  height: 25%;
  left: 0; 
  right: 0;
  top: 0;
  bottom: 0; 
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 4px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  font-family: 'Roboto', sans-serif;
  font-weight: lighter;
  font-size: 24px;
  
    button {
      ${baseButtonStyle};
      height: 20%;
      width: 30%;
      background: #81FFB3;
      margin-bottom: 5%;
    }
    
    >div {
      margin-top: 5%;
      width: 70%;
      text-align: center;
    }
`

const AvatarUpload = styled.div`
  position: relative;
  width: 80%;
  height: 8%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .avatarLabel {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 1.8vw;
    background: #FFFFFF;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    cursor: pointer;
    
    &:hover {
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
      transition: box-shadow 0.2s linear;
    }
    
    &:active {
      box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.25);
    }
  }
  
  input {
    display: none;
  }
  
  span {
    font-family: 'Roboto', sans-serif;
    font-weight: lighter;
    font-size: 1.4vw;
  }
  
  .output {
    margin-top: 1em;
    color: #B41616; 
    font-weight: normal;
    font-size: 1.2vw;
    text-align: center;
    width: 200%;
    padding-bottom: 15px;
  }
`
const GalleryUpload = styled.form`
  background-color: #D0FFBF;
  position: absolute;
  width: 35%;
  height: 35%;
  left: 0; 
  right: 0;
  top: 0;
  bottom: 0; 
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  font-family: 'Roboto', sans-serif;
  
  .imageData {
    height: 30%;  
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    font-weight: lighter;
    font-size: 3vh;
    margin-top: 2%;
  }
  
  .imageInputs {
    position: relative;
    height: 10vh;
    width: 48vh;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    
    label {
      position: absolute;
      top: 0;
      width: 23vh;
      text-align: center;
      font-weight: lighter;
      font-size: 1.4vh;
    }
    
    >input {
      height: 5vh;
      width: 22vh;
      background: #ffffff;
      border: none;
      outline: none;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25);
      border-radius: 2px;
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      font-size: 3vh;
      text-align: center;
    }
    
    .Select-container {
      .Select__control {
        height: 5vh;
        min-height: 1vh;
        width: 22vh;
        display: flex;
        border: none;
        background: #ffffff;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
        border-radius: 2px;
        cursor: pointer;
      }
  
      .Select__value-container {
        display: flex;
        justify-content: center;
        align-content: center;
        padding: 0;
        font-family: 'Roboto', sans-serif;
        font-weight: 300;
        font-size: 3vh;
      }
  
      .Select__placeholder {
        color: #000000;
      }
  
      .Select__indicator {
        padding: 0;
      }
  
      .Select__indicator-separator {
        display: none;
      }
  
      .Select__menu {
        background: #ffffff;
      }
  
      .Select__option {
        text-align: center;
        cursor: pointer;
        
        &:hover {
          background: #D0FFBF;
        }
      }
      
      .Select__option--is-focused {
        background: #D0FFBF;
      }
  
      .Select__indicator {
        color: #000000;
      }
  
      .Select__input {
        color: transparent;
      }
    } 
  } 
  
  .imageSubmit {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 50%;
    height: 35%;
    margin-bottom: 2%;
    
    button {
      ${baseButtonStyle};
      height: 50%;
      width: 40%;
      
      &:hover {
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
        transition: box-shadow 0.2s linear;
      }
      
      &:first-child {
        background: #81FFB3;
      }
    
      &:nth-child(2n) {
        background: #FFE5E5;
      }
    }
  }
`
const ErrorMessage = styled.div`
  ${baseMessageStyles};
`
const CompletionMessage = styled.div`
  ${baseMessageStyles};
  
`

const UploadFile = () => {


    // return (
    //     <React.Fragment>
    //         {name === true
    //             ?
    //             renderGalleryUpload(completionMessage)
    //             :
    //             renderAvatarChange()
    //         }
    //     </React.Fragment>
    // )
    return(<div></div>)
}

export default UploadFile
