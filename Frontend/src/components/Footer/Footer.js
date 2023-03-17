import React, { useRef, useEffect, useState } from 'react';
import FooterLeft from './FooterLeft';
import FooterRight from './FooterRight';
import MusicControlBox from './player/MusicControl';
import MusicProgressBar from './player/ProgressBar';
import Audio from './Audio'
import styles from "./Styles/Footer.module.css";
import useWindowSize from '../hooks/WindowSize';




export default function Footer(props) {
    
    const audioRef = useRef(null)
    const size = useWindowSize();
    const [volume, setVolume] = useState(1)
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    const handleTrackClick = (position) => {
        audioRef.current.currentTime = position
    }

    useEffect(() => {
        if(isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [audioRef, isPlaying])

    useEffect(() => {
        audioRef.current.volume = volume
    }, [audioRef,volume])


    // Terminar de passar a informações para progressbar e MusicControlBox
    return (
        <div className={styles.footer}>
            <div className={styles.nowplayingbar}>
                <FooterLeft 
                    img={props.img}
                    title={props.title}
                    artist={props.artist}
                />
                <div className={styles.footerMid}>
                    <MusicControlBox 
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                    />
                    <MusicProgressBar
                        currentTime={currentTime}
                        duration={duration}
                        handleTrackClick={handleTrackClick}
                    />  
                    <Audio
                        ref={audioRef}
                        handleDuration={setDuration}
                        handleCurrentTime={setCurrentTime}
                        trackData={props.trackData}

                    />
                </div>
                {
                    size.width > 640 &&
                    <FooterRight
                        volume={volume}
                        setVolume={setVolume}
                    />
                }
            </div>
        </div>
    )
}