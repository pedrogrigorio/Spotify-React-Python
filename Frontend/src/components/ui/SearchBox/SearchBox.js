import { useState } from 'react'
import { connect } from 'react-redux'
import { searchEngine } from "../../../services/pytube"
import * as SearchActions from '../../../store/actions/search'
import Search from '../../icons/Search'
import styles from './SearchBox.module.css'

function SearchBox({setSearchData, clearOldRequests}) {

    const[searchContent, setSearchContent] = useState('')

    async function handleKeyDown(event){
        if(event.key === "Enter"){
            clearOldRequests()
            const data = (await searchEngine(searchContent)).data
            data.map((song) => {
                setSearchData(song.title, song.img, song.link)
            })
        }
    }

    return (
        <div className={styles.SeachBox}>
            <Search size={22} searchBox={true} />
            <input 
            placeholder="O que você quer ouvir?" 
            maxLength="80" 
            onChange={(event) => {setSearchContent(event.target.value)}}
            onKeyDown={handleKeyDown}
        />
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    setSearchData: (title, img, link) => dispatch(SearchActions.setSearchData(title, img, link)),
    clearOldRequests: () => dispatch(SearchActions.clearOldRequests())
})

export default connect(null, mapDispatchToProps)(SearchBox);

