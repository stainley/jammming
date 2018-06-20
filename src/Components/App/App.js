import React, { Component } from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {PlayList} from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';
import PlaylistSaved from '../PlaylistSaved/PlaylistSaved';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {     
      searchResults: [],
      playListName: 'New PlayList',
      playListTracks:[],
      allPlaylist: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.getPlayList = this.getPlayList.bind(this);
  }

  addTrack(track) {
    if(this.state.playListTracks.find(savedTrack => savedTrack.id === track.id)){      
      return;
    }

    this.state.playListTracks.push(track);
    this.setState({
      playListTracks: this.state.playListTracks
    });
  }

  removeTrack(track) {
    if(this.state.playListTracks.find(savedTrack => savedTrack.id === track.id)){
      return this.setState({
        playListTracks: this.state.playListTracks.filter(rmtrack => rmtrack.id !== track.id)
      });
    }
  }

  updatePlaylistName(name) {
    this.setState({
      playListName: name
    });
  }

  savePlaylist() {
    const trackURIs = this.state.playListTracks.map(track => track.id);    
    Spotify.savePlaylist(this.state.playListName, trackURIs);
    this.setState({playlistName: 'New Playlist', playListTracks: [] });
    this.getPlayList();
  }

  search(term){  
    
    if(term !== ''){
        Spotify.search(term).then(results => {                  
        this.setState({        
          searchResults: results
        });
      });  

      this.getPlayList();
    }else{
      this.setState({
        searchResults: []
      });
    }
  }

  getPlayList(){
    Spotify.getPlaylists().then(playlist => {
        this.setState({
          allPlaylist: playlist
        });        
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className='App'>
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />            
            <PlayList playListName={this.state.playListName} playListTracks={this.state.playListTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
            <PlaylistSaved allPlaylist={this.state.allPlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

