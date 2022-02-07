// Option 2: A "page number" input that accepts a number and changes
// a property called page on your element to request a specific page of results
import { LitElement, css, html } from 'lit';
import '@lrnwebcomponents/date-card';
import '@lrnwebcomponents/accent-card';

class NasaImageSearch extends LitElement {
  constructor() {
    super();
    // this.dates = [];
    this.loadData = false;
    // this.view = 'card';
    this.page = 1;
    // this.title = 'someName';
    this.description = 'someDesc';
    this.secondary_creator = 'someCreator';
    this.media_type = 'someImage';
    this.images = [];
    this.name = 'moon land';
  }

  static get properties() {
    return {
      title: { type: String, reflect: true },
      description: {
        type: String,
        reflect: true,
      },
      secondary_creator: {
        type: String,
        reflect: true,
        // attribute: 'load-data',
      },
      page: { type: Number, reflect: true },
      media_type: { type: String, reflect: true },
      name: { type: String, reflect: true },
      loadData: { type: Boolean, reflect: true, attribute: 'load-data' },
      image: { type: Array },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getData();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'loadData' && this[propName]) {
        this.getData();
      }
    });
  }

  async getData() {
    // special JS capability to resolve a URL path relative to the current file
    // //const file = new URL('./response.json', import.meta.url).href;
    const file = `http://images-api.nasa.gov/search?q=${this.title}&${this.page}&media_type=image`;

    // go get our data from the file

    fetch(file)
      .then(
        resp => {
          if (resp.ok) {
            return resp.json();
          }
          return false;
        }
        // convert to json; I skip the .ok here because it's a local file
        // but remote requests should check for a valid response
      )
      .then(data => {
        console.log(data);
        this.images = [];
        // many ways to loop here -- https://www.codespot.org/ways-to-loop-through-an-array-in-javascript/#:~:text=6%20Ways%20to%20Loop%20Through%20an%20Array%20in,callback%20function%20for%20each%20element%20in%20the%20array.
        // for loop runs synchronously though
        // this line prevents the linter from being mad since this is kinda a crappy old way of doing this :)
        // details: https://masteringjs.io/tutorials/eslint/ignore#:~:text=You%20can%20use%20comments%20to%20disable%20all%20ESLint,root%20directory..eslintignore%20syntax%20is%20similar%20to%20that%20of.gitignore.
        /* eslint-disable */
        for (let i = 0; i < data.collection.items.length; i++) {
          // the API we're drawing in is confusing, let's simplify for internal usage to our element
          const results = {
            image: data.collection.items[i].links[0].href,
            description: data.collection.items[i].data[0].description,
            title: data.collection.items[i].data[0].title,
            creator: data.collection.items[i].data[0].secondary_creator,
          };
          this.images.push(results);
          // brute force; just pull what looks like a date off the front for 01-31-22 format
          // I googled "javascript ow to convert date string into..." and skipped around
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
        }
      });
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 2px solid black;
        min-height: 100px;
      }
      date-card {
        display: inline-flex;
      }
      :host([view='list']) ul {
        margin: 20px;
      }
    `;
  }

  render() {
    const file = 'http://images-api.nasa.gov/search?q=${this.title},${this.';

    return html`
      ${this.images.map(
        item => html`
          <accent-card
            image-src="${item.image}"
            accent-color="black"
            horizontal
            style="max-width:600px;"
          >
            <div slot="heading">${item.title}</div>
            <div slot="content">Description: ${item.description}</div>
            <div slot="content">Photography: ${item.creator}</div>
          </accent-card>
        `
      )}
    `;
  }
}

customElements.define('nasa-image-search', NasaImageSearch);
