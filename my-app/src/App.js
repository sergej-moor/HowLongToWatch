import logo from "./logo.svg";
import "./App.css";
import React from "react";

const apiKey = "165b95d20e6002e804d1c5bcbf447d24";

function App() {
  return (
    <div className="App">
      <a href="" id="sitename">
        HowLongToWatch
      </a>
      <InputField />

      <p id="bottominfo">
        Copyright © 2022 Sergej Moor, except TV show data and artwork.
        <br></br>TV show data provided by The Movie Database (TMDB). This product uses the
        TMDB API but is not endorsed or certified by TMDB
      </p>
    </div>
  );
}

class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      submit: "",
      inputSubmitted: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      input: event.target.value,
      inputSubmitted: false,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      submit: this.state.input,
      inputSubmitted: true,
    });
  }

  render() {
    return (
      <div>
        <p id="question"> How long does it take to watch:</p>
        <form class="mainform" onSubmit={this.handleSubmit}>
          <input
            type="input"
            class="form__field"
            name="name"
            value={this.state.input}
            onChange={this.handleChange}
          />
          <label for="name" class="form__label"></label>

          <button type="submit">Submit!</button>
        </form>
        {this.state.inputSubmitted ? (
          <SeriesInfos query={this.state.submit} />
        ) : (
          <div />
        )}
      </div>
    );
  }
}

class SeriesInfos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      name: "",
      id: -1,
      isLoaded: false,
    };
  }

  componentDidMount() {
    fetch(
      "https://api.themoviedb.org/3/search/tv?api_key=" +
        apiKey +
        "&page=1&query=" +
        this.props.query
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          id: json["results"][0]["id"],
          isLoaded: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  /*
  searchForShow() {
    let result = console.log(result);
    let firstEntry = this.state.data["results"][0];
    this.setState({
      name: firstEntry["name"],
      id: firstEntry["id"],
    });
  }

  getShowInfoByID() {
    console.log("fick mich");
    if (this.state.id != -1) {
      let result = fetch(
        "https://api.themoviedb.org/3/tv/" +
          this.state.id +
          "?api_key=" +
          apiKey
      ).then((response) => response.json());
      console.log("SHOW INFOS");
      console.log(result);
    }
  }

*/

  render() {
    const { isLoaded, id } = this.state;

    if (!isLoaded) return <div>Loading...l</div>;

    return (
      <div>
        <h2>It takes</h2>
        <ShowResult showId={id} />
      </div>
    );
  }
}

class ShowResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: null,
      watchtime: -1,
    };

    this.minutesToDhm = this.minutesToDhm.bind(this);
  }

  componentDidMount() {
    console.log("look at me_" + this.props.showId);
    fetch(
      "https://api.themoviedb.org/3/tv/" +
        this.props.showId +
        "?api_key=" +
        apiKey
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          data: json,
          isLoaded: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("Data from that show");
  }

  minutesToDhm(minutes) {
    let seconds = Number(minutes) * 60;
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);

    var dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    let output = dDisplay + hDisplay + mDisplay;
    return output.slice(0, -2);
  }

  render() {
    const { isLoaded, data } = this.state;
    if (isLoaded) {
      console.log(this.state.data);
      let watchtimeString;

      let episodeRunTime = data["episode_run_time"][0];
      let numberOfEpisodes = data["number_of_episodes"];
      let watchtimeInMinutes = episodeRunTime * numberOfEpisodes;
      watchtimeString = this.minutesToDhm(watchtimeInMinutes);

      return <div id="watchtime_result">{watchtimeString}</div>;
    } else {
      return <div>Loading...</div>;
    }
  }
}

export default App;
