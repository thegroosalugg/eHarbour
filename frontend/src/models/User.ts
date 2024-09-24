import Listing from "./Listing";
export default class User {
         _id: string;
       email: string;
    username: string;
   listings?: Listing[];

  constructor() {
    this._id      = '';
    this.email    = '';
    this.username = '';
    this.listings = [];
  }
}
