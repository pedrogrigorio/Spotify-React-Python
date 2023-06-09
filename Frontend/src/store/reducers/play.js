const INITIAL_STATE = {

    isPlaying: false,
    settingSong: false,
    songData : {trackData : null},
    songMetaData : {
        title: "", 
        artist: "", 
        img: "", 
        id: null
    },
    playlist: null,
    songIndex: 0,
} 

export default function play(state = INITIAL_STATE, action) {

    if (action.type === 'SET_SONG_META_DATA') {
        return {
            ...state,
            settingSong: true,
            songMetaData: {
                title: action.title, 
                artist: action.artist,
                img: action.image, 
                id: action.index
            }
        }
    }

    else if (action.type === 'SET_SONG_TRACK') {
        return {
            ...state,
            songData: {
                trackData: action.trackData
            }
        }
    }
    
    else if (action.type === 'SET_IS_PLAYING') {
        return {
            ...state,
            isPlaying: action.status,
        }
    }

    else if (action.type === 'CLEAR_SETTING_SONG') {
        return {
            ...state,
            settingSong: false
        }
    }

    else if (action.type === 'SET_PLAYLIST') {
        return {
            ...state,
            playlist: action.playlist
        }
    }

    else if (action.type === 'SET_SONG_INDEX') {
        return {
            ...state,
            songIndex: action.index
        }
    }

    else if (action.type === 'SET_SETTING_SONG') {
        return {
            ...state,
            settingSong: state.status
        }
    }
    
    return state 
}