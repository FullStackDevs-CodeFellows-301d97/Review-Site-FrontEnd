import React from "react";
import { withAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Container, Form, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userGames: [],
      error: false,
      errorMessage: '',
      showForm: false,
      showModal: false,
      gameToUpdate: null
    }
  }

  //** Modal Handlers for show/hide */
  handleCloseModal = () => {
    this.setState({
      showModal: false
    });
  }

  handleOpenModal = () => {
    this.setState({
      showModal: true,

    })
  }


  //** Retrieves User's saved game from MongoDB */
  getUserGames = async () => {
    try {
      if (this.props.auth0.isAuthenticated) {
        const response = await this.props.auth0.getIdTokenClaims();

        const jwt = response.__raw;


        const config = {
          headers: { "Authorization": `Bearer ${jwt}` },
          method: 'get', 
          baseURL: process.env.REACT_APP_SERVER,
          url: '/myGames'
        }
        let gameData = await axios(config);



        this.setState({
          userGames: gameData.data,
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
//** Delete a user saved game via button */
  deleteGame = async (id) => {
    try {
      if (this.props.auth0.isAuthenticated) {
        const response = await this.props.auth0.getIdTokenClaims();

        const jwt = response.__raw;


        const config = {
          headers: { "Authorization": `Bearer ${jwt}` },
          method: 'delete',
          baseURL: process.env.REACT_APP_SERVER,
          url: `/games/${id}`

        }
        await axios(config);
        let updatedGames = this.state.userGames.filter(game => game._id !== id); // added

        console.log('Is the delete firing?')

        this.setState({
          userGames: updatedGames,    // added
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

  handleGameSubmit = (event) => { // taken from UpdateBookForm.js which had it's own class "UpdateBookForm", handler called handleBookSubmit, and handler variable "bookToUpdate"
    event.preventDefault();
  
    let gameToUpdate = {
      title: event.target.title.value,
      play_status: event.target.play_status.value,
      reviewNotes: event.target.reviewNotes.value,
      _id: this.props.game._id,
      _v: this.props.game._v
    }
    console.log(gameToUpdate);
    this.props.updateGame(gameToUpdate);
  }

  // handleGameSubmit = (event) => { // taken from BestBooks.js, which had the BestBooks class, same handler name called handleBookSubmit, and handler varible "bookObj"
  //   event.preventDefault();
  
  //   let gameObj = {
  //     title: event.target.title.value,
  //     play_status: event.target.play_status.value,
  //     reviewNotes: event.target.reviewNotes.value,
  //   }
  //   console.log(gameObj);
  //   this.postGame(gameObj);
  //   this.props.closeModal;
  // }


  postGame = async (gameToUpdate) => {
    try {
      let url = `${process.env.REACT_APP_SERVER}/games`    // get is /games, get is also myGames, delete is games/gameID, post is /games, put is gameID
      let createdReview = await axios.post(url, gameToUpdate)

      this.setState({
        games: [...this.state.games, createdReview.data],
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  updateGame = async (gameObjToUpdate) => {
    try {
      let url = `${process.env.REACT_APP_SERVER}/games/${gameObjToUpdate._id}`

      let updatedGame = await axios.put(url, gameObjToUpdate)

      let updatedGameArray = this.state.games.map(existingGame => {
        return existingGame._id === gameObjToUpdate._id
        ? updatedGame.data
        : existingGame
      })

      this.setState({
        games: updatedGameArray,
        showModal: true
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  closeModal = () => {
    this.setState({
      showForm: false
    })
  }


  //** React lifecycle to pull user game to home page on load */
  componentDidMount() {
    this.getUserGames();

  }

  render() {
    return (
      <>
        <Container className='gameCards'>

          {this.state.userGames.map((game) =>
            <Card key={game._id} style={{ width: '18rem' }}>
              <Card.Img variant="top" src={game.thumbnail} />
              <Card.Body>
                <Card.Title>{game.title}</Card.Title>
                <Card.Text>
                  {game.short_description}
                </Card.Text>
                <Card.Link style={{display: 'flex', justifyContent: 'center'}} href={game.freetogame_profile_url}>Game Link</Card.Link>
                <ListGroup variant="flush">
                  <ListGroup.Item>Genre: {game.genre}</ListGroup.Item>
                </ListGroup>
                <Button  variant="info" onClick = {() => { this.updateGame(game._id) }}>Write A Review</Button>
                <Button  variant="danger" onClick = {() => { this.deleteGame(game._id) }}>Delete Game</Button>
                {/* <Button onClick={() => { this.setState({showForm: true, gameToUpdate: game}) }}>Open Update Form</Button> */}
              </Card.Body>
            </Card>
          )}

        </Container>


{/* render() {
  return {
  { this.props.game ?
      <Modal show={this.props.show} onHide={this.props.onHide}>

        <Modal.Header closeButton><Modal.Title>game title</Modal.Title></Modal.Header>

        <Container className="mt-5">

          <Form onSubmit={this.handleGameSubmit}>
            <Form.Group controlID="title" className="mb-3" disabled>
              <Form.Label>Game Title</Form.Label>
              <Form.Control id="disabledTextInput" placeholder="Disabled input"type="text" defaultValue={this.props.game.title} />
            </Form.Group>

            <Form.Group controlId="playStatus">
              <Form.Label>Play Status</Form.Label>
              <Form.Control type="checkbox" defaultValue={this.props.game.playStatus} />
            </Form.Group>

            <Form.Group controlId="reviewNotes">
              <Form.Label>Game Review/Notes</Form.Label>
              <Form.Control type="text" defaultValue={this.props.reviewNotes} />
            </Form.Group>

            <Button type="submit">Update Game Notes</Button>
          </Form>
        </Container>
      </Modal>
      : null
  }
};
} */}


        
      </>
    )
  }
}

export default withAuth0(UserHome);






// After the last Card, but within the Container:

// {this.props.showModal ? <GameModal show={this.props.openModal} onHide={this.props.closeModal} handleBookSubmit={this.handleGameSubmit} /> : <Button onClick={this.props.openModal}>Add Game Review</Button>}
              
// <UpdateGameForm 
//         show={this.state.showForm}
//         onHide={this.closeModal}
//         game={this.state.gameToUpdate}
//         updateGame={this.updateGame}
//         />