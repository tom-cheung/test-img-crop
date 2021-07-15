import React from "react";
import Modal from "./components/modal";

export class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      config: undefined,
      croppedImage: [],
      allAssets: []
    };
    this.onCloseWindow = this.onCloseWindow.bind(this);
  }

  componentDidMount() {
    // this route should only be available from a popup
    if (!window.opener) {
      window.close();
    }
    window.opener.postMessage(
      { message: "get config and other data", getConfig: true },
      "*"
    );
    const receiveMessage = ({ data }) => {
      if (data.config) {
        this.setState({
          message: data.message,
          config: data.config,
        });
      }
      if (data.croppedImage) {
        this.setState({
          message: data.message,
          croppedImage: data.croppedImage,
        });
      }
      if (data.allImages) {
        this.setState({
          message: data.message,
          allAssets: data.allImages.assets
        });
      }
    };
    window.addEventListener("message", receiveMessage, false);
  }

  onCloseWindow = (croppedImage) => {
    croppedImage.length > 0
      ? window.opener.postMessage(
        {
          message: "sending cropped image",
          croppedImage: croppedImage,
        },
        "*"
      )
      : window.opener.postMessage(
        {
          message: "Window closed sending cropped image",
        },
        "*"
      );

    window.close();
  };

  render() {
    const { config, croppedImage, allAssets } = this.state;

    return (
      <div>
        {config && (
          <Modal
            config={config}
            closeWindow={this.onCloseWindow}
            croppedImage={croppedImage}
            allAssets={allAssets}
          />
        )}
      </div>
    );
  }
}
