
import axios from 'axios';
import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import { withAuth0 } from '@auth0/auth0-react';

class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      errorMessage: '',
      selectedGenre: '',
      games: [],
      filteredGames: [],
      savedGames: {}
    }
  }

  
  //** Handles Game(s) Loading on GamePage on page Load */
  handleGameLoad = async (event) => {
    try {
      if (this.props.auth0.isAuthenticated) {
        const response = await this.props.auth0.getIdTokenClaims();

        const jwt = response.__raw;

        const config = {
          headers: { "Authorization": `Bearer ${jwt}` },
          method: 'get',
          baseURL: process.env.REACT_APP_SERVER,
          url: '/games'
        }

        let gameData = await axios(config);

        this.setState({
          games: gameData.data,
          filteredGames: gameData.data,
          error: false
        });
      }

    } catch (error) {
      this.setState({
        error: true,
        errorMessage: error.message
      });
    }
  }

  //** Save game based off the click of SAVE button on card */
  handleSaveGame = async (gameObj) => {
    try {
      if (this.props.auth0.isAuthenticated) {
        const response = await this.props.auth0.getIdTokenClaims();

        const jwt = response.__raw;

        const config = {
          headers: { "Authorization": `Bearer ${jwt}` },
          method: 'post', 
          baseURL: process.env.REACT_APP_SERVER,
          url: '/games',
          data: gameObj
        }

        await axios(config);

        this.setState({
          error: false
        });

      }
    } catch (error) {
      this.setState({
        error: true,
        errorMessage: error.message
      });
    }
  }
  
  //** Allows users to filter games based off genres provided by Game API */
  handleGenreSelected = (event) => {
    if (event.target.value === 'View Games by Genre') {
      let allRender = this.state.games.filter(e => e.title.length > 0);
      
      this.setState({
        filteredGames: allRender
      })
    } else {
      let selectedGenre = event.target.value;
  
      let genreData = this.state.games.filter(g => g.genre.toLowerCase() === selectedGenre.toLowerCase());
     
      this.setState({
        filteredGames: genreData
      })
    }


  }

  //** React Lifecycle to engage game load on page load after auth */
  componentDidMount() {
    this.handleGameLoad();

  }

  render() {

    return (
      <>
        <Form>
          <Form.Group >
            <Form.Select name='select' onChange={this.handleGenreSelected}>
              <option value="View Games by Genre">View Games by Genre</option>
              <option value="2d">2d</option>
              <option value="3d">3d</option>
              <option value="action">Action</option>
              <option value="action-rpg">Action-rpg</option>
              <option value="anime">Anime</option>
              <option value="battle-royale">Battle-Royale</option>
              <option value="card">Card</option>
              <option value="fantasy">Fantasy</option>
              <option value="fighting">Fighting</option>
              <option value="first-person">First-Person</option>
              <option value="flight">Flight</option>
              <option value="horror">Horror</option>
              <option value="low-spec">Low-Spec</option>
              <option value="martial-arts">Martial-Arts</option>
              <option value="military">Military</option>
              <option value="mmo">MMO</option>
              <option value="mmofps">MMOFPS</option>
              <option value="mmorpg">MMORPG</option>
              <option value="mmorts">MMORTS</option>
              <option value="mmotps">MMOTPS</option>
              <option value="moba">MOBA</option>
              <option value="open-world">Open-World</option>
              <option value="permadeath">Permadeath</option>
              <option value="pixel">Pixel</option>
              <option value="pve">PVE</option>
              <option value="pvp">PVP</option>
              <option value="racing">Sports</option>
              <option value="sailing">Sailing</option>
              <option value="sandbox">Sandbox</option>
              <option value="sci-fi">Sci-fi</option>
              <option value="shooter">Shooter</option>
              <option value="side-scroller">Side-Scroller</option>
              <option value="social">Social</option>
              <option value="space">Space</option>
              <option value="strategy">Strategy</option>
              <option value="superhero">Superhero</option>
              <option value="survival">Survival</option>
              <option value="tank">Tank</option>
              <option value="third-Person">Third-Person</option>
              <option value="top-down">Top-down</option>
              <option value="tower-defense">Tower-Defense</option>
              <option value="turn-based">Turn-Based</option>
              <option value="voxel">Voxel</option>
              <option value="zombies">Zombies</option>
            </Form.Select>
          </Form.Group>
        </Form>

        <Container className='gameCards'>

          {this.state.filteredGames.map((game) =>
            <Card key={game.id} style={{ width: '20rem' }}>
              <Card.Img variant="top" src={game.thumbnail} alt={game.short_description} />
              <Card.Body>
                <Card.Title>{game.title}</Card.Title>
                <Card.Text>
                  {game.short_description}

                </Card.Text>
                <Card.Link style={{ display: 'flex', justifyContent: 'center' }} href={game.freetogame_profile_url} target="_blank">Game Link</Card.Link>
                <ListGroup variant="flush">
                  <ListGroup.Item>Genre: {game.genre}</ListGroup.Item>
                </ListGroup>

                <button style={{ display: 'block', margin: 'auto' }} onClick={() => { this.handleSaveGame(game) }} className="nes-btn is-success">SAVE</button>


              </Card.Body>
            </Card>
          )}

        </Container>

      </>
    );
  }
}

export default withAuth0(GamePage);
