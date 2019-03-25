import React, { Component } from "react";
import PropTypes from "prop-types";
import ChatBot, { Loading } from "react-simple-chatbot";

import axios from "axios";
class DBPedia extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: "",
      trigger: false,
      message: ""
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  request = () => {
    const self = this;
    console.log(self.props);
    axios
      .post("http://api.nuckles.blur.tech/api/messages", {
        message: "Привет"
      })
      .then(function(response) {
        self.setState({
          loading: false,
          result: response.data.data.message,
          trigger: true
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  componentDidMount() {
    this.request();
  }

  // componentWillMount() {
  //   const self = this;
  //   const { steps } = this.props;
  //   const search = steps.search.value;
  //   const endpoint = encodeURI("https://dbpedia.org");
  //   const query = encodeURI(`
  //     select * where {
  //     ?x rdfs:label "${search}"@en .
  //     ?x rdfs:comment ?comment .
  //     FILTER (lang(?comment) = 'en')
  //     } LIMIT 100
  //   `);

  //   const queryUrl = `https://dbpedia.org/sparql/?default-graph-uri=${endpoint}&query=${query}&format=json`;

  //   const xhr = new XMLHttpRequest();

  //   xhr.addEventListener("readystatechange", readyStateChange);

  //   function readyStateChange() {
  //     if (this.readyState === 4) {
  //       const data = JSON.parse(this.responseText);
  //       const bindings = data.results.bindings;
  //       console.log(data);
  //       if (bindings && bindings.length > 0) {
  //         self.setState({ loading: false, result: bindings[0].comment.value });
  //       } else {
  //         self.setState({ loading: false, result: "Not found." });
  //       }
  //     }
  //   }

  //   xhr.open("GET", queryUrl);
  //   xhr.send();
  // }

  triggetNext() {
    this.setState({ trigger: false }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { trigger, loading, result } = this.state;
    return (
      <div className="dbpedia">
        {loading ? <Loading /> : result}
        {!loading && (
          <div
            style={{
              textAlign: "center",
              marginTop: 20
            }}
          >
            {!trigger && (
              <button onClick={() => this.triggetNext()}>Search Again</button>
            )}
          </div>
        )}
      </div>
    );
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func
};

DBPedia.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined
};

const App = () => (
  <ChatBot
    steps={[
      {
        id: "1",
        message: "Type something to search on Wikipédia. (Ex.: Brazil)",
        trigger: "2"
      },
      {
        id: "2",
        user: true,
        trigger: "3"
      },
      {
        id: "3",
        component: <DBPedia />,
        waitAction: true,
        trigger: "1"
      }
    ]}
  />
);

export default App;
