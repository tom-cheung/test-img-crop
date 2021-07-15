/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import "./styles/style.css";
import Dragula from "react-dragula";
import { WindowOpener } from "./components/windowOpener";
import ContentstackUIExtension from "@contentstack/ui-extensions-sdk";


export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.extension = {};
    this.state = {
      message: "",
      croppedImage: [],
      allImages: [],
      config: {},
    };
    this.sonResponse = this.sonResponse.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
  }

  componentDidMount() {
    ContentstackUIExtension.init().then((extension) => {
      let savedAsset = extension.field.getData();
      let assetQuery = extension.stack.Asset.Query();
      extension.window.enableAutoResizing();

      console.log('initialVideos', savedAsset);

      assetQuery.regex('content_type', 'image/*')
        .find().then((result) => {
          this.setState({
            allImages: result
          })
        }).catch((err) => {
          console.log(err);
        });

      if (savedAsset !== null && savedAsset !== undefined && !this.isEmpty(savedAsset)) {
        this.setState({
          config: extension.config,
          croppedImage: savedAsset
        }, () => {
          this.extension = extension;
          extension.window.enableAutoResizing();
          window.addEventListener("message", receiveMessage, false);
        });
      } else {
        this.setState({
          config: extension.config,
        }, () => {
          this.extension = extension;
          extension.window.enableAutoResizing();
          window.addEventListener("message", receiveMessage, false);
        });
      }
    });

    const receiveMessage = (event) => {
      const { data } = event;
      const { croppedImage, allImages, config } = this.state;

      if (data.getConfig) {
        event.source.postMessage(
          {
            message: "Sending Config files",
            config,
            croppedImage: croppedImage,
            allImages: allImages
          },
          event.origin
        );
      } else if (data.croppedImage) {
        this.saveExtensionData(data.croppedImage);
      }
    };
  }

  saveExtensionData(images) {
    let extensionData = [];

    images.forEach(selected => {
      extensionData.push(selected);
    });

    console.log('saveExtensionData', images, extensionData);
    this.extension.field.setData(extensionData);
    this.setState({ croppedImage: images });
  }

  removeVideo = (e) => {
    let id = e.currentTarget.dataset.id;
    let { croppedImage } = this.state;

    croppedImage.splice(
      croppedImage.findIndex((index) => index.uid === id),
      1
    );

    this.saveExtensionData(croppedImage);
  }

  sonResponse(err, res) {
    if (err) {
      this.setState({ message: res.message });
    }
  }

  dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = {
        copySortSource: true,
      };
      Dragula([componentBackingInstance], options);
    }
  };

  isEmpty(obj) {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  }

  bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    let ii = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, ii), 2) + ' ' + sizes[ii];
  }

  render() {
    const { croppedImage, config, allImages } = this.state;
    console.log('this.state parent', this.state);

    return (
      <header className="App-header">
        <div className="wrapper">
          <div className="container">
            <div className="reference-loading" style={{ display: "none" }}>
              <div className="loading-flash">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div className="main">
              <div className="selected-item">
                <div className="row selected-list">
                  <ul className="drag1" ref={this.dragulaDecorator}>
                    {croppedImage?.map((asset, index) => {
                      return (
                        <li id={asset.uid} key={index}>
                          <div className="file">
                            <a
                              href={asset.croppedUrl}
                              target="_blank"
                              className="fileimage"
                            >
                              <span className="fileimg">
                                <img src={asset.croppedUrl}></img>
                              </span>
                            </a>
                            <span>{asset.fileName}</span>
                            <span className="file-size">
                              {this.bytesToSize(asset.fileSize)}
                            </span>
                            <div className="file-action trash" data-id={asset.uid} onClick={this.removeVideo.bind(this)}>
                              <span className="close-icon"></span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <WindowOpener
            url={config.redirectUrl}
            bridge={this.sonResponse}
            croppedImage={croppedImage}
            allImages={allImages}
          >
            Crop Image
          </WindowOpener>
        </div>
      </header>
    );
  }
}
