const clientId = 'e5216b6891154d1583bc32e8f19a80b9';
let userAccessToken = '';


const Spotify = {

    getAccessToken() {
        if (userAccessToken) {
            return userAccessToken;
        } else if (window.location.href.match(/access_token=([^&]*)/) != null) {
            userAccessToken = window.location.href.match(/access_token=([^&]*)/)[0].split("=")[1];
            let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].split("=")[1];
            window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        } else {
            const authUri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=http://localhost:3000`;
            window.location = authUri;
        }
    },

    search(term) {
        this.getAccessToken();
        
        if(term !== ''){
                    
        let url = `https://api.spotify.com/v1/search?type=track&q=${term}`;

        return fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userAccessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (jsonResponse.tracks) {
                return jsonResponse.tracks.items.map(track => {
                    return {
                        id: track.id,
                        artist: track.artists[0].name,
                        name: track.name,
                        album: track.album.name,
                        URI: track.uri
                    }
                });
            }
        });
        }
    },

    savePlaylist(playlistName, trackURIs) {
        this.getAccessToken();
        let userId, playlistId;

        try {
            let headers = {
                'Authorization': 'Bearer ' + userAccessToken
            };
            let urlUserInfo = 'https://api.spotify.com/v1/me';
                        
            return fetch(urlUserInfo, {
                    method: 'GET',
                    headers: headers
                })
                .then(response => {
                    return response.json()
                })
                .then(jsonResponse => {
                    userId = jsonResponse.id;
                })
                // post a new playlist
                .then(() => {
                    fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify({
                                name: playlistName
                            }),
                            json: true
                        })
                        .then(response => {
                            return response.json()
                        })
                        .then(jsonResponse => {
                            playlistId = jsonResponse.id;
                        })
                        // post track URIs
                        .then(() => {
                            fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                                    method: 'POST',
                                    headers: headers,
                                    body: JSON.stringify({
                                        uris: trackURIs
                                    }),
                                    json: true
                                })
                                .then(response => {
                                    return response.json()
                                })
                                .then(jsonResponse => {
                                    playlistId = jsonResponse.id;
                                })
                        })
                });
        } catch (error) {
            console.log(error);
        }
    },

    getPlaylists() {        
        const urlPlaylist = `https://api.spotify.com/v1/me/playlists`;
        let headers = {
            'Authorization': 'Bearer ' + userAccessToken
        };

        return fetch(urlPlaylist, {
            method: 'GET',
            headers: headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            return jsonResponse.items.map(playlist => {
                return {
                    name: playlist.name,
                    id: playlist.id
                }
            });
        });
    }
};

export default Spotify;