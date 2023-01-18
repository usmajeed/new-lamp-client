import React, {useRef, useState} from 'react'
import Tools from './Tools/Tools'
import Canvas from './Canvas/Canvas'
import Controls from './Controls/Controls'
import Palette from './Controls/Palette/Palette'
import styled from 'styled-components'
import {motion} from 'framer-motion'

const RedactorWrapper = styled(motion.div)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  height: 85%;
  
  >div {
    height: 100%;
  }
  
  .canvasMain {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .canvasControlPanel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #D1EAE6;
    padding: 0.5rem;
    //box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    //border-radius: 3px;
    height: 21%;
  }

  .animControlPanel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #D1EAE6;
    padding: 0.5rem;
    //box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    //border-radius: 3px;
    height: 21%;
    overflow-x: scroll;
  }
  

`







const Redactor = props => {


    return (
        <RedactorWrapper
            variants = {props.containerVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
        >
            <Tools/>
            <div className='canvasMain'>
                {/*<div className='animControlPanel'>*/}
                {/*    <AnimDrawer/>*/}
                {/*</div>*/}
                <Canvas ready={props.ready} ws={props.ws} frames={props.frames} setFrames={props.setFrames} changeDelay={props.changeDelay} delays={props.delays} setDelays={props.setDelays} currentFrameIndex={props.currentFrameIndex} setCurrentFrameIndex={props.setCurrentFrameIndex}/>
                <div className='canvasControlPanel'>
                    <Palette/>
                </div>
            </div>
            <Controls ws={props.ws} ready={props.ready} doFrameSave={props.doFrameSave} delays={props.delays} setDelays={props.setDelays} setFrames={props.setFrames} currentFrameIndex={props.currentFrameIndex} setCurrentFrameIndex={props.setCurrentFrameIndex}/>
        </RedactorWrapper>
    )
}

export default Redactor
