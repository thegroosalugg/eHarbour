export default class Listing {
  description: string;
     imageUrl: string;
        price: number;
        title: string;
          _id: string;
       userId: string;
    username?: string | undefined;
  isLoggedIn?: string | undefined;

  constructor() {
    this.description = '';
    this.imageUrl    = '';
    this.price       =  0;
    this.title       = '';
    this._id         = '';
    this.userId      = '';
  }
}
