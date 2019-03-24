import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Moment from 'react-moment';
import Spinner from '../layout/Spinner';

const getUrl = (api, id) => {
  const url = {
    cors: `https://cors-anywhere.herokuapp.com`,
    baseUrl: `https://api.musixmatch.com/ws/1.1`,
    endPoint: `${api}?track_id=${id}&apikey=${process.env.REACT_APP_MM_KEY}`,
  };
  return `${url.cors}/${url.baseUrl}/${url.endPoint}`;
};

class Lyrics extends Component {
  state = {
    track: {},
    lyrics: {},
  };

  componentDidMount () {
    const trackId = this.props.match.params.track_id;
    axios
      .get (getUrl ('track.lyrics.get', trackId))
      .then (res => {
        this.setState ({lyrics: res.data.message.body.lyrics});
        return axios.get (getUrl ('track.get', trackId));
      })
      .then (res => {
        this.setState ({track: res.data.message.body.track});
      })
      .catch (err => console.log (err));
  }

  render () {
    const {track, lyrics} = this.state;
    if (
      track === undefined ||
      lyrics === undefined ||
      Object.keys (track).length === 0 ||
      Object.keys (lyrics).length === 0
    ) {
      return <Spinner />;
    } else {
      return (
        <React.Fragment>
          <Link to="/" className="btn btn-dark btn-sm mb-4">
            Go Back
          </Link>
          <div className="card">
            <h5 className="card-header">
                {track.track_name} by <span className="text-secondary">{track.artist_name}</span>
            </h5>
            <div className="card-body">
                <p className="card-text">{lyrics.lyrics_body}</p>
            </div>
          </div>

          <ul className="list-group mt-3">
            <li className="list-group-item">
                <strong>Album ID</strong>: {track.album_id}
            </li>
            <li className="list-group-item">
            {console.log(track)}
                <strong>Song Genre</strong>: {track.primary_genres.music_genre_list.length > 0 ? track.primary_genres.music_genre_list[0].music_genre.music_genre_name : '~ Not Available ~'}
            </li>
            <li className="list-group-item">
                <strong>Explicit Words</strong>: {track.explicit === 0 ? 'No' : 'Yes'}
            </li>
            <li className="list-group-item">
            <strong>{track.first_release_date ? 'Release Date' : 'Updated On'}</strong>: {track.first_release_date ? <Moment format="MMMM D, YYYY">{track.first_release_date}</Moment> : <Moment format="MMMM D, YYYY">{track.updated_time}</Moment>}
            </li>

          </ul>
        </React.Fragment>
      );
    }
  }
}

export default Lyrics;
