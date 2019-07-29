import React from 'react';
import Spotify from '../../service/Spotify'
import mock_data from '../../mock'
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import './Tracklist.scss'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

interface Track {
  id: string;
  name: string;
  artists: any[];
  album: Album,
  selected: boolean
}

interface Album {
  images: AlbumImage[]
}

interface AlbumImage {
  height: number,
  url: string,
  width: number
}

@observer
class Tracklist extends React.Component {
  @observable topTracks: Track[] = []
  @observable error: string = ''

  componentDidMount() {
    Spotify.getTopTracks()
      .then(res => res.json())
      .then(tracksResponse => {
        console.log(tracksResponse)
        if (!tracksResponse.error) {
          console.log('tracks response', tracksResponse.items)
          this.topTracks = tracksResponse.items.map((i: {track: Track}) => i.track)
  
          // mock tracks if 0 length
          if (!tracksResponse.items.length) {
            tracksResponse.items = mock_data.items
  
            this.topTracks = tracksResponse.items.slice(0, 3).map((i: {track: Track}) => i.track)
            console.log('mocked tracks', tracksResponse.items.map((i: {track: Track}) => i.track))
          }
        } else {
          this.error = tracksResponse.error.message
        }
      })
  }

  getArtist(track: Track): string {
    return track.artists[0].name
  }

  getAlbumImage(track: Track):string {
    // get pre last image from album (moderate quality)
    return track.album.images.slice(-2)[0].url
  }

  handleTrackClick(track: Track) {
    track.selected = !track.selected
  }

  render () {
    return (
      <div className='Tracklist'>
        {this.error && <h1>{this.error}</h1>}

        {this.topTracks.map(track => {
          return (
            <Card onClick={() => this.handleTrackClick(track)} key={track.id} className={'card' + (track.selected ? ' selected' : '')}>
              <div className='details'>
                <CardContent className='content'>
                  <Typography component="h5" variant="h5">
                    {track.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {this.getArtist(track)}
                  </Typography>
                </CardContent>
              </div>
              <CardMedia
                className='cover'
                image={track.album.images.slice(-2)[0].url}
                title="Live from space album cover"
              />
            </Card>
          )
        })}
      </div>
    );
  }

}

export default Tracklist;
