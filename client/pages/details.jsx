import React from 'react';
import Header from '../components/header';
import ReactStars from 'react-rating-stars-component';
import { format, parse } from 'date-fns';

export default class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      reviews: [],
      searchResults: [],
      isFavorite: false
    };
    this.toggleOn = this.toggleOn.bind(this);
  }

  toggleOn() {
    if (this.state.isFavorite === false) {
      fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          details: this.state.searchResults,
          alias: this.state.searchResults.alias
        })
      })
        .then(response => response.json())
        .then(result => {
          this.setState({ isFavorite: true });
        });
    } else {
      fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ alias: this.state.searchResults.alias })
      })
        .then(result => {
          this.setState({ isFavorite: false });
        });
    }
  }

  componentDidMount() {
    Promise.all([
      fetch(`/api/reviews?${this.props.params.toString()}`).then(response => response.json()),
      fetch(`/api/business?${this.props.params.toString()}`).then(response => response.json())
    ])
      .then(([comments, restaurants]) => {
        this.setState({
          isLoading: false,
          reviews: comments,
          searchResults: restaurants
        });
      })
      .then(
        fetch(`/api/getFavs?${this.props.params.toString()}`)
          .then(response => response.json())
          .then(result => {
            if (result.length > 0) {
              this.setState({ isFavorite: true });
            }
          })
      );
  }

  render() {
    if (this.state.isLoading) return null;
    return (
      <>
        <Header />
        <div className="container search-results-container restrict-height margin-top-20">
          <div className="row">
            <div className="col-full flex justify-center">
              <h1>{this.state.searchResults.name}</h1>
            </div>
          </div>
          <div className="row justify-center">
            <div className="col-one-thirds flex center-all">
              <img className="details-image-size center-all" src={this.state.searchResults.image_url} />
            </div>
            <div className="col-two-thirds">
              <div className="row">
                <div className="col-two-thirds flex center-all margin-bottom-4">
                  <ReactStars size={30} value={this.state.searchResults.rating} edit={false} isHalf={true} />
                </div>
                <div className="col-one-thirds flex center-all">
                  <p className="review-count font-adjust-3">
                    {this.state.searchResults.review_count} reviews
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-full flex center-all">
                  <p className="font-adjust font-bold">
                    {`${this.state.searchResults.location.address1}, ${this.state.searchResults.location.city}, ${this.state.searchResults.location.state} ${this.state.searchResults.location.zip_code}`}
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col-one-thirds flex center-all font-bold font-adjust">
                  {this.state.searchResults.price}
                </div>
                <div className="col-one-thirds flex center-all font-bold font-adjust-2">
                  {this.state.searchResults.display_phone}
                </div>
                <div className="col-one-thirds flex center-all">
                  <i onClick={this.toggleOn} className={this.state.isFavorite ? 'fas fa-heart heart-icon' : 'far fa-heart heart-icon'}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-full">
              <h2 className="margin-lb">Reviews</h2>
            </div>
          </div>
          <div className="row">
            <ul className="row justify-center">
              {
                this.state.reviews.map(comments =>
                  <li className="col-90" key={comments.id}>
                    <div className="row">
                      <div className="col-one-thirds flex center-all">
                        <p>{comments.user.name}</p>
                      </div>
                      <div className="col-one-thirds flex center-all">
                        <ReactStars size={15} value={comments.rating} edit={false} isHalf={true} />
                      </div>
                      <div className="col-one-thirds flex center-all">
                        <p>{format(parse(comments.time_created, 'yyyy-MM-dd HH:mm:ss', new Date()), 'MM/dd/yyyy')}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-full flex center-all padding-lr margin-bottom-4">
                        {comments.text}
                      </div>
                    </div>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </>
    );
  }
}
