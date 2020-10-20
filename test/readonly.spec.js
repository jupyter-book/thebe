// import * as thebe from "../src";

describe("defaultEditable", () => {
	before(function(done){
		fixture.setBase('test/fixtures')
		this.start = fixture.load('HTML/readonly1.html');
		document.body.insertAdjacentHTML(
			'afterbegin',
			this.start);
		document.addEventListener("load", function(event) {
			console.log("DOM fully loaded and parsed");
			done();
		});
	});
	it("should be default editable", async () => {
		console.log(document.body)
	});
});

describe("defaultReadonly", () => {
	// TODO: consider using karma-fixture
	beforeEach(() => {
		// stop automatic bootstrap
		// `<script type="text/x-thebe-config">
		// {
		//   bootstrap: false
		// }
		// </script>
		// `
	});
	it("should define events", async () => {
		const thebe = await import("../src");
		expect(thebe).to.have.property("events");
	});
});
