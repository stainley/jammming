import React from 'react';

class PlaylistSaved extends React.Component {

    render() {
        return(
            <div className="Playlist">
                <h2>Saved Playlist</h2>
                {this.props.allPlaylist.map(playlists => {
                    return <h3 key={playlists.id}>{playlists.name}</h3>
                })}
            </div>
        );
    }
}

export default PlaylistSaved;