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
    const { request } = self.props.steps;
    axios
      .post("http://api.nuckles.blur.tech/api/messages", {
        message: request.message
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
            {trigger && this.triggetNext()}
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
    headerTitle="NUCKles"
    placeholder="Введите сообщение..."
    steps={[
      {
        id: "1",
        message: "Привет. Я бот NUCKles!",
        trigger: "request"
      },
      {
        id: "request",
        user: true,
        trigger: "3"
      },
      {
        id: "3",
        asMessage: true,
        component: <DBPedia />,
        waitAction: true,
        trigger: "request"
      }
    ]}
  />
);

export default App;
