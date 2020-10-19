import * as thebe from '../src';
import {appendConfig} from './helpers';

/**
 * Test the bootstrapping process
 */
describe("bootstrap", () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  // TODO: consider using karma-fixture
  it("thebelab.events exists", async () => {
    expect(thebe).to.have.property("events");
  })
  it("should render a pre[data-executable] tags", async function() {
    this.timeout(20000);
    const pre = document.createElement('pre')
    pre.innerHTML = 'print("Hello Thebe!");'
    pre.setAttribute('data-executable', 'true');
    document.body.appendChild(pre);

    await thebe.bootstrap();

    const cells = document.body.getElementsByClassName("thebe-input")
    expect(cells.length).to.equal(1)
  });

})
