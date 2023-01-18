import React, {useCallback, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {motion} from 'framer-motion'
import useWebSocket from "react-use-websocket";


const GalleryWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  min-width: 70%;
  min-height: 20%;
  height: 13rem;
  
  button{
    margin-top: 1rem;
    width: 8rem;
    min-height: 2rem;
  };
  #search {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: auto;
    min-width: 60%;
    max-width: 80rem;

    //height: 12em;
    background: rgba(227, 245, 241, 0.85);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    
    >input {
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      box-sizing: border-box;
      padding: 0 4%;
      font-size: 1.6vw;
      width: 94%;
      height: 60%;
      border: none;
      background: #FFFFFF;
      //box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.25);
      outline: none;
    }

  }
  #gif-download-form {
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
    
    >input {
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      box-sizing: border-box;
      padding: 0 4%;
      font-size: 1.6vw;
      width: 15rem;
      height: 2.5rem;
      border-radius: 4px;
      border: none;
      background: #FFFFFF;
      box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.25);
      outline: none;
    }
  }
  
  label{
    margin-top:0.5rem;
  }
  
  .selectFilterContainer {
    display: flex;
    justify-content: space-between;
    width: 50%;
    margin: 1em 0;
  }
  
  .selectorWrapper, .filterWrapper {
    height: 3vw;
    width: 45%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .Select-container {
    width: 40%;
  } 
  
  .Select__control {
    min-height: 0.5em;
    display: flex;
    justify-content: space-around;
    height: 100%;
    border: none;
    background: rgba(227, 245, 241, 0.85);
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
      transition: box-shadow 0.2s linear;
    }
  }
  
  .Select__value-container {
    display: flex;
    justify-content: center;
    align-content: center;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 18px;
  }
  
  .Select__placeholder {
    color: #000000;
    font-size: 1vw;
    margin-left: 0.5em;
  }
  
  .Select__indicator {
    padding: 0;
  }
  
  .Select__indicator-separator {
    display: none;
  }
  
  .Select__menu {
    background: rgba(227, 245, 241, 0.85);
  }
  
  .Select__option {
    text-align: center;
    cursor: pointer;
    font-size: 1.8vh; 
    
    &:hover {
      text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    }
  }
  
  .Select__indicator {
    color: #000000;
  }
  
  .Select__input {
    color: transparent;
  }
  
  .filterWrapper button {
    background: rgba(227, 245, 241, 0.85);
    border: none;
    outline: none;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    width: 40%;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    font-size: 1vw;
    cursor: pointer;
    
    &:hover {
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
      transition: box-shadow 0.2s linear;
    }
    
    &:active {
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.25);
    }
  }
  
  .scrollUp {
    font-weight: bold;
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
    
    &:hover {
      color: white;
      transition: color 0.1s linear;
    }
  }

  .fancyLabel{
    margin-bottom: 1.5rem;
    font-weight: bold;
  }
  button{
    margin-top: 1rem;
    width: 8rem;
    height: 2rem;
  };
  #select-id{
    max-width: 12rem;
    font-size: 1.5rem;
  }
`

const GalleryImages = styled.div`
  margin-top: 2%;
  padding-bottom: 1em;
  width: 80%;
  display: grid;
  grid-template-columns: repeat(4, 20vh);
  grid-template-rows: repeat(3, 22vh);
  grid-column-gap: 3.5vh;
  grid-row-gap: 4vh;
  justify-content: center;
  align-items: center;
  overflow-clip: true;
`

const Gallery = props => {

    const [searchValue, setSearchValue] = useState('')
    const [pickedImage, setPickedImage] = useState("naimah_gif")
    const [checkBoxVal, setCheckBoxVal] = useState(true)
    const [availableImages, setAvailableImages] = useState(["naimah_gif"])

    const onChangeCheck = e => {
        setCheckBoxVal(e.target.checked)
    }


    useEffect(() => {
        console.log(props.ready)
        if (props.ready) {
            console.log("gallery.js 231")
            props.ws.sendJsonMessage({
                "x_auth_token": "930232a799cd6544ce7b6ac4e825bccb",
                "type": "list_drawings"
            })
        }

        const interval = setInterval(() => {
            console.log(props.ready)
            if (props.ready) {
                console.log("gallery.js 239")
                props.ws.sendJsonMessage({
                    "x_auth_token": "930232a799cd6544ce7b6ac4e825bccb",
                    "type": "list_drawings"
                })
            }
        }, 30000);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    useEffect(() => {
        if (props.ready) {
            if (props.ws.lastJsonMessage != null) {
                setAvailableImages(props.ws.lastJsonMessage)
            }
        }
    },[props?.ws?.lastJsonMessage])



    const onLoadSubmit = e => {
        e.preventDefault()
        if(props.ready){
            console.log("gallery.js 264")
            props.ws.sendJsonMessage({"x_auth_token": "930232a799cd6544ce7b6ac4e825bccb", "type": "draw_def", "draw_id": pickedImage, "loop_frames": checkBoxVal})
        }

    }

    const onGifSubmit = e => {
        e.preventDefault()

        if(props.ready){
            console.log("gallery.js 273")
            props.ws.sendJsonMessage({"x_auth_token": "930232a799cd6544ce7b6ac4e825bccb", "type": "save_gif", "gif_url": searchValue})
        }

    }


    const submitRef = useRef(null)
    const submitRef2 = useRef(null)

    return (
        <>
            <GalleryWrapper>

                <form id='search' onSubmit={onLoadSubmit}>
                    <label className={"fancyLabel"}>Load a previous image/ GIF.</label>
                    <select value={pickedImage} onChange={(e)=>{ const {value} = e.target; setPickedImage(value)}} id="select-id">
                        {availableImages.map((imageName) => {return <option key={imageName} value={imageName}>{imageName}</option>})}
                    </select>

                    <label>Loop frames?<br></br>
                        <input type="checkbox" onChange={onChangeCheck} defaultChecked={true}/>
                    </label>
                    <button type='submit' ref={submitRef}>Let{"'"}s go!</button>
                    <br/>
                </form>
            </GalleryWrapper>

            <GalleryWrapper>
                <form id='gif-download-form' onSubmit={onGifSubmit}>
                    <label className={"fancyLabel"}>Download a GIF.</label>
                    <input type='text' placeholder='Enter the URL for the GIF.' value={searchValue} onChange={(e) => { const { value } = e.target; setSearchValue(value) }} />
                    <button type='submit' ref={submitRef2}>Download GIF</button>
                </form>
            </GalleryWrapper>
        </>
    )
}

export default Gallery;