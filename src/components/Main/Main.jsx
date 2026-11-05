import React, { useContext } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../Context/Context'
import ReactMarkdown from "react-markdown";
const Main = () => {

    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);

    return (
        <div className='main'>
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} />
            </div>

            {!showResult
                ? <>

                    <div className="greet">
                        <p><span>Hello, Ismail.</span></p>
                        <p>How can I help you today</p>
                    </div>

                    <div className="cards">
                        <div className="card">
                            <p>Suggest beautiful places for a roadtrip</p>
                            <img src={assets.compass_icon} />
                        </div>
                        <div className="card">
                            <p>Briefly summarize this concept: urban planning</p>
                            <img src={assets.bulb_icon} />
                        </div>
                        <div className="card">
                            <p>Brainstorm team bonding activities for our work retreat</p>
                            <img src={assets.message_icon} />
                        </div>
                        <div className="card">
                            <p>Improve the readablity of the following code</p>
                            <img src={assets.code_icon} />
                        </div>
                    </div>
                </>
                : <div className='result'>
                    <div className="result-title">
                        <img src={assets.user_icon} alt="" />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className="result-data">
                        <img src={assets.gemini_icon} alt="" />
                        {loading ? (
                            <p>Thinking...</p>
                        ) : (
                            <div className="markdown">
                                <ReactMarkdown>{resultData}</ReactMarkdown>
                            </div>
                        )}

                    </div>
                </div>
            }

            <div className="main-container">



                <div className="main-bottom">
                    <div className="search-box">
                        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Enter a prompt here' />
                        <div>
                            <img src={assets.gallery_icon} alt="" />
                            <img src={assets.mic_icon} alt="" />
                            {input?<img onClick={() => onSent(input)} src={assets.send_icon} alt="" />:null}
                        </div>
                    </div>
                    <p className='bottom-info'>
                        Gemini may display info, including about people, so double check if it's true
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main