import React from "react";
import FocalCrop from "./FocalCrop";
import "../styles/modal.css";

export default class Modal extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      selectedImage: undefined,
      croppedImage: [],
      croppedImageObj: undefined
    };
  }

  componentDidMount() {
    new Portfolio(document.querySelector('.my-image-gallery'));
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { croppedImage } = this.props;

    if (newProps.croppedImage !== croppedImage) {
      this.setState({
        selectedImage: newProps.croppedImage[0],
        croppedImage: newProps.croppedImage
      });
    } else {
      this.setState({
        selectedImage: newProps.allAssets[0]
      })
    }
  }

  sendAndClose = (closeandsend) => {
    const { croppedImage, croppedImageObj } = this.state;

    const newlist = [...croppedImage];
    const filteredList = newlist.filter((img)=> img.uid === croppedImageObj.uid);
    // console.log('newlist before', newlist, filteredList);

    if(filteredList.length > 0) {
      const croppedImageIndex = newlist.findIndex(
        (index) => index.uid === croppedImageObj.uid
      )
      newlist[croppedImageIndex] = croppedImageObj;
    } else {
      newlist.push(croppedImageObj)
    }

    // console.log('newlist', newlist);

    this.setState({
      croppedImage: newlist
    });

    closeandsend
      ? this.props.closeWindow(newlist)
      : this.props.closeWindow([]);
  }

  update = (data) => {
    if (data.hasOwnProperty("asset")) {
      let croppedImageObj = {
        "fileName": (data.hasOwnProperty("asset") && data.asset.filename),
        "uid": (data.hasOwnProperty("asset") && data.asset.uid),
        "fileSize": (data.hasOwnProperty("asset") && data.asset.file_size),
        "originalUrl": data.src,
        "croppedUrl": (data.hasOwnProperty("originalImage") && data.src + '?disposition=inline&crop=' + data.originalImage.cropWidth + ',' + data.originalImage.cropHeight + ',x' + data.originalImage.cropX + ',y' + data.originalImage.cropY),
        "croppedCoords": (data.hasOwnProperty("originalImage") && data.originalImage),
        "focalPoint": (data.hasOwnProperty("newFocus") && data.newFocus)
      }

      this.setState({
        croppedImageObj: croppedImageObj
      });
    }
  }

  cropImage = (image) => {
    this.setState({
      selectedImage: image
    });
  }

  render() {
    const { selectedImage } = this.state;
    // console.log('this.state', this.state, this.props);

    return (
      <div className="modal display-block">
        <section className="modal-main">
          {this.props.children}
          <div className="modal-header">
            <h2>Edit Images</h2>
          </div>
          <div className="slider">
            <div className="pf-carousel my-image-gallery">
              <div className="pf-slider">
                {this.props.allAssets.length > 0 && this.props.allAssets.map((image, index) => {
                  return (
                    <div className="pf-item" key={index}>
                      <img src={image.url} alt={image.title} className="carousel-img" id={image.uid} onClick={() => this.cropImage(image)} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="modal-body">
            <FocalCrop
              src={selectedImage !== undefined && selectedImage.url}
              asset={selectedImage && selectedImage}
              data={this.update}
            />
          </div>
          <div className="modal-footer">
            <div className="right">
              <button
                className="cancel-btn btn"
                onClick={() => this.sendAndClose(false)}
              >
                Cancel
              </button>
              <button
                className="add-btn btn"
                onClick={() => this.sendAndClose(true)}
              >
                Save
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
