import React, {useEffect, useRef, useState} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {toggleGrid} from '../../../redux/actions/canvasActions'
import {save, undoPicture, clearCanvas, load} from '../../../redux/utils/controls'
import {DRAW_PICTURE} from "../../../redux/actions/actionTypes";


const Wrapper = styled.div`
  .behidden{
    display: none !important;
  }
  .button{
    margin-bottom: 0.5rem;
  }
`

const Button = styled.button`
    position: relative;
    flex-basis: 15%;
    border: none;
    background: none;
    box-sizing: border-box;
    outline: none;
    margin-bottom: 6%;
    
    &:hover {
      cursor: pointer;
    
      .controlName {
        visibility: visible;
        opacity: 1;
      }
        
      img {
        filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
      }
    }
    
    &:active {
      img {
          filter: none;
        }
    }
    
    img {
      filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
      width: 60%;
      height: auto;
    }
     
    .controlName {
      visibility: hidden;
      opacity: 0;
      transition: visibility 0.3s, opacity 0.3s ease-in-out;
      position: absolute;
      margin-left: auto;
      margin-right: auto;
      top: 85%;
      left: 0;
      right: 0;
      text-align: center;
      font-family: 'Roboto', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 1.6vh;
      color: #616060;
    }
`



const Modal = styled.div`
  position: absolute;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 200;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
`

const Card = styled.div`
    display: flex;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    flex-direction: column;
    padding: 0.25rem;
    //justify-items: center;
  
    transition: 0.3s;
    min-width: 20rem;
    height: 10rem;
    background-color: white;
 
    input {
        font-family: 'Roboto', sans-serif;
        font-weight: 300;
        box-sizing: border-box;
        padding: 0 4%;
        max-width: 94%;
        min-height: 3rem;
        max-height: 10rem;
        border: none;
        background: #FFFFFF;
        box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.25);
        outline: none;
    }
    input {
        font-family: 'Roboto', sans-serif;
        font-weight: 300;
        box-sizing: border-box;
        padding: 0 4%;
        max-width: 94%;
        min-height: 3rem;
        max-height: 10rem;
        border: none;
        background: #FFFFFF;
        box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.25);
        outline: none;
    }
    .fancyLabel{
        margin-bottom: 1.5rem;
        font-weight: bold;
    }
    button{
        margin-top: 0.5rem;
        width: 8rem;
        height: 2rem;
    };
    #file-save-form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: auto;
      min-width: 60%;
      max-width: 80rem;
      height: 10em;
      background: rgba(227, 245, 241, 0.85);
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 4px;
    }
    #file-load-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: auto;
        min-width: 60%;
        max-width: 80rem;
        height: 10em;
        background: rgba(227, 245, 241, 0.85);
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
    }
`


const ControlButton = props => {
    const [localFileName, setLocalFileName] = useState("file")
    const [shouldShow, setShouldShow] = useState(false)
    const [shouldShowLoad, setShouldShowLoad] = useState(false)
    const [availableImages, setAvailableImages] = useState(["naimah"])
    const [selectedImage, setSelectedImage] = useState("naimah")

    const submitRef3 = useRef(null)
    const submitRef4 = useRef(null)


    useEffect(() => {
        if (props.ready) {
            console.log("controlbutton.js 147")
            props.ws.sendJsonMessage({
                "x_auth_token": "930232a799cd6544ce7b6ac4e825bccb",
                "type": "list_drawings_minus_gifs"
            })
        }

        const interval = setInterval(() => {

            if (props.ready) {
                console.log("controlbutton.js 157")
                props.ws.sendJsonMessage({
                    "x_auth_token": "930232a799cd6544ce7b6ac4e825bccb",
                    "type": "list_drawings_minus_gifs"
                })
            }
        }, 30000);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [props.ready, shouldShowLoad])

    useEffect(() => {
        if (props.ready) {
            const lastMessage = props.ws.lastJsonMessage
            if (lastMessage != null || lastMessage != undefined) {
                if (lastMessage[0] !== null && typeof(lastMessage[0]) === "string") {
                    setAvailableImages(lastMessage)
                }
                else {
                    console.log(lastMessage)
                    const localFn = (c) => {
                        let hex = c.toString(16)
                        return hex.length == 1 ? "0" + hex : hex;
                    }
                    let localFrames = lastMessage.map((frame_) => {

                        return {"frame":frame_["frame"].map(
                                ([r,g,b]) => {
                                    return "#" + localFn(r) + localFn(g) + localFn(b)
                                }

                            ), "delay": parseFloat(frame_.delay)}
                    });
                    props.setFrames(localFrames)
                    //TODO: set delays
                    //TODO: set current frame index to 0
                    //TODO: set current frame to first frame


                    if (props.setDelays !== undefined && typeof(props.setDelays) === "function") {
                        console.log(typeof(props.setDelays))
                        props.setDelays(localFrames.map((frame) => frame.delay))
                    }
                    if (props.setCurrentFrameIndex !== undefined && typeof(props.setCurrentFrameIndex) === "function"){
                        console.log(typeof(props.setCurrentFrameIndex))
                        props.setCurrentFrameIndex(0)
                    }
                    if (localFrames.length > 0 && localFrames?.[0] !== null && typeof(localFrames?.[0]) !== undefined) {
                        props.drawPicture(localFrames[0].frame)
                    }
                    console.log(localFrames)
                }
            }
        }
    },[props.ws?.lastJsonMessage, props.ready, shouldShowLoad])






    const onFileSaveSubmit = e => {
        e.preventDefault()

        props.doFrameSave(localFileName)
        setShouldShow(false)
    }

    const onFileLoadSubmit = e => {
        e.preventDefault()

        if(props.ready){
            props.ws.sendJsonMessage({"x_auth_token":"930232a799cd6544ce7b6ac4e825bccb", "type":"get_drawing", "draw_id":selectedImage})
            setShouldShowLoad(false)
        }

    }






    let name = props.name

    const clickHandler = (name) => {
        switch (name) {
            // case 'Undo': {
            //     console.log(props.done, props.doneAt)
            //     props.undo(props.done, props.doneAt, props.pixels)
            //     break
            // }
            case 'Grid': {
                props.toggleGrid()
                break
            }
            case 'Save': {
                setShouldShow(true)
                break
            }
            case 'Load': {
                // TODO: NEED TO UPDATE DELAY ARRAY WHEN IMPORTING IMAGE!
                setShouldShowLoad(true)
                break
            }
            case 'Upload': {
                props.load()
                break
            }
            case 'Clear': {
                props.clear()
                break
            }
            default: return
        }
    }

    const renderName = () => {
        switch (name) {
            case 'Save Miniature':
                return (
                    <span className='controlName'>
                        <span>
                            {"Export as PNG"}
                        </span>
                    </span>
                )
            case 'Undo':
                return (
                    <span className='controlName'>
                        <span>{name[0].toUpperCase() + name.slice(1)}</span>
                    </span>
                )
            default :
                return (
                    <span className='controlName'>
                        <span>{name[0].toUpperCase() + name.slice(1)}</span>
                    </span>
                )
        }
    }

    return (
        <>
            <Wrapper>
                <Modal className={shouldShowLoad ? "" : "behidden"}>
                    <Card>
                        <form id='file-load-form' onSubmit={onFileLoadSubmit}>
                            <label className={"fancyLabel"}>Pick a file to load.</label>
                            <select value={selectedImage} onChange={(e)=>{ const {value} = e.target; setSelectedImage(value)}} id="select-id">
                                {availableImages.map((imageName) => {return <option key={imageName} value={imageName}>{imageName}</option>})}
                            </select>
                            <button type='submit' ref={submitRef4}>Load!</button>
                            <button onClick={()=>setShouldShowLoad(false)}>Cancel</button>
                        </form>
                    </Card>
                </Modal>
            </Wrapper>
            <Wrapper>
                <Modal className={shouldShow ? "" : "behidden"}>
                    <Card>
                        <form id='file-save-form' onSubmit={onFileSaveSubmit}>
                            <label className={"fancyLabel"}>Enter filename.</label>
                            <input type='text' placeholder='Enter the filename.' onChange={(e) => { const { value } = e.target; setLocalFileName(value) }} />
                            <button type='submit' ref={submitRef3}>Save!</button>
                            <button onClick={()=>setShouldShow(false)}>Cancel</button>
                        </form>
                    </Card>
                </Modal>
            </Wrapper>
            <Button
                onClick={() => clickHandler(name)}
                name={props.name}
            >

                <img
                    alt={props.name}
                    src={props.src}
                />
                {renderName()}
            </Button>
        </>

    )
}

function mapStateToProps(state) {
    return {
        width: state.canvas.width,
        height: state.canvas.height,
        scale: state.canvas.scale
    }
}

function mapDispatchToProps(dispatch) {
    return {
        undo: (done, doneAt, pixels) => undoPicture(done, doneAt, pixels),
        drawPicture: (array) => dispatch({
            type: DRAW_PICTURE,
            payload: array
        }),

        toggleGrid: () => toggleGrid(),
        // save: (width, height, scale) => save(width, height, scale),
        load: () => load(),
        clear: () => clearCanvas()
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlButton);
