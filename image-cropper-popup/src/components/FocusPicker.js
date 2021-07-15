import { noop } from '../helper/noop';
import { assign } from '../helper/assign';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import retina from '../images/retina.svg';

const IMAGE_STYLES = {
  // Get rid of bottom padding from default display
  display: 'block',
  // Make image fill container
  maxWidth: '100%',
  // Prevent Android refresh on pull down
  touchAction: 'none'
};

const RETINA_STYLES = {
  position: 'absolute',
  cursor: 'move',
  // Center the retina
  transform: 'translate(-50%, -50%)'
};

const DEFAULT_OPTIONS = {
  onChange: noop,
  retina
};

export default class FocusPicker {
  constructor(imageNode, options = {}) {
    // Merge options in
    this.options = assign({}, DEFAULT_OPTIONS, options);

    // Set up references
    this.img = imageNode;
    this.container = document.getElementById('test-container');
    if (!document.getElementById('retina')) {
      this.retina = document.createElement('img');
      this.retina.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAnFBMVEUAAACqqqrMzMyqqqrV1dW2trYAAAAHBwfGxsYcHBzHx8cfHx8hISHIyMjGxsbJycnIyMhXV1dYWFh4eHh5eXnT09Ofn5/S0tKfn5+hoaGioqKjo6OkpKSlpaWmpqbX19fY2NjY2NjZ2dnY2Njj4+Pd3d3j4+Pd3d3e3t7k5OTl5eXk5OTl5eXl5eXp6enq6urr6+vr6+vu7u7///+LRybgAAAAM3RSTlMAAwUGBgdMTVFSUlNUVFVVWGRlcXKFh4eIiImKiouMmpucnJ7BwsLDw8PDxMTF09PU2NvakuVfAAAAAWJLR0QzN9V8XgAAALtJREFUGNNtkNkOgkAQBAdUUBA5BAUFReTyXLf//+OEDSAbrLepZDI9TdSycLLy8ykzZ0EDmxc6nlanlD1QxO5q5cYVEChC7sF3uibQQ45A7IJvtQGfw2huvBBqIyI8ZuSg0MdSr2HTFUdNIkFKN7iy9FASgylLE2wq13j/X78gluUJ5yZSNY00fyIay0MbnixwX3pz2T4fgEd9IYeuEFICoE480/SSeqiOyLj3Jd+NX/WqneaM5amtivEL0wgahXIx7KIAAAAASUVORK5CYII=";
      this.retina.id = 'retina';
      this.retina.className = 'ui-widget-content draggable';
      this.retina.draggable = true;
      document.getElementById('test-container').appendChild(this.retina);
    } else {
      this.retina = document.getElementById('retina');
    }

    // Set up image
    this.img.draggable = false;

    // Bind events
    this.startListening();

    // Assign styles
    assign(this.img.style, IMAGE_STYLES);
    assign(this.retina.style, RETINA_STYLES);
    // assign(this.container.style, CONTAINER_STYLES);

    let container = document.getElementById('test-container');

    // Initialize Focus coordinates
    this.focus = this.options.focus
      ? this.options.focus : {
        x: parseFloat(container.getAttribute('data-focus-x')) || 0,
        y: parseFloat(container.getAttribute('data-focus-y')) || 0
      };

    // Set the focus
    if (!(this.retina.style.top || this.retina.style.left)) {
      this.setFocus(this.focus);
    }
  }

  startListening() {
    // Bind container events
    this.retina.addEventListener('click', this.event);
    this.retina.addEventListener('mousedown', this.startDragging);
    this.container.addEventListener('mousemove', this.handleMove);
    this.container.addEventListener('mouseup', this.stopDragging);
    this.container.addEventListener('mouseleave', this.stopDragging);
    this.container.addEventListener('touchend', this.stopDragging);

    // temporarily cast config objs until this issue is resolved
    // https://github.com/Microsoft/TypeScript/issues/9548
    this.retina.addEventListener('touchstart', this.startDragging, {
      passive: true
    });
    this.container.addEventListener('touchmove', this.handleMove, {
      passive: true
    });

    this.container.addEventListener('load', this.updateRetinaPositionFromFocus);
  }

  stopListening() {
    this.retina.removeEventListener('mousedown', this.startDragging);
    this.container.removeEventListener('mousemove', this.handleMove);
    this.container.removeEventListener('mouseup', this.stopDragging);
    this.container.removeEventListener('mouseleave', this.stopDragging);
    this.container.removeEventListener('touchend', this.stopDragging);
    this.retina.removeEventListener('touchstart', this.startDragging);
    this.container.removeEventListener('touchmove', this.handleMove);
    this.container.removeEventListener('load', this.updateRetinaPositionFromFocus);
  }

  setFocus(focus) {
    this.focus = focus;
    let container = document.getElementById('test-container');
    container.setAttribute('data-focus-x', focus.x.toString());
    container.setAttribute('data-focus-y', focus.y.toString());
    this.updateRetinaPositionFromFocus();
    this.options.onChange(focus);
  }

  event = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.retina.removeEventListener('mousedown', this.startDragging);
  }

  startDragging = (e) => {
    $('#retina').draggable({ containment: '#test-container' });
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = true;
    e instanceof MouseEvent
      ? this.updateCoordinates(e.clientX, e.clientY)
      : this.updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
  };

  handleMove = (e) => {
    $('#retina').draggable({ containment: '#test-container',  scroll: false });
    e.preventDefault();
    if (e instanceof MouseEvent) {
      this.updateCoordinates(e.clientX, e.clientY);
    } else {
      const touch = e.touches[0];
      const touchedEl = document.elementFromPoint(touch.pageX, touch.pageY);

      touchedEl !== this.retina && touchedEl !== this.container
        ? this.stopDragging()
        : this.updateCoordinates(touch.clientX, touch.clientY);
    }
  };

  stopDragging = () => {
    this.isDragging = false;
  };

  calculateOffsetFromFocus() {
    let compStyle = window.getComputedStyle(document.getElementById('test-container'));
    let height = parseFloat(compStyle.getPropertyValue('height'));
    let width = parseFloat(compStyle.getPropertyValue('width'));
    const offsetX = width * (this.focus.x / 2 + 0.5);
    const offsetY = height * (this.focus.y / -2 + 0.5);

    return { offsetX, offsetY };
  }

  updateRetinaPositionFromFocus = () => {
    this.updateRetinaPosition(this.calculateOffsetFromFocus());
  };

  updateRetinaPosition = (offsets) => {
    this.retina.style.top = `${(offsets.offsetY - 20)}px`;
    this.retina.style.left = `${(offsets.offsetX - 20)}px`;
  };

  updateCoordinates(clientX, clientY) {
    if (!this.isDragging) return; // bail if not dragging
    let compStyle = window.getComputedStyle(document.getElementById('test-container'));
    let height = parseFloat(compStyle.getPropertyValue('height'));
    let width = parseFloat(compStyle.getPropertyValue('width'));
    let top = parseFloat(compStyle.getPropertyValue('top'));
    let left = parseFloat(compStyle.getPropertyValue('left'));

    let elTop = document.getElementById("image-tool").getBoundingClientRect().top + 35; 
    let elLeft = document.getElementById("image-tool").getBoundingClientRect().left; 

    // Calculate FocusPoint coordinates
    const offsetX = (clientX - left) - elLeft;
    const offsetY = (clientY - top) - elTop;

    const x = (offsetX / width - 0.5) * 2;
    const y = (offsetY / height - 0.5) * -2;

    // TODO: Figure out an elegant way to use the setFocus API without
    // having to recalculate the offset from focus
    this.setFocus({ x, y });
  }
}
