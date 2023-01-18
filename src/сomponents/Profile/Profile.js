import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {motion} from 'framer-motion'

const ProfileWrapper = styled(motion.div)`
  width: 50%;
  max-width: 60rem;
  height: 80%;
  max-height: 90rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  background: rgba(227, 245, 241, 0.85);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
`

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  height: 40%;
  width: 80%;
  margin-top: 2vh;
  
  .avatar {
    position: relative;
    border-radius: 4px;
    width: 30%;
    height: auto;
    margin-bottom: 0.5em;
    margin-left: 2em;
    
    .defaultAvatar {
      border-radius: 4px;
      width: 100%;
      height: 100%;
      object-fit: cover;
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    }
    
    .customAvatar {
      border-radius: 4px;
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
    
    .imageOverlay {
      border-radius: 4px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    } 
  }
  
  .userData {
    margin-right: 1em;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 15px;
  }
  
  .email {
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    font-size: 1.4vw;
  }
`

const PostsWrapper = styled.div`
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  
  .label {
    margin-bottom: 1em;
    font-family: 'Roboto', sans-serif;
    font-weight: lighter;
    font-size: 1.8vw;
  }
`

const Profile = props => {
    return (<div></div>)
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps)(Profile);