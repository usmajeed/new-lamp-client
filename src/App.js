import React, {useEffect, useState} from 'react'
import MenuBar from './сomponents/Navigation/MenuBar/MenuBar'
import Redactor from './сomponents/Redactor/Redactor'
import {Redirect, Route, Switch, withRouter} from 'react-router'
import Gallery from './сomponents/Gallery/Gallery'
import Home from './сomponents/Home/Home'
import Auth from './сomponents/Authentication/Auth'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {AnimatePresence} from 'framer-motion'
import './App.css'
import useWebSocket from "react-use-websocket";

const AppWrapper = styled.div`

  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  >div:first-child {
    height: 13%;
  }
`

function App(props) {
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
    const [ready, setReady] = useState(false)
    const [frames, setFrames] = useState([{frame:new Array(64 * 64).fill('#FFFFFF'),delay:"0.03"}])
    const [numOfFrames, setNumOfFrames] = useState(1)
    const [delays, setDelays] = useState(["0.03"])

    const changeDelay = (index, delay) => {
        setFrames(
            frames.map((frame_, i_) => {
                if (i_ === index) {
                    return {"frame":frame_['frame'], 'delay':delay}
                } else {
                    return frame_;
                }
            }))
        setDelays(
            delays.map(
                (delay_, i_) => {
                if (i_ === index) {
                    return delay;
                } else {
                    return delay_;
                }
            }
        ))
    }


    useEffect(()=>{
        setDelays(delays)
        //  TODO: when an image is loaded then delay array needs to be updated
        setFrames(
            frames.map((frame_, i_) => {
                return {"frame":frame_['frame'], 'delay':delays[i_]}
            }))
    }, [delays])


    useEffect(()=>{
        if(frames){
            console.log('firing')
            setNumOfFrames(frames.length)
            setDelays(frames.map((frame_) => {
                return frame_['delay']
            }))
        }

        }

    ,[frames?.length])

    useEffect(()=>{},[])

    const doFrameSave = (localFileName) =>{
        if(ready){
            console.log("app.js 35")
            let localFrames = frames.map((frame_) => {
                return {"frame":frame_["frame"].map(hex => {
                        let r = parseInt(hex.slice(1, 3), 16),
                            g = parseInt(hex.slice(3, 5), 16),
                            b = parseInt(hex.slice(5, 7), 16);
                        return [r, g, b];
                    }), "delay": parseFloat(frame_.delay)}
            });
            ws.sendJsonMessage({"x_auth_token":"930232a799cd6544ce7b6ac4e825bccb", "type":"save_drawing", "data":localFrames, "file_name":localFileName})

        }
    }



    // Move element at index to index + an offset while maintaining original order
    const moveFrame = (index, offset) => {
        const newIndex = index + offset
        if (newIndex < 0 || newIndex >= frames.length) return
        const newFrames = [...frames]
        newFrames.splice(newIndex, 0, newFrames.splice(index, 1)[0])
        setFrames(newFrames)
    }

    const ws = useWebSocket("wss://lamp-45454.local:5556", {
        onOpen: () => {
            console.log('opened, setting ready to true');
            setReady(true)


        },
        onClose: () => {console.log('closed'); setReady(false)},
        shouldReconnect: (closeEvent) => true,
    })


    const containerVariants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1,
            transition: {delay: 0.2, duration: 0.2}
        },
        exit: {
            opacity: 0,
            transition: {duration: 0.2}
        }
    }


    // Auto login

    let routes = (
        <React.Fragment>
            <MenuBar/>
            <AnimatePresence exitBeforeEnter>
                <Switch>
                    <Route path='/editor'>
                        <Redactor containerVariants={containerVariants} ready={ready} frames={frames} setFrames={setFrames} ws={ws} doFrameSave={doFrameSave} setFrames={setFrames} numOfFrames={numOfFrames} moveFrame={moveFrame} delays={delays} setDelays={setDelays} changeDelay={changeDelay} currentFrameIndex={currentFrameIndex} setCurrentFrameIndex={setCurrentFrameIndex}/>
                    </Route>
                    <Route path='/gallery'>
                        <Gallery containerVariants={containerVariants} ready={ready} ws={ws}/>
                    </Route>
                    <Route path='/authentication'>
                        <Auth containerVariants={containerVariants}/>
                    </Route>
                    <Route exact path='/'>
                        <Home containerVariants={containerVariants}/>
                    </Route>
                    <Redirect to={'/profile'}/>
                </Switch>
            </AnimatePresence>
        </React.Fragment>
    )
    return (
        <AppWrapper id='app'>
            {routes}
        </AppWrapper>
    )
}

function mapStateToProps(state) {
    return {
        isAuthenticated: !!state.authentication.token
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
