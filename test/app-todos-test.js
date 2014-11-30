var should = chai.should();

describe("Application", function() {
  it("creates a global variable for the name space", function() {
    should.exist(todoApp);
  })
})

describe("Todo Model", function() {
  describe("Initialization", function() {
    beforeEach(function() {
      this.todo = new todoApp.Todo();
    })
    it("will default the status to pending", function() {
      this.todo.get('complete').should.be.false;
    })
    it("will default the title to an empty string", function() {
      this.todo.get('title').should.equal('');
    })
  })
})

describe("Persistence", function() {
  beforeEach(function () {
    this.todo = new todoApp.Todo();
    this.save_stub = sinon.stub(this.todo, "save");
  })
  afterEach(function() {
    this.save_stub.restore();
  })
  it("updates the server when title has changed", function() {
    this.todo.set("title", "New Summary");
    this.save_stub.should.have.been.calledOnce;
  })
  it("updates the server when the status has changed", function() {
    this.todo.set('complete', true);
    this.save_stub.should.have.been.calledOnce;
  })
})

describe("Todo List Item View", function() {
  // if using react this would be where the testing would take place
  beforeEach(function() {
    this.todo = new todoApp.Todo({title: 'Summary'});
    this.item = new todoApp.TodoListItem({model: this.todo});
    this.save_stub = sinon.stub(this.todo, "save");
  })
  afterEach(function() {
    this.save_stub.restore();
  })
  it("calling the render method will return the view object", function() {
    this.item.render().should.equal(this.item);
  })
  it("renders as a list item", function() {
    this.item.render().el.nodeName.should.equal("LI");
  })
  describe("Template", function() {
    beforeEach(function() {
      this.item.render();
    })
    it("contains the todo title as text", function() {
      this.item.$el.text().should.have.string("Summary");
    })
    it("includes a label for the status", function() {
      this.item.$el.find("label").should.have.length(1);
    })
    it("includes an input checkbox", function() {
      this.item.$el.find("label>input[type='checkbox']").should.have.length(1);
    })
    it("be clear by default for pending todos", function() {
      this.item.$el.find("label>input[type='checkbox']").is(":checked").should.be.false;
    })
    it("be set for completed todos", function() {
      this.todo.set("complete", true);
      this.item.render();
      this.item.$el.find("label>input[type='checkbox']").is(":checked").should.be.true;
    })
  })
  describe("Todos List Collection View", function() {
    beforeEach(function(){
      this.todos = new todoApp.Todos([
        {title: "Todo Item 1"},
        {title: "Todo Item 2"}
      ]);
      this.list = new todoApp.TodosList({collection: this.todos});
    })
    it("render function returns the view object", function() {
      this.list.render().should.equal(this.list);
    })
    it("renders as an unordered list", function() {
      this.list.render().el.nodeName.should.equal("UL");
    })
    it("include list items for all models in collection", function() {
      this.list.render();
      this.list.$el.find("li").should.have.length(2);
    })
  })
  describe("Collection's Interaction with REST API", function() {
    beforeEach(function() {
      this.ajax_stub = sinon.stub($, "ajax").yieldsTo("success", [
        {id: 1, title: "Mock Summary1", complete: false},
        {id: 2, title: "Mock Summary2", complete: true}
      ])
      this.todos = new todoApp.Todos()
      this.todos.fetch();
    })
    afterEach(function() {
      this.ajax_stub.restore();
    })
    it("loads a collection using the API", function() {
      this.todos.should.have.length(2);
      this.todos.at(0).get('title').should.equal("Mock Summary1");
      this.todos.at(1).get('title').should.equal("Mock Summary2");
    })
  })
})
