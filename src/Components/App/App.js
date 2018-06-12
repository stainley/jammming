import React, { Component } from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {PlayList} from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {     
      searchResults: [{
          name: 'Tiny Dancer',
          album: 'Elton John',
          artist: 'Madman Across The Water',
          id: 1
        },
        {
          name: 'Tiny Dancer',
          album: 'Tim McGraw',
          artist: 'Love Story',
          id: 2
        }
      ],
      playListName: 'New PlayList',
      playListTracks:[{
        name: 'Stronger',
        artist: 'Britney Speaks',
        album: 'Ooops',
        id: 3
      }, {
        name: 'So Emotional',
        artist: 'Whitney Houston',
        album: 'Whitney',
        id: 4
      }, {
        name: 'Its Not Right But Its Okay',
        artist: 'Whitney Houston',
        album: 'My Love Is Your Love',
        id: 5
      }]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
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

  savePlaylist(playListTracks) {
    const trackURIs = this.state.playListTracks.map(track => track.id);
    
    Spotify.savePlaylist(this.state.playListName, trackURIs);
    this.setState({playlistName: 'New Playlist', playListTracks: [] });
    
  }

  search(term){
    console.log(term);
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
          </div>
        </div>
      </div>
    );
  }
}

export default App;

