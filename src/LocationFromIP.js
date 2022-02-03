// dependencies / things imported
// Dependencies are snippets of code that enable one to perform certain actions during development
// importing LitElement, CSS, html from the library lit allows us to use said third-party code later on for styling/structure
// importing the wikipedia query web component encapsulates certain features, enabling us to use the html wikipedia page
// importing UserIP enables us to utilize the User's IP from the .js api
import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/wikipedia-query/wikipedia-query.js';
import { UserIP } from './UserIP.js';

// extends means LocationFromIP is the child class of LitElement, where LitElement helps build a web component and produces an HTML output
// LocationFromIP is the class name, return 'location-from-ip' is likely from the tag()

// The constructor : super() allows LocationFromIP to call the parent class' constructor (LitElement)
// this. refers to the object's original location (where it belongs), essentially changing the origin of the
// variable to be within the scope of the object, and assigning the variables a new value
export class LocationFromIP extends LitElement {
  static get tag() {
    return 'location-from-ip';
  }

  constructor() {
    super();
    this.UserIpInstance = new UserIP();
    this.locationEndpoint = 'https://freegeoip.app/json/';
    this.long = null;
    this.lat = null;
  }
  // properties are the values associated to an object, which are inherently unordered
  // by ordering the properties, one can assign values of some structure (in this case, a 
  // specific data type, and reflect[a global feature] which enables us to view aspects of the objects at compile time)

  static get properties() {
    return {
      long: { type: Number, reflect: true },
      lat: { type: Number, reflect: true },
      city: { type: String, reflect: true },
      region_name: { type: String, reflect: true },
    };
  }
// Keys are the names of changed properties; Values are the corresponding previous values. 
// Property changes inside this method will trigger an element update. 
// if there are changes in the parent class, update the properties below in the child class, and still run getGEOIPData()

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getGEOIPData();
  }

  // async allows one to write promise based code without blocking the execution thread
  // the execution will carry on, and when the promise is fulfilled, this code will run and return the expected value
  // promises are simply functions that may produce a value sometime in the future
  // const creates a read only reference to the value
  // await waits for a promise to return a value before execution
  // fetch() enables one to manipulate parts of the HTTP pipeline and retrieve data asynchronously
  // .json is a text-based way to represent javascript literals

  // what this code does: asynchronously gets the GEOIP data
  // creates a value reference of the UserIP data to the IPClass variable
  // creates a value reference of the user's IPData based on the user's IP, which was grabbed the line before 
  // notable, this line waits for the promise of the IPClass to be fulfilled before executing
  // returns the fetch of the locationEndpoint and ip of the User, which in turn returns a fetch of the response
  // that is read to completion in the resp.json() function.
  // The data is printed into the console, as the lat, long, city, and region are updates and returned 
  async getGEOIPData() {
    const IPClass = new UserIP();
    const userIPData = await IPClass.updateUserIP();
    return fetch(this.locationEndpoint + userIPData.ip)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        this.lat = data.latitude;
        this.long = data.longitude;
        this.city = data.city;
        this.state = data.region_name;
        return data;
      });
  }

  // just styles

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iframe {
          height: 500px;
          width: 500px;
        }
      `,
    ];
  }

  // render displays html code inside an html element (url, iframe, etc), enables us to bind the 
  // this.lat variable and this.long variable to a link, enabling us to create a url and update it
  // every time a properties() declared variable changes

  render() {
    // this function runs every time a properties() declared variable changes
    // this means you can make new variables and then bind them this way if you like
    const url = `https://maps.google.com/maps?q=${this.lat},${this.long}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return html`<iframe title="Where you are" src="${url}"></iframe>
      <ul>
        <a href="https://www.google.com/maps/@${this.lat},${this.long},14z">
          Open in Google Maps
        </a>
      </ul>
      <script>
        window.__appCDN = 'https://cdn.webcomponents.psu.edu/cdn/';
      </script>
      <script src="https://cdn.webcomponents.psu.edu/cdn/build.js"></script>
      <wikipedia-query search="${this.city}, ${this.state} "></wikipedia-query>
      <wikipedia-query search="${this.city}"></wikipedia-query>
      <wikipedia-query search="${this.state}"></wikipedia-query> `;
  }
}

customElements.define(LocationFromIP.tag, LocationFromIP);
