import React, { Fragment } from 'react';
import FocusedImage from './FocusedImage';
import FocusPicker from './FocusPicker';
import ReactCrop from './react-crop';
import '../styles/react-crop.scss';
import '../styles/style.scss';

export default class FocalCrop extends React.PureComponent {
  state = {
    crop: {
      unit: 'px',
      width: 100,
      height: 100
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);

    if (this.state.croppedImageUrl) {
      const focusedImageElements = document.querySelectorAll('.focused-image');
      const focusedImages = [];
      Array.prototype.forEach.call(focusedImageElements, (imageEl) => {
        focusedImages.push(
          new FocusedImage(imageEl)
        );
      });

      const focusPickerEl = document.getElementById('focus-picker-img');
      new FocusPicker(focusPickerEl, {
        onChange: (focus) => {
          const x = focus.x.toFixed(2);
          const y = focus.y.toFixed(2);
          this.setState({ newFocus: { x: parseFloat(x), y: parseFloat(y) } });

          focusedImages.forEach(focusedImage => {
            focusedImage.setFocus(this.state.newFocus);
          });
        },
        focus: this.state.newFocus
      });
    }
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    let originalImage = {};

    image.crossOrigin = 'anonymous';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    originalImage.cropWidth = (image.naturalWidth * crop.width) / image.width;
    originalImage.cropHeight = (image.naturalHeight * crop.height) / image.height;
    originalImage.cropX = (image.naturalWidth * crop.x) / image.width;
    originalImage.cropY = (image.naturalHeight * crop.y) / image.height;

    this.setState({ 
      originalImage: originalImage,
      src: this.props.src,
      asset: this.props.asset 
    });

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        if (!blob) {
          // reject(new Error('Canvas is empty'));
          // eslint-disable-next-line
          console.error('Canvas is empty');
          return;
        }

        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);

        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  render() {
    const { crop, croppedImageUrl } = this.state;
    // console.log('focalCrop', this.props, this.state);
    return (
      <div className="container" id="image-tool">
        <div className="row">
          <div className="col">
            <div className="image-cropper">
              {this.props.src && (
                <ReactCrop
                  src={this.props.src}
                  crop={crop}
                  ruleOfThirds
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                  keepSelection={true}
                />
              )}
            </div>

            <div className="image-focus" onLoad={this.props.data(this.state)}>
              {croppedImageUrl && (
                <>
                  <h2>Preview</h2>
                  <div className="grid previews">
                    <div className="focus-container">
                      <h4>Portrait</h4>
                      <div className="img-container">
                        <div className="top-left" style={{ height: '177.86%', width: '100%' }}>
                          <div style={{ marginTop: '177.86%' }}></div>
                          <img className="focused-image" src={croppedImageUrl} alt="" data-focus-x="0" data-focus-y="0" />
                        </div>
                      </div>
                    </div>

                    <div className="focus-container">
                      <h4>Square</h4>
                      <div className="img-container">
                        <div className="top-left" style={{ height: '100%', width: '100%' }}>
                          <div style={{ marginTop: '100%' }}></div>
                          <img className="focused-image" src={croppedImageUrl} alt="" data-focus-x="0" data-focus-y="0" />
                        </div>
                      </div>
                    </div>

                    <div className="focus-container">
                      <h4>Landscape</h4>
                      <div className="img-container">
                        <div className="top-left" style={{ height: '56.25%', width: '100%' }}>
                          <div style={{ marginTop: '56.25%' }}></div>
                          <img className="focused-image" src={croppedImageUrl} alt="" data-focus-x="0" data-focus-y="0" />
                        </div>
                      </div>
                    </div>

                    <div className="focus-container">
                      <h4>Panorama</h4>
                      <div className="img-container">
                        <div className="top-left" style={{ height: '25%', width: '100%' }}>
                          <div style={{ marginTop: '25%' }}></div>
                          <img className="focused-image" src={croppedImageUrl} alt="" data-focus-x="0" data-focus-y="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
