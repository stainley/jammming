const clientId = 'e5216b6891154d1583bc32e8f19a80b9';
let userAccessToken = '';


const Spotify = {

    getAccessToken() {
        if(userAccessToken) {
            return userAccessToken;
        }else if (window.location.href.match(/access_token=([^&]*)/) != null) {
            userAccessToken = window.location.href.match(/access_token=([^&]*)/)[0].split("=")[1];
            let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].split("=")[1];
            window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        }else {
            const authUri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=http://localhost:3000`;            
            window.location = authUri;
        }
    },

    search(term) {
        this.getAccessToken();

        let url = `https://api.spotify.com/v1/search?type=track&q=${term}`;

        return fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${userAccessToken}`
                }
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if(jsonResponse.tracks){
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
    },

    savePlaylist(name, tracks){
        this.getAccessToken();             
        
        try{
            let headers = { 'Authorization': 'Bearer ' + userAccessToken };
            let urlUserInfo = 'https://api.spotify.com/v1/me';
            let response = fetch(urlUserInfo, { headers: headers });
            
            if(response.ok){
                
                let userInfo = response.json();

                const urlPlaylist = `https://api.spotify.com/v1/users/${userInfo.id}/playlists`;

                alert(urlPlaylist);

                response = fetch(urlPlaylist, {
                    method: 'POST',
                    headers: {headers, 'Content-Type': 'application/json' },
                    body: JSON.stringify({name: name})
                });
                 
                let playlistInfo = response.json();

                console.log(playlistInfo);

                let playlistId = playlistInfo.id;
                const urlPlaylistTracks = `https://api.spotify.com/v1/users/${userInfo.id}/playlists/${playlistId}/tracks`;
                response = fetch(urlPlaylistTracks, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ uris: tracks })
                });
            }

        }catch(error){
            console.log(error);
        }
    }    
};



export default Spotify;