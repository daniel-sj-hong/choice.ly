import React from 'react';
import Header from '../components/header';
import ReactStars from 'react-rating-stars-component';

export default class Favorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      isModalOn: false
    };
    this.toggleOn = this.toggleOn.bind(this);
    this.toggleOff = this.toggleOff.bind(this);
  }

  componentDidMount() {
    fetch('/api/favorites', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.setState({ favorites: result });
      });
  }

  toggleOn() {
    this.setState({ isModalOn: true });
  }

  toggleOff() {
    this.setState({ isModalOn: false });
  }

  render() {
    let hideBG = '';
    let hideModal = '';
    if (!this.state.isModalOn) {
      hideBG = 'hidden';
      hideModal = 'hidden';
    }
    return (
      <>
        <Header />
        <div className="row justify-center">
          <h2 className="favorites-text">Favorites</h2>
        </div>

        <div className={`modal-background absolute ${hideBG}`}></div>
        <div className={`modal-container absolute ${hideModal}`}>

          <div className="row col-90 white-background center-all border-radius margin-top-10">
            <div className="row padding-tb10">
              <div className="col-20 flex center-all">
                <div className="flex center-all">
                  <img className="image-size-adjust border-radius" src="" alt="placeholder" />
                </div>
              </div>
              <div className="col-80 center-all">
                <div className="row">
                  Restaurant Name
                </div>
                <div className="row">
                  <div className="col-one-thirds"><ReactStars value={5} edit={false} isHalf={true} /></div>
                  <div className="col-one-thirds">5 reviews</div>
                  <div className="col-one-thirds">$$</div>
                </div>
                <div className="row overflow">
                  123 learingfuze, irvine ca 11111
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-end col-90 margin-bottom-6">
            <button onClick={this.toggleOff} className="close-button">Close</button>
          </div>

        </div>

        <div className="container search-results-container restrict-height">
          <ul className="row justify-center">
            {
              this.state.favorites.map(restaurant =>
                <li className="col-90" key={restaurant.details.id}>
                  <a href={`#details?alias=${restaurant.details.alias}`}>
                  <div className="row padding-tb10">
                    <div className="col-20 flex center-all">
                      <div className="flex center-all">
                        <img className="image-size-adjust border-radius" src={restaurant.details.image_url} />
                      </div>
                    </div>
                    <div className="col-80 center-all">
                      <div className="row">
                        {restaurant.details.name}
                      </div>
                      <div className="row">
                        <div className="col-one-thirds"><ReactStars value={restaurant.details.rating} edit={false} isHalf={true} /></div>
                        <div className="col-one-thirds">{restaurant.details.review_count} reviews</div>
                        <div className="col-one-thirds">{restaurant.details.price}</div>
                      </div>
                      <div className="row overflow">
                        {`${restaurant.details.location.address1}, ${restaurant.details.location.city}, ${restaurant.details.location.state} ${restaurant.details.location.zip_code}`}
                      </div>
                    </div>
                  </div>
                  </a>
                </li>
              )
            }
          </ul>
        </div>
        <div className="row justify-center">
          <button onClick={this.toggleOn} className="randomize-button">Randomize</button>
        </div>
      </>
    );
  }
}
