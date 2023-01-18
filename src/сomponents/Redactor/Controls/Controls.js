import React from 'react'
import Load from '../../../images/controls/Load.svg'
import SaveMiniature from '../../../images/controls/Save Miniature.svg'
import Save from '../../../images/controls/Load.svg'
import Grid from '../../../images/controls/Grid.svg'
import Clear from '../../../images/controls/Clear.svg'
import Upload from '../../../images/controls/Upload.svg'
import ControlButton from '../../UI/Editor/ControlButton'
import Undo from '../../../images/controls/Undo.svg'
import Download from '../../../images/controls/Download.svg'
import styled from 'styled-components'
import UploadToGallery from '../UploadToGallery/UploadToGallery'
import TipsButton from '../../UI/Tips/TipsButton'


const ControlsPanel = styled.div`
    display: flex;
    flex-direction: column;
    width: 11vh;
    background: rgba(227, 245, 241, 0.85);
    //box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    //border-radius: 4px;
    
    >button:first-child {
      margin-top: 10%;
    }
    
    >button {
      height: 12.5%;
    }
`

const Controls = (props) => {
    return (
        <ControlsPanel >
            <ControlButton
                name={'Undo'}
                src={Undo}
            />
            <ControlButton
                name={'Clear'}
                src={Clear}
            />
            <ControlButton
                name={'Grid'}
                src={Grid}
            />


            <ControlButton
                name={'Save'}
                src={Save}
                ws={props.ws}
                ready = {props.ready}
                doFrameSave={props.doFrameSave}
                setFrames={props.setFrames}
            />






            <ControlButton
                name={'Load'}
                src={SaveMiniature}
                ws={props.ws}
                ready = {props.ready}
                setFrames={props.setFrames}
                currentFrameIndex={props.currentFrameIndex}
                setCurrentFrameIndex={props.setCurrentFrameIndex}
                delays={props.delays}
                setDelays={props.setDelays}
            />

            {/*<ControlButton*/}
            {/*    name={'Upload'}*/}
            {/*    src={Upload}*/}
            {/*/>*/}


            <UploadToGallery
                name={'Load'}
                src={Load}
            />


        </ControlsPanel>
    )
}

export default Controls