import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {DRAW_PICTURE, CHANGE_TOOL, CHANGE_SCALE} from '../../../redux/actions/actionTypes'
import draw, {drawCanvas} from '../../../redux/actions/canvasActions'
import {send} from '../../../redux/utils/send'
import {undoPicture, refresh} from '../../../redux/utils/controls'
import styled from 'styled-components'
import Plus from '../../../images/tools/Plus.svg'

const CanvasWrapper = styled.div`
  background: rgba(227, 245, 241, 0.85);
  flex-direction: column;
  //box-shadow: inset 5px 5px 7px rgba(0, 0, 0, 0.25);
  //border-radius: 3px;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  outline: none;
  
  >canvas {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }
`




function useDebounce(value, delay){
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
           const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

            return () => {
                  clearTimeout(timer)
                }
          }, [value, delay])

      return debouncedValue
}

export const canvasRef = React.createRef()




const LocalButton = styled.button`
     position: relative;
     flex-basis: 3rem;
     border: none;
     background: none;
     box-sizing: border-box;
     outline: none;

     img {
      min-width: 1.5rem;
      width: 65%;
      height: auto;
     }
     
     &:hover {
        cursor: pointer;
        
        .toolName {
          visibility: visible;
          opacity: 1;
        }
        
        img:not(.outline) {
          filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
        }
     }
     
     img:not(.outline)  {
       filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
     }
     
     .toolName {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0.2s, opacity 0.2s ease-in-out;
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
        z-index: 20;
     }
     
     .outline {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        outline: none;
        border: none;
        z-index: 15;
     }
`







const AnimWrapper = styled.div`
  max-width: 100%;
  display: flex;
  padding: 0;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  
  .animBoxWrap{
    display: flex;
    flex-direction: column-reverse;
    margin-right: 2rem;
    height: 10rem;
  }
`



const AnimBox = styled.div`
  min-width: 3rem;
  max-width: 3rem;
  height: 3rem;
  margin: 0.5rem 0.5rem;
    //background-color: ${props => props.color};
  background-color: #c9f4ff;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  
  &:hover {
    box-shadow: none;
    transition: box-shadow 0.1s linear;
  }

  .deleteMark{
    position: relative;
    top: 0;
    right: 0;
    width: 1.5rem;
    height: 1.5rem;
    background-color: #ff0000;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
  }
  
  .duplicateMark{
    position: absolute;
    top: 0;
    left: 0;
    width: 1.5rem;
    height: 1.5rem;
    background-color: #00ff00;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
  }
`




const OverallWrap = styled.div`
  flex-direction: column;
  margin: 0.5rem 3rem;
  overflow-x: scroll;
  max-width: 100%;

  .localTitle {
    font-size: 1rem;
    margin-bottom: 0.5rem;

  }

  .currentFrame {
    background-color: #44f504;
  }
`





const Canvas = (props) => {

    // const
    //
    // useEffect(() => {
    //     const {
    //         sendMessage,
    //         sendJsonMessage,
    //         lastMessage,
    //         lastJsonMessage,
    //         readyState,
    //         getWebSocket,
    //     } = props.ws
    // }, [props.ws])
    const [currentFrameIndex,setCurrentFrameIndex] = [props.currentFrameIndex, props.setCurrentFrameIndex]
    const [frames, setFrames] = [props.frames, props.setFrames]
    const [scale, setScale] = useState(props.scale)



    const [
        changeScale,
        sendPixels,
        drawPicture,
        drawCanvas
    ] = [
        props.changeScale,
        props.sendPixels,
        props.drawPicture,
        props.drawCanvas
    ]
    const [width, height, pixels] = [props.width, props.height, props.pixels]

    const addFrame = () =>{
        const newArray = [...props.frames, {frame:new Array(64 * 64).fill('#FFFFFF'),delay:"0.03"}]
        props.setFrames(newArray)
        props.setCurrentFrameIndex(newArray.length - 1)
        // setFrames([...frames, {"frame": new Array(64 * 64).fill('#FFFFFF'), "delay": frames[frames.length - 1]["delay"]}])
    }

    const removeFrame = (index) => {
        if (index !== 0){
            props.setCurrentFrameIndex(0)
            props.setFrames((prevState)=>prevState.filter((_, i) => i !== index))

        }

    }

    // use prevstate as don't have access to previous state here
    const duplicateFrameInPlace = (index) => {
        props.setFrames(()=>{
            let newFrames = [...props.frames]
            newFrames.splice(index + 1, 0, newFrames[index])
            return newFrames
        })
    }







    // this.debouncedWsSend(props.frames.getIn([0, 'grid']))
    //
    //
    // sendMessage = (frames) =>{
    //     console.log("sending ws request...")
    //     const {ws} = this.state
    //     if(ws !== null){
    //         try {
    //             ws.send(JSON.stringify())
    //         } catch (error) {
    //             console.log(error) // catch error
    //         }
    //     }
    //
    // }
    const debouncedFrames = useDebounce(frames, 500)
    const debouncedPixels = useDebounce(props.pixels, 600)

    useEffect(() => {
        if (props.ready && props.frames) {
            let localFrames = frames?.map((frame_) => {
                return {"frame":frame_["frame"].map(hex => {
                        let r = parseInt(hex.slice(1, 3), 16),
                            g = parseInt(hex.slice(3, 5), 16),
                            b = parseInt(hex.slice(5, 7), 16);
                        return [r, g, b];
                    }), "delay": parseFloat(frame_.delay)}
            });
            console.log("canvas.js 228")
            props.ws.sendJsonMessage({"x_auth_token":"930232a799cd6544ce7b6ac4e825bccb", "type":"preview","data":localFrames})

            // sendJsonMessage({"x_auth_token":"930232a799cd6544ce7b6ac4e825bccb", "type":"nop"})
        }
    },[debouncedFrames])

    useEffect(() => {

        const nextStateOfFrame = frames?.map((frame_, i) => {
            if (i === currentFrameIndex) {
                return {"frame":props.pixels, 'delay':frame_.delay}
            } else {
                return frame_;
            }
        });

        if(props.setFrames != null || props.setFrames !== undefined){
            props.setFrames(nextStateOfFrame)
        }
        console.log(frames)
    }, [debouncedPixels])



    useEffect(() => {
        if(frames != null || frames !== undefined){
            drawPicture(frames[currentFrameIndex]['frame'])
        }
    }, [currentFrameIndex])



    //Scale change
    useEffect(() => {
        changeScale(scale)
        sendPixels([])
    }, [scale, changeScale, sendPixels])

    // useEffect(() => {console.log(frames)}, [frames])

    //Creating default canvas
    useEffect(() => {
        // todo: implement animations -> drawPicture changes canvas image.
        // todo: drawcanvas can draw mini canvases with each frame.
        const array = new Array(width * height).fill('#FFFFFF')
        props.setFrames([{frame:[],delay:"0.03"}])
        props.setCurrentFrameIndex(0)
        drawPicture(array)
    }, [width, height, drawPicture])


    //Auto focus canvas for convenient shortcuts usage
    useEffect(() => {

        // todo: drawcanvas can draw mini canvases with each frame.
        drawCanvas(props, canvasRef.current)
        canvasRef.current.focus = true
    }, [props.pixels, drawCanvas, props])


    const onMouseDownHandler = (downEvent) => {
        props.draw(downEvent)
        refresh(props.done, props.doneAt, props.pixels)
    }

    //Undo, toolSelection handler
    const onKeyDownHandler = (event) => {
        if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault()
            undoPicture(props.done)
        } else if (!event.ctrlKey && !event.metaKey && !event.altKey) {
            switch (event.key) {
                case 'd':
                    event.preventDefault()
                    props.changeTool('draw')
                    break
                case 'f':
                    event.preventDefault()
                    props.changeTool('fill')
                    break
                case 'c':
                    event.preventDefault()
                    props.changeTool('circle')
                    break
                case 'r':
                    event.preventDefault()
                    props.changeTool('rectangle')
                    break
                case 'p':
                    event.preventDefault()
                    props.changeTool('pick')
                    break
                case 'l':
                    event.preventDefault()
                    props.changeTool('line')
                    break
                case 'j':
                    event.preventDefault()
                    props.changeTool('lighten')
                    break
                case 'k':
                    event.preventDefault()
                    props.changeTool('darken')
                    break
                default : return
            }
        }
    }

    //Changes canvas scale
    const mouseWheelHandler = (event) => {
        if (event.altKey) {
            if (scale < 15 && event.deltaY < 0) {
                setScale(props.scale + 1)
            } else if (scale > 5 && event.deltaY > 0) {
                setScale(props.scale - 1)
            }
        }
    }

    //Touch handler
    const touchEventHandler = (event) => {
        props.draw(event)
        refresh(props.done, props.doneAt, props.pixels)
    }

    return (

        <CanvasWrapper tabIndex={0} onKeyDown={e => onKeyDownHandler(e)} ws={props.ws}>
            <OverallWrap>
                <div className={"localTitle"}>
                    Frames:
                </div>
                <AnimWrapper>
                    {props.delays.map((delay, i) => {
                        return(
                            <div className={"animBoxWrap"}>
                                <AnimBox className={currentFrameIndex === i ? "currentFrame" : "" } key={i} onClick={()=>{setCurrentFrameIndex(i)}}><a>{i}</a>

                                </AnimBox>
                                <select value={delay.toString()} onChange={(e)=>{
                                        const {value} = e.target;
                                        props.changeDelay(i, value)
                                }} id="select-id">
                                    <option key="0.01" value="0.01">0.01</option>
                                    <option key="0.03" value="0.03">0.03</option>
                                    <option key="0.05" value="0.05">0.05</option>
                                    <option key="0.1" value="0.1">0.1</option>
                                    <option key="0.2" value="0.2">0.2</option>
                                    <option key="0.3" value="0.3">0.3</option>
                                    <option key="0.5" value="0.5">0.5</option>
                                    <option key="1" value="1">1</option>
                                    <option key="2" value="2">2</option>
                                    <option key="3" value="3">3</option>
                                </select>
                                <button onClick={()=>{removeFrame(i)}}>❌</button>
                                <button onClick={()=>{duplicateFrameInPlace(i)}}>📋</button>
                            </div>
                        )
                    })}
                    <LocalButton onClick={()=>{
                        addFrame()
                    }
                    }>
                        <img
                            src={Plus}
                        />
                    </LocalButton>
                </AnimWrapper>
            </OverallWrap>
            <canvas
                ref={canvasRef}
                width={props.width * props.scale}
                height={props.height * props.scale}
                onMouseDown={e => onMouseDownHandler(e)}
                onWheel={mouseWheelHandler}
                onTouchStart={e => touchEventHandler(e)}
                style={{touchAction: 'none'}}
            />
        </CanvasWrapper>
    )
}

function mapStateToProps(state) {
    return {
        width: state.canvas.width,
        height: state.canvas.height,
        pixels: state.canvas.pixels,
        scale: state.canvas.scale,
        color: state.canvas.color,
        tools: state.canvas.tools,
        done: state.canvas.done,
        doneAt: state.canvas.doneAt
    }
}

function mapDispatchToProps(dispatch) {
    return {
        drawPicture: (array) => dispatch({
            type: DRAW_PICTURE,
            payload: array
        }),
        changeScale: (scale) => dispatch({
            type: CHANGE_SCALE,
            scale
        }),
        draw: (event) => draw(event),
        changeTool: (tool) => dispatch({
            type: CHANGE_TOOL,
            payload: tool
        }),
        drawCanvas: (props, canvas) => drawCanvas(props, canvas),
        sendPixels: (pixels) => send(pixels)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);