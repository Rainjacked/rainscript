/**
 * A singly persistent linked list.
 */
export class LinkedList {
  /**
   * Constructs a new LinkedList.
   * @param {*} head data associated with the first node in the linked list
   * @param {LinkedList} tail a pointer to the next node in the linked list
   */
  constructor (head, tail) {
    let size = tail instanceof LinkedList ? tail.size() + 1 : 0;
    this.head = (h) => h === undefined ? head : (head = h);
    this.tail = () => tail;
    this.size = () => size;
  }
  /**
   * Creates a new LinkedList extended with data as new head.
   * @param {*} data the new head of the extended linked list
   */
  push (data) {
    return new LinkedList(data, this);
  }
}
