export class LinkedList {

  /**
   * Constructs a new linked list based on data
   * from another linked list.
   * @param {*} value either a pair of data and LinkedList
   *                  or another LinkedList
   */
  constructor (value) {
    if (value instanceof LinkedList) {
      // copy constructor
      this.head = value.head;
      this.tail = value.tail;
      this.size = value.size;
      return;
    }
    let elem = value === undefined ? [undefined, this] : value;
    let _size = value === undefined ? 0 : value.size();
    /**
     * Gets the head (data) associated with this linked list.
     */
    this.head = () => elem[0];

    /**
     * Gets the tail (LinkedList) pointed by this linked list.
     */
    this.tail = () => elem[1];

    /**
     * Gets the size of this linked list.
     */
    this.size = () => _size;
  }
  /**
   * Creates a new linked list with new data.
   * @param {*} data 
   */
  push (data) {
    return new LinkedList([data, this]);
  }
}
