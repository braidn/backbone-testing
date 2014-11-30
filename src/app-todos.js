if (typeof todoApp === 'undefined') todoApp = {};

todoApp.Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    complete: false
  },
  initialize: function() {
    this.on("change", function() { this.save(); });
  },
  toggleStatus: function() {
    this.set("complete", !this.get("complete"));
  }
})

todoApp.Todos = Backbone.Collection.extend({
  model: todoApp.Todo,
  url: "api/todos"
})

todoApp.TodosList = Backbone.View.extend({
  tagName: "ul",
  initialize: function() {
    this.collection.on("add", this.addOne, this)
  },
  render: function() {
    this.addAll();
    return this;
  },
  addAll: function() {
    this.collection.each(this.addOne, this);
  },
  addOne: function(todo) {
    var item = new todoApp.TodoListItem({ model: todo });
    this.$el.append(item.render().el);
  }
})

todoApp.TodoListItem = Backbone.View.extend({
  tagName: 'li',
  template: _.template(
    "<label>"
    + "<input type='checkbox' <% if(complete) print('checked') %>/>"
    + "<%= title %>"
    + "</lable>"
  ),
  events: {
    "click input": "statusChanged"
  },
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },
  statusChanged: function() {
    this.model.toggleStatus();
  }
})
