import User from './User';
import Seller from './Seller';

export default class Chat {
        _id: string;
  sessionId: string;
    members: [user: User, seller: Seller];

  constructor() {
    this._id       = '';
    this.sessionId = '';
    this.members   = [
      { _id: '', username: '', email: '' },
      { _id: '', username: '', listing: { _id: '', title: '', price: 0, imageUrl: '' } },
    ];
  }
}
